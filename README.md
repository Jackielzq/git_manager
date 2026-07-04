# Git Manager 🚀

本地可视化 Git 多仓库管理工具，告别命令行，在浏览器中一键完成日常 Git 操作。

## 功能

- **多项目管理** — 添加、重命名、删除 Git 项目，自动验证仓库有效性
- **一键操作** — Status、Fetch、Pull、Push、Branch、Log、Diff、Stash，点击即执行
- **提交推送** — 输入 commit 说明后自动执行 add → commit → push，一步到位
- **实时输出** — 终端风格面板，操作成功显示绿色，失败显示红色
- **文件夹选择器** — 原生 Windows 对话框选择仓库目录
- **白天/黑夜模式** — 一键切换，偏好自动保存

## 系统要求

- **Node.js** >= 16.x
- **Windows**（文件夹选择器依赖 Windows API）
- **Git** 已安装并配置

## 快速开始

### 方式一：克隆仓库

```bash
git clone https://github.com/Jackielzq/git_manager.git
cd git_manager
npm install
npm start
```

### 方式二：下载 ZIP

在 [Releases](https://github.com/Jackielzq/git_manager) 页面下载最新版本，解压后：

```bash
cd git_manager
npm install
npm start
```

### 启动后

浏览器打开 `http://localhost:3000`，或双击 `launch.bat` 一键启动并自动打开浏览器。

## 使用说明

1. 点击左侧「+ 添加项目」按钮
2. 输入项目名称，点击「选择文件夹」选择 Git 仓库目录
3. 点击左侧项目名进入管理界面
4. 使用顶部按钮执行对应 Git 操作
5. 输出结果实时显示在下方面板

## 技术栈

- 后端：Node.js + Express
- 前端：原生 HTML / CSS / JS，零框架依赖
- 风格：仿 GitHub Dark 主题

## 项目结构

```
git_manager/
├── server.js          # Express 后端，REST API + Git 命令执行
├── package.json       # 项目依赖配置
├── launch.bat         # 一键启动脚本
├── projects.json      # 项目列表数据（自动生成）
└── public/
    └── index.html     # 前端界面（单文件）
```

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/projects` | 获取所有项目 |
| POST | `/api/projects` | 添加项目 |
| PUT | `/api/projects/:id` | 更新项目名称 |
| DELETE | `/api/projects/:id` | 删除项目 |
| POST | `/api/projects/:id/run` | 执行 Git 操作 |
| GET | `/api/browse?path=` | 检测路径是否为 Git 仓库 |

## License

MIT
