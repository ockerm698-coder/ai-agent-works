# AI Agent Works

基于 GraphQL 的 Cloudflare Workers 项目，集成 OpenAI API，提供强大的 AI 能力。

## 功能特性

- ✅ GraphQL API
- ✅ OpenAI GPT 集成
- ✅ 聊天对话功能
- ✅ 文本补全功能
- ✅ 模型查询
- ✅ TypeScript 类型安全
- ✅ CORS 支持
- ✅ GraphiQL 开发界面

## 技术栈

- **运行时**: Cloudflare Workers
- **API 框架**: GraphQL Yoga
- **AI 服务**: OpenAI API
- **语言**: TypeScript
- **构建工具**: Wrangler

## 快速开始

### 1. 安装依赖

```bash
cd ai-agent-works
npm install
```

### 2. 配置环境变量

复制 `.dev.vars.example` 为 `.dev.vars`：

```bash
cp .dev.vars.example .dev.vars
```

编辑 `.dev.vars` 文件，添加你的 OpenAI API Key：

```
OPENAI_API_KEY=sk-your-actual-api-key
ENVIRONMENT=development
```

### 3. 本地开发

```bash
npm run dev
```

访问 http://localhost:8787 查看 GraphiQL 界面。

### 4. 部署到 Cloudflare

首先设置生产环境的 API Key：

```bash
npx wrangler secret put OPENAI_API_KEY
```

然后部署：

```bash
npm run deploy
```

## GraphQL API 使用

### 查询示例

#### 健康检查

```graphql
query {
  health
}
```

#### 获取模型列表

```graphql
query {
  models {
    id
    object
    created
    ownedBy
  }
}
```

### Mutation 示例

#### 聊天对话

```graphql
mutation {
  chat(input: {
    messages: [
      { role: "user", content: "你好，请介绍一下自己" }
    ]
    model: "gpt-3.5-turbo"
    temperature: 0.7
    maxTokens: 1000
  }) {
    message {
      role
      content
    }
    model
    usage {
      promptTokens
      completionTokens
      totalTokens
    }
  }
}
```

#### 多轮对话

```graphql
mutation {
  chat(input: {
    messages: [
      { role: "system", content: "你是一个友好的助手" }
      { role: "user", content: "什么是 GraphQL？" }
      { role: "assistant", content: "GraphQL 是一种 API 查询语言..." }
      { role: "user", content: "它有什么优势？" }
    ]
    model: "gpt-3.5-turbo"
  }) {
    message {
      role
      content
    }
  }
}
```

#### 文本补全

```graphql
mutation {
  completion(input: {
    prompt: "从前有座山，"
    model: "gpt-3.5-turbo-instruct"
    maxTokens: 100
    temperature: 0.8
  }) {
    text
    model
    usage {
      totalTokens
    }
  }
}
```

## API 参数说明

### ChatInput

- `messages`: 消息列表（必需）
  - `role`: "system" | "user" | "assistant"
  - `content`: 消息内容
- `model`: 使用的模型，默认 "gpt-3.5-turbo"
- `temperature`: 温度参数 (0-2)，控制随机性，默认 0.7
- `maxTokens`: 最大生成 token 数，默认 1000

### CompletionInput

- `prompt`: 提示文本（必需）
- `model`: 使用的模型，默认 "gpt-3.5-turbo-instruct"
- `maxTokens`: 最大生成 token 数，默认 1000
- `temperature`: 温度参数 (0-2)，默认 0.7

## 项目结构

```
ai-agent-works/
├── src/
│   ├── index.ts              # 主入口文件
│   ├── types/
│   │   └── index.ts          # TypeScript 类型定义
│   ├── schema/
│   │   ├── typeDefs.ts       # GraphQL Schema
│   │   └── resolvers.ts      # GraphQL Resolvers
│   └── services/
│       └── openai.ts         # OpenAI 服务封装
├── wrangler.toml             # Cloudflare Workers 配置
├── package.json
├── tsconfig.json
└── README.md
```

## 使用 cURL 测试

```bash
# 聊天对话
curl -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { chat(input: { messages: [{ role: \"user\", content: \"Hello\" }] }) { message { content } } }"
  }'
```

## 常见问题

### Q: 如何获取 OpenAI API Key？

访问 https://platform.openai.com/api-keys 创建 API Key。

### Q: 支持哪些 OpenAI 模型？

支持所有 OpenAI 的聊天模型（如 gpt-3.5-turbo, gpt-4）和补全模型（如 gpt-3.5-turbo-instruct）。

### Q: 如何配置 CORS？

项目已默认配置 CORS，允许所有来源访问。如需限制，请修改 `src/index.ts` 中的 CORS 设置。

## 许可证

MIT
