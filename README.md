# My Agent

一个使用 **TypeScript + Node.js** 从零开发的轻量级 AI Agent 学习项目。

项目参考 [OpenAI Codex CLI](https://github.com/openai/codex) 的核心设计，亲手实现模型调用、Agent Loop、工具注册与执行、会话、上下文、记忆和 MCP 等能力。核心 Agent 逻辑自行编写，不直接依赖 LangChain、LangGraph 等 Agent 框架。

> **当前进度：第一章「Agent 核心运行引擎」已完成主要功能实现与手工验证；下一章为「Session 与会话管理」V1。** 本项目仍是学习版本，不代表具备 Codex CLI 完整的生产级功能。

## 1. 技术栈

- Node.js、TypeScript
- OpenAI Node SDK（连接兼容 OpenAI Chat Completions 协议的第三方模型，例如 Qwen、DeepSeek）
- dotenv（读取本地环境变量）
- tsx（开发时直接运行 TypeScript）
- Git（代码版本管理）

## 2. 环境要求

安装 Node.js（建议使用维护中的 LTS 版本）、npm 和 Git。检查安装情况：

```bash
node -v
npm -v
git --version
```

项目开发期间曾在 Node.js 24 环境下运行；更换电脑时应以实际测试结果为准。

## 3. 克隆项目与安装依赖

```bash
git clone https://github.com/3127559532/my-agent.git
cd my-agent
npm ci
```

- `package.json`：声明项目依赖和脚本。
- `package-lock.json`：锁定已解析的依赖版本，应纳入 Git。
- `npm ci`：在已有 lockfile 的前提下还原依赖；新增或更新依赖时使用 `npm install`。
- `node_modules/`：安装自动生成，不纳入 Git。

## 4. 配置模型

项目使用 OpenAI 兼容 API，而非必须使用 OpenAI 官方模型。

在根目录创建 `.env`（可复制 `.env.example` 后填写）：

```dotenv
# 示例：阿里云百炼 Qwen（中国内地区域）
MODEL_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
MODEL_API_KEY=replace_with_your_real_api_key
MODEL_NAME=qwen-plus
```

若使用 DeepSeek，可将上述三项改为对应服务的 Base URL、API Key 与模型名，例如 `https://api.deepseek.com`、`deepseek-chat`。请按实际服务商和模型能力选择配置。

**安全提醒：** `.env` 应被 `.gitignore` 忽略；不要将真实 API Key 写入 README、测试文件或提交到 GitHub。更换电脑需要重新提供本地 `.env`。

## 5. 启动与检查

```bash
npm run typecheck
npm run dev
```

`npm run dev` 会运行 `tsx src/index.ts`。当前 `index.ts` 是用于验证 Agent 的程序入口，测试问题可在源码中调整；具体输出取决于当前配置和模型返回结果。

也可以使用 WebStorm 的 **npm** 运行配置：选择本项目 `package.json`，Command 设置为 `run`，Scripts 设置为 `dev`。

## 6. 项目结构

```text
my-agent/
├── src/
│   ├── index.ts             # 程序入口／当前手动验证任务
│   ├── model.ts             # 模型请求、异常分类、Retry 接入
│   ├── agent.ts             # Agent Loop、模型调用上限、取消信号
│   ├── tools.ts             # Tool Registry、Schema、Handler、参数校验
│   └── retry.ts             # 有限次重试、指数退避、等待取消
├── tests/
│   ├── test-tools.ts        # 工具参数和错误处理实验
│   ├── test-retry.ts        # 重试与错误分类实验
│   ├── test-abort.ts        # AbortController 基础实验
│   └── test-retry-abort.ts  # Retry 等待期间取消实验
├── .env                    # 本地密钥配置（不提交）
├── .env.example            # 环境变量模板（建议提交）
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

> 上述为当前学习阶段的目标目录结构；若某个实验文件未保留，以实际仓库内容为准。

## 7. 测试

```bash
npm run typecheck
npm run test:tools
npm run test:retry
npx tsx tests/test-abort.ts
npx tsx tests/test-retry-abort.ts
```

目前 `tests/` 中主要是**手动实验脚本**，而非完善的自动化断言测试。有些脚本会主动模拟 401 等异常，并打印错误堆栈；打印异常并不一定表示实现失败，应结合该脚本的预期场景判断。`test:retry` 的输出也取决于当前脚本选择的模拟场景。

使用真实模型的回归测试：`npm run dev`。调用模型可能产生费用。

## 8. 开发章节与进度

| 章节                               | 内容                                                         | 状态                                 |
| ---------------------------------- | ------------------------------------------------------------ | ------------------------------------ |
| 第一章：Agent 核心运行引擎         | Model Client、Agent Loop、Tool Registry、参数校验、异常分类、Retry、AbortSignal | **主要功能已完成并通过对应手工测试** |
| 第二章：Session 与会话管理         | 内存多轮会话、会话隔离、持久化与恢复                         | **下一章：V1 待开始**                |
| 第三章：Context 与 Memory          | Token 使用量、上下文管理、Compact、长期记忆                  | 未开始                               |
| 第四章：文件操作与执行环境         | 文件读取／搜索／编辑、Shell、沙箱边界                        | 未开始                               |
| 第五章：MCP 扩展体系               | MCP 连接、工具发现、调用和 Registry 整合                     | 未开始                               |
| 第六章：Agent Runtime 整合与工程化 | CLI 交互、配置整合、自动化测试、整体验收                     | 未开始                               |

### 第一章完成内容

- 模型客户端：使用兼容 API 调用 Qwen 等模型；向模型声明工具。
- Agent Loop：识别 `tool_calls`、执行工具、回传结果、继续模型调用，直到结束。
- Tool Registry V1 / V2：按名称分发工具；将 Schema 和 Handler 统一注册。
- Tool Registry V3：计算器工具、运行时参数校验、工具错误转为模型可读取的结果。
- Agent Loop V2-A：最大模型调用次数。
- Agent Loop V2-B：模型 API 异常分类，保留原始错误 `cause`。
- Agent Loop V2-C：限制重试次数、指数退避与异常分支测试。
- Agent Loop V2-D：AbortController / AbortSignal；已验证 Retry 等待和模型请求的取消路径。

**待进一步工程化验证：** 系统性的自动化断言测试、取消后的正常运行回归覆盖、更多模型兼容性和边界情况。目前不将这些视为已全面完成。

### 第二章下一步：Session V1

目标：同一 Session 的多轮请求复用历史消息，不同 Session 的消息隔离。先使用内存存储，不引入数据库；之后再讨论持久化与恢复。

## 9. 设计与学习原则

1. 先查看 Codex CLI 对应功能的真实源码与调用链。
2. 再用 TypeScript 手写最小可运行版本，不盲目照搬完整 Rust 架构。
3. 每次只引入本阶段必需的能力，分清 TypeScript 语法、SDK 接口和 Agent Runtime 逻辑。
4. 每个小版本经过类型检查、运行测试与必要的异常路径验证后，再提交 Git。
5. **每完成一个大章节，同步更新本 README 的架构、进度、运行方法与测试说明，并使用清晰的中文 Git 提交描述。**

## 10. 参考项目与声明

- [OpenAI Codex CLI 官方仓库](https://github.com/openai/codex)

本仓库是独立的学习与实验项目，不属于 OpenAI 官方 Codex 产品，也不声称完整复现其实现。