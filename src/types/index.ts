/**
 * 环境变量配置接口
 * 定义 Cloudflare Workers 运行时所需的环境变量
 */
export interface Env {
  /** OpenAI API 密钥 */
  OPENAI_API_KEY: string;
  /** 运行环境：development 或 production */
  ENVIRONMENT?: string;
}

/**
 * 聊天消息接口
 * 用于表示对话中的单条消息
 */
export interface ChatMessage {
  /** 消息角色：系统、用户或助手 */
  role: 'system' | 'user' | 'assistant';
  /** 消息内容 */
  content: string;
}

/**
 * 聊天输入参数接口
 * 用于配置聊天请求的参数
 */
export interface ChatInput {
  /** 消息历史列表 */
  messages: ChatMessage[];
  /** 使用的 AI 模型（可选，默认 gpt-3.5-turbo） */
  model?: string;
  /** 温度参数，控制输出的随机性（0-2，默认 0.7） */
  temperature?: number;
  /** 最大生成的 token 数量（默认 1000） */
  maxTokens?: number;
}

/**
 * 文本补全输入参数接口
 * 用于配置文本补全请求的参数
 */
export interface CompletionInput {
  /** 提示文本 */
  prompt: string;
  /** 使用的 AI 模型（可选） */
  model?: string;
  /** 最大生成的 token 数量（默认 1000） */
  maxTokens?: number;
  /** 温度参数，控制输出的随机性（0-2，默认 0.7） */
  temperature?: number;
}

/**
 * Token 使用情况统计接口
 * 记录 API 调用中的 token 消耗
 */
export interface Usage {
  /** 提示词消耗的 token 数量 */
  promptTokens: number;
  /** 补全内容消耗的 token 数量 */
  completionTokens: number;
  /** 总共消耗的 token 数量 */
  totalTokens: number;
}

/**
 * 聊天响应接口
 * 表示 AI 聊天请求的返回结果
 */
export interface ChatResponse {
  /** AI 生成的消息 */
  message: ChatMessage;
  /** 实际使用的模型名称 */
  model: string;
  /** Token 使用统计（可选） */
  usage?: Usage;
}

/**
 * 文本补全响应接口
 * 表示 AI 文本补全请求的返回结果
 */
export interface CompletionResponse {
  /** 生成的文本内容 */
  text: string;
  /** 实际使用的模型名称 */
  model: string;
  /** Token 使用统计（可选） */
  usage?: Usage;
}

/**
 * AI 模型信息接口
 * 表示 OpenAI 提供的模型详细信息
 */
export interface Model {
  /** 模型唯一标识符 */
  id: string;
  /** 对象类型（通常为 "model"） */
  object: string;
  /** 模型创建时间戳 */
  created: number;
  /** 模型所有者 */
  ownedBy: string;
}
