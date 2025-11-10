/**
 * OpenAI API 服务封装
 * 提供与 OpenAI API 交互的核心功能，包括聊天、文本补全和模型管理
 */

import OpenAI from 'openai';
import type {
  ChatInput,
  ChatResponse,
  CompletionInput,
  CompletionResponse,
  Model,
  Env
} from '../types';

/**
 * OpenAI 服务类
 * 封装所有与 OpenAI API 的交互逻辑
 */
export class OpenAIService {
  /** OpenAI 客户端实例 */
  private client: OpenAI;

  /**
   * 构造函数
   * @param apiKey - OpenAI API 密钥
   */
  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
    });
  }

  /**
   * 发送聊天消息
   * 通过 OpenAI Chat Completions API 生成对话回复
   * @param input - 聊天输入参数，包含消息历史和配置
   * @returns 返回 AI 生成的聊天响应
   * @throws 如果 API 调用失败或响应格式错误
   */
  async chat(input: ChatInput): Promise<ChatResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: input.model || 'gpt-3.5-turbo',
        messages: input.messages,
        temperature: input.temperature || 0.7,
        max_tokens: input.maxTokens || 1000,
      });

      const message = response.choices[0]?.message;
      if (!message) {
        throw new Error('No message in response');
      }

      return {
        message: {
          role: message.role,
          content: message.content || '',
        },
        model: response.model,
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      console.error('OpenAI Chat Error:', error);
      throw new Error(`Failed to generate chat response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 生成文本补全
   * 通过 OpenAI Completions API 根据提示生成文本
   * @param input - 文本补全输入参数，包含提示文本和配置
   * @returns 返回 AI 生成的文本补全响应
   * @throws 如果 API 调用失败或响应格式错误
   */
  async completion(input: CompletionInput): Promise<CompletionResponse> {
    try {
      const response = await this.client.completions.create({
        model: input.model || 'gpt-3.5-turbo-instruct',
        prompt: input.prompt,
        max_tokens: input.maxTokens || 1000,
        temperature: input.temperature || 0.7,
      });

      const text = response.choices[0]?.text;
      if (text === undefined) {
        throw new Error('No text in response');
      }

      return {
        text,
        model: response.model,
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      console.error('OpenAI Completion Error:', error);
      throw new Error(`Failed to generate completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取可用模型列表
   * 从 OpenAI API 获取所有可用的 AI 模型信息
   * @returns 返回模型列表数组
   * @throws 如果 API 调用失败
   */
  async getModels(): Promise<Model[]> {
    try {
      const response = await this.client.models.list();
      return response.data.map((model) => ({
        id: model.id,
        object: model.object,
        created: model.created,
        ownedBy: model.owned_by,
      }));
    } catch (error) {
      console.error('OpenAI Models Error:', error);
      throw new Error(`Failed to fetch models: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * 创建 OpenAI 服务实例（工厂函数）
 * 从环境变量中读取 API 密钥并创建 OpenAIService 实例
 * @param env - 环境变量配置对象
 * @returns 返回配置好的 OpenAIService 实例
 * @throws 如果 OPENAI_API_KEY 未配置
 */
export function createOpenAIService(env: Env): OpenAIService {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAIService(env.OPENAI_API_KEY);
}
