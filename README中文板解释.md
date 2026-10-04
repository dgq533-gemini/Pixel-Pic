# AI Coding OS v1.0

Cross-tool AI coding project operating system.

Canonical files:
- `AGENTS.md`
- `PROJECT_MEMORY.md`
- `docs/AI_DEVELOPMENT_PROTOCOL.md`

Adapters:
- `CLAUDE.md`
- `.cursor/rules/00-ai-coding-os.mdc`
- `project_rules.md`

Start a new project by copying this template, then run the First Run prompt in `docs/FIRST_RUN.md`.

### 以下内容为手动添加，非官方文档###
***一、首次启动文件***

新项目第一次接入 AI Coding OS 时，只需要给 Agent：

docs/FIRST_RUN.md

或者直接把下面这段发给它：

Read and follow the repository's AGENTS.md.

Then initialize or reconcile the project with AI Coding OS v1.0.

Tasks:

1. Inspect the repository structure and existing agent/rule files.
2. Read AGENTS.md.
3. Create or reconcile PROJECT_MEMORY.md without overwriting useful existing information.
4. Build/update its Memory Index.
5. Inspect .gitignore and .env.example; create or safely update them if missing.
6. Check package/dependency configuration and the actual tech stack.
7. Check Git status, branch, remotes, and relevant GitHub/CI state.
8. Check Vercel/deployment configuration and actual state when applicable.
9. Never copy or store secrets.
10. Record only durable project knowledge.
11. Identify current work, known issues, historical failed solutions, and human-confirmation items.
12. Do not start unrelated feature development.

When finished, report:

- project state
- files created/updated
- detected stack
- Git/GitHub state
- deployment state if applicable
- known failures
- human confirmations needed
- next development step

Do not modify unrelated files.

这就完成第一次“安装”。

***二、以后你实际怎么使用***

以后新建一个项目：

第一步

复制 AI Coding OS：

AI-Coding-OS-v1.0/

到新项目。

第二步

打开你喜欢的 Agent。

例如 Codex：

请执行 docs/FIRST_RUN.md 中的 AI Coding OS v1.0 初始化流程。

Claude Code：

请按照 CLAUDE.md 和 AGENTS.md 初始化项目。

Cursor：

请按照 AGENTS.md 初始化 AI Coding OS，并完成项目状态检查。

TRAE：

请按照 project_rules.md 和 AGENTS.md 初始化 AI Coding OS。

第一次做完以后，正常开发就不需要再发送这套长 Prompt。

***三、以后你真正给 AI 的 Prompt 会变得非常短***

例如：

实现用户注册功能。
先检查现有认证架构、相关 Memory 和失败方案。
按 AI Coding OS 模块化规则执行并完成验证。

甚至：

实现 Stripe Webhook。

Agent 应该自行知道：

AGENTS.md
     ↓
Memory Index
     ↓
支付相关 Memory
     ↓
历史失败方案
     ↓
现有支付代码
     ↓
Stripe 官方文档
     ↓
实现
     ↓
测试
     ↓
Diff
     ↓
Memory

这才是这个系统真正的价值。