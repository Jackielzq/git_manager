const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'projects.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function loadProjects() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {}
  return [];
}

function saveProjects(projects) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

let nextId = (() => {
  const list = loadProjects();
  return list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
})();

app.get('/api/projects', (_req, res) => {
  res.json(loadProjects());
});

app.post('/api/projects', (req, res) => {
  const { name, dir } = req.body;
  if (!name || !dir) return res.status(400).json({ error: 'name 和 dir 为必填' });
  const absDir = path.resolve(dir);
  if (!fs.existsSync(absDir)) return res.status(400).json({ error: '目录不存在: ' + absDir });
  if (!fs.existsSync(path.join(absDir, '.git'))) return res.status(400).json({ error: '该目录不是 git 仓库' });
  const projects = loadProjects();
  projects.push({ id: nextId++, name, dir: absDir });
  saveProjects(projects);
  res.json({ ok: true, id: nextId - 1 });
});

app.delete('/api/projects/:id', (req, res) => {
  let projects = loadProjects();
  projects = projects.filter(p => p.id !== parseInt(req.params.id, 10));
  saveProjects(projects);
  res.json({ ok: true });
});

// 目录检测（用于前端实时验证路径）
app.get('/api/browse', (req, res) => {
  let dir = req.query.path || '';
  if (!dir) return res.json({ path: '', error: '请输入路径' });
  const absDir = path.resolve(dir);
  if (!fs.existsSync(absDir)) return res.json({ path: absDir, error: '目录不存在' });
  const hasDotGit = fs.existsSync(path.join(absDir, '.git'));
  res.json({ path: absDir, hasDotGit });
});


// 原生文件夹选择器 (PowerShell + start /wait)
app.post('/api/pick-folder', (req, res) => {
  const psFile = path.join(__dirname, '_pick.ps1');
  const outFile = path.join(__dirname, '_pick_out.txt');

  // Simple script: no Chinese strings to avoid encoding issues
  const script = 'Add-Type -AssemblyName System.Windows.Forms\r\n' +
    '$d=New-Object System.Windows.Forms.FolderBrowserDialog\r\n' +
    '$d.Description="Select Git Repository Folder"\r\n' +
    '$d.ShowNewFolderButton=$false\r\n' +
    '$r=$d.ShowDialog()\r\n' +
    'if($r -eq "OK"){$d.SelectedPath | Out-File -FilePath (Join-Path $PSScriptRoot "_pick_out.txt") -Encoding utf8}';
  fs.writeFileSync(psFile, script, 'utf-8');
  try { fs.unlinkSync(outFile); } catch (e) {}

  // cmd /c start /wait forces a NEW VISIBLE WINDOW
  const cmd = 'cmd /c start "FolderPicker" /wait powershell -NoProfile -ExecutionPolicy Bypass -File "' + psFile + '"';
  exec(cmd, { timeout: 120000, windowsHide: false }, (err) => {
    try { fs.unlinkSync(psFile); } catch (e) {}
    let selected = '';
    try {
      selected = fs.readFileSync(outFile, 'utf-8').trim();
      fs.unlinkSync(outFile);
    } catch (e) {}
    res.json({ path: selected || null, cancelled: !selected });
  });
});

const COMMANDS = {
  status: 'git status --short -b',
  pull: 'git pull',
  push: 'git push',
  fetch: 'git fetch --all --prune',
  branch: 'git branch -a',
  log: 'git log --oneline -20',
  diff: 'git diff --stat',
  stash_list: 'git stash list',
  commit_push: '__SPECIAL__',
};

app.post('/api/projects/:id/run', (req, res) => {
  const { action, message } = req.body;
  if (!action || !COMMANDS[action]) return res.status(400).json({ error: '不支持的操作: ' + action });
  const projects = loadProjects();
  const project = projects.find(p => p.id === parseInt(req.params.id, 10));
  if (!project) return res.status(404).json({ error: '项目不存在' });

  let cmd;
  if (action === 'commit_push') {
    if (!message) return res.status(400).json({ error: '请输入 commit 说明' });
    cmd = 'git add -A && git commit -m "' + message.replace(/"/g, '\\"') + '" && git push';
  } else {
    cmd = COMMANDS[action];
  }
  exec(cmd, { cwd: project.dir, timeout: 60000 }, (err, stdout, stderr) => {
    res.json({ action, output: stdout || '', error: stderr || '', success: !err });
  });
});

app.listen(PORT, () => {
  console.log('Git Manager 已启动: http://localhost:' + PORT);
});