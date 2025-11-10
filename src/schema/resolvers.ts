/**
 * GraphQL Resolvers
 * 定义所有 GraphQL 查询和变更操作的解析器
 */

import type { OpenAIService } from '../services/openai';
import type { ChatInput, CompletionInput } from '../types';

/**
 * GraphQL 上下文接口
 * 定义 resolver 函数中可访问的上下文对象
 */
export interface Context {
  /** OpenAI 服务实例，用于调用 AI API */
  openai: OpenAIService;
}

/**
 * GraphQL 解析器对象
 * 包含所有查询（Query）和变更（Mutation）操作的实现
 */
export const resolvers = {
  Query: {
    /**
     * 健康检查端点
     * 用于验证服务是否正常运行
     * @returns 返回 "OK" 字符串
     */
    health: () => {
      return 'OK';
    },

    /**
     * 获取 OpenAI 模型列表
     * 查询所有可用的 AI 模型
     * @param _parent - 父级解析器结果（未使用）
     * @param _args - 查询参数（未使用）
     * @param context - GraphQL 上下文，包含 OpenAI 服务实例
     * @returns 返回模型列表数组
     */
    models: async (_parent: unknown, _args: unknown, context: Context) => {
      return await context.openai.getModels();
    },
  },

  Mutation: {
    /**
     * 发送聊天消息
     * 与 AI 进行对话交互
     * @param _parent - 父级解析器结果（未使用）
     * @param args - 变更参数，包含聊天输入数据
     * @param context - GraphQL 上下文，包含 OpenAI 服务实例
     * @returns 返回 AI 生成的聊天响应
     */
    chat: async (_parent: unknown, args: { input: ChatInput }, context: Context) => {
      return await context.openai.chat(args.input);
    },

    /**
     * 生成文本补全
     * 根据提示生成文本内容
     * @param _parent - 父级解析器结果（未使用）
     * @param args - 变更参数，包含文本补全输入数据
     * @param context - GraphQL 上下文，包含 OpenAI 服务实例
     * @returns 返回 AI 生成的文本补全响应
     */
    completion: async (_parent: unknown, args: { input: CompletionInput }, context: Context) => {
      return await context.openai.completion(args.input);
    },
  },
};
