/**
 * GraphQL Schema 类型定义
 * 定义 API 的完整 GraphQL schema，包括查询、变更、输入和输出类型
 *
 * 主要功能：
 * - Query: 健康检查、获取模型列表
 * - Mutation: 聊天对话、文本补全
 * - 支持消息历史、模型配置、Token 统计等功能
 */

export const typeDefs = `
  type Query {
    """
    健康检查端点
    用于验证 API 服务是否正常运行
    """
    health: String!

    """
    获取 OpenAI 模型列表
    返回所有可用的 AI 模型信息
    """
    models: [Model!]!
  }

  type Mutation {
    """
    发送聊天消息到 OpenAI
    """
    chat(input: ChatInput!): ChatResponse!

    """
    生成文本补全
    """
    completion(input: CompletionInput!): CompletionResponse!
  }

  """
  OpenAI 模型信息
  """
  type Model {
    id: String!
    object: String!
    created: Int!
    ownedBy: String!
  }

  """
  聊天输入
  """
  input ChatInput {
    """
    消息列表
    """
    messages: [MessageInput!]!

    """
    使用的模型，默认 gpt-3.5-turbo
    """
    model: String

    """
    温度参数，控制随机性 (0-2)
    """
    temperature: Float

    """
    最大生成 token 数
    """
    maxTokens: Int
  }

  """
  消息输入
  """
  input MessageInput {
    """
    消息角色: system, user, assistant
    """
    role: String!

    """
    消息内容
    """
    content: String!
  }

  """
  聊天响应
  """
  type ChatResponse {
    """
    生成的消息
    """
    message: Message!

    """
    使用的模型
    """
    model: String!

    """
    token 使用情况
    """
    usage: Usage
  }

  """
  消息
  """
  type Message {
    role: String!
    content: String!
  }

  """
  Token 使用情况
  """
  type Usage {
    promptTokens: Int!
    completionTokens: Int!
    totalTokens: Int!
  }

  """
  文本补全输入
  """
  input CompletionInput {
    """
    提示文本
    """
    prompt: String!

    """
    使用的模型
    """
    model: String

    """
    最大生成 token 数
    """
    maxTokens: Int

    """
    温度参数
    """
    temperature: Float
  }

  """
  文本补全响应
  """
  type CompletionResponse {
    """
    生成的文本
    """
    text: String!

    """
    使用的模型
    """
    model: String!

    """
    token 使用情况
    """
    usage: Usage
  }
`;
