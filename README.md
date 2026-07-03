# Git Manager 🚀

本地可视化的 Git 多仓库管理工具，在浏览器中一键完成 Git 日常操作。

## 功能

- **项目管理** — 添加/删除 Git 项目，自动检测有效仓库
- **一键操作** — Status / Fetch / Pull / Push / Branch / Log / Diff / Stash
- **Commit + Push** — 点击 Push 弹窗输入提交说明，自动 add → commit → push
- **实时输出** — 终端风格输出面板，成功绿色、失败红色，一目了然
- **白天/黑夜模式** — 一键切换，偏好自动保存

## 技术栈

- 后端：Node.js + Express
- 前端：原生 HTML/CSS/JS，零框架依赖
- 暗色主题：仿 GitHub Dark 风格

## 快速开始

```bash
cd git_manager
npm install
npm start
```

浏览器打开 `http://localhost:3000`

## 项目结构

```
git_manager/
├── server.js          # Express 后端，REST API + git 命令执行
├── package.json       # 项目配置
├── projects.json      # 项目列表（自动生成）
└── public/
    └── index.html     # 前端界面
```

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/projects` | 获取项目列表 |
| POST | `/api/projects` | 添加项目 |
| DELETE | `/api/projects/:id` | 删除项目 |
| POST | `/api/projects/:id/run` | 执行 Git 操作 |
| GET | `/api/browse?path=` | 检测目录是否为 Git 仓库 |
