# My Agent

一个使用 TypeScript 从零开发的轻量级 AI Agent 项目。

本项目以 OpenAI Codex CLI 的核心设计为学习参考，逐步实现模型调用、Agent Loop、工具调用、上下文管理、Memory 等基础能力。

项目主要用于学习 Agent 的内部运行原理，所有核心逻辑尽量自行实现，不直接依赖现成的 Agent 框架。

## 1. 技术栈

- Node.js
- TypeScript
- OpenAI SDK
- dotenv
- tsx

## 2. 环境要求

开发前需要安装：

- Node.js（建议使用当前维护中的 LTS 版本）
- npm
- Git

检查环境：

```bash
node -v
npm -v
git --version
```

## 3. 下载项目

```bash
git clone https://github.com/3127559532/my-agent.git
cd my-agent
```

## 4. 安装依赖

```bash
npm ci
```

说明：

- `package.json`：记录项目使用的依赖。
- `package-lock.json`：锁定依赖的具体版本。
- `npm ci`：根据锁文件安装依赖，适合在新电脑上还原项目环境。
- `node_modules`：安装后自动生成，不需要提交到 Git。

如果需要正常添加或更新依赖，使用 `npm install`。

## 5. 启动项目

当前项目使用 `tsx` 直接运行 TypeScript：

```bash
npx tsx src/index.ts
```

预期输出：

```text
My Agent 启动成功！
```

## 6. 环境变量

后续调用模型 API 时，需要配置环境变量。

在项目根目录创建 `.env`：

```env
OPENAI_API_KEY=your_api_key_here
```

注意：`.env` 包含敏感信息，已加入 `.gitignore`，禁止提交到 Git 仓库。

当前初始化阶段尚未使用 API Key。

## 7. 项目结构

```text
my-agent/
├── src/
│   └── index.ts          # 程序入口
├── .gitignore            # Git 忽略规则
├── package.json          # 项目依赖配置
├── package-lock.json     # 依赖版本锁定
├── tsconfig.json         # TypeScript 配置
└── README.md             # 项目说明
```

`node_modules/` 在安装依赖后自动生成。

## 8. 开发计划

### 第一章：Agent 核心运行引擎（已完成）

- [x] 初始化 TypeScript 项目
- [x] 配置 Git、.gitignore 和 README
- [x] 实现 Model Client（兼容 Qwen、DeepSeek 等模型接口）
- [x] 实现 Agent Loop（模型调用、工具执行、循环调度）
- [x] Tool Registry V1（工具注册与执行分发）
- [x] Tool Registry V2（Schema 与 Handler 统一注册）
- [x] Tool Registry V3（带参数工具、参数校验与异常处理）
- [x] Agent Loop V2-A（最大模型调用次数限制）
- [x] Agent Loop V2-B（模型 API 异常分类）
- [x] Agent Loop V2-C（自动重试与指数退避）
- [x] Agent Loop V2-D（AbortSignal 主动取消）

### 第二章：Session 与会话管理（下一阶段）

- [ ] Session V1（内存多轮对话与会话隔离）
- [ ] Session V2（会话持久化）
- [ ] Session V3（历史会话恢复）

### 第三章：Context 与 Memory

- [ ] Token Usage 与上下文窗口管理
- [ ] Context Compact（上下文压缩）
- [ ] Memory（长期记忆存储与检索）

### 第四章：文件操作与执行环境

- [ ] 文件读取、目录浏览与搜索
- [ ] 文件编辑与 Shell 命令执行
- [ ] Sandbox（受控执行与访问边界）

### 第五章：MCP 扩展体系

- [ ] MCP Client 与 Server 连接
- [ ] MCP 工具发现和调用
- [ ] MCP 与 Tool Registry 整合

### 第六章：Agent Runtime 整合与工程化

- [ ] CLI 交互与配置管理
- [ ] 自动化测试与模块整合
- [ ] 完整 Agent Runtime 验收

## 9. 学习方式

每个阶段遵循：

1. 阅读 Codex CLI 对应的核心源码。
2. 理解模块职责和调用链。
3. 使用 TypeScript 实现最小功能。
4. 运行测试，验证实现结果。
5. Git 提交，记录学习进度。

原则：先理解，再实现；先完成最小闭环，再逐步扩展。

## 10. 参考项目

OpenAI Codex CLI：

https://github.com/openai/codex

本项目为独立学习项目，不是 OpenAI 官方 Codex 的复刻版本。