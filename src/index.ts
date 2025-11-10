/**
 * Cloudflare Workers 入口文件
 * 部署在 Cloudflare Workers 上的 GraphQL API 服务
 *
 * 主要功能：
 * - 提供 GraphQL API 端点
 * - 集成 OpenAI 服务
 * - 支持 CORS 跨域请求
 * - 开发环境下提供 GraphiQL 调试界面
 */

import { createYoga } from 'graphql-yoga';
import { createSchema } from 'graphql-yoga';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';
import { createOpenAIService } from './services/openai';
import type { Env } from './types';

/**
 * 创建 GraphQL Schema
 * 组合类型定义和解析器生成完整的 GraphQL schema
 */
const schema = createSchema({
  typeDefs,
  resolvers,
});

/**
 * Cloudflare Workers 导出对象
 * 实现 Workers 的标准接口
 */
export default {
  /**
   * 处理 HTTP 请求的主函数
   * 所有进入 Worker 的请求都会经过这个函数处理
   *
   * @param request - 传入的 HTTP 请求对象
   * @param env - 环境变量，包含 API 密钥等敏感配置
   * @param ctx - 执行上下文，用于延长请求生命周期
   * @returns 返回 HTTP 响应对象
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    /**
     * CORS 跨域资源共享头配置
     * 允许前端应用从不同域名访问此 API
     */
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    /**
     * 处理 OPTIONS 预检请求
     * 浏览器在发送跨域请求前会先发送 OPTIONS 请求
     */
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      /**
       * 创建 OpenAI 服务实例
       * 从环境变量中读取 API 密钥并初始化服务
       */
      const openai = createOpenAIService(env);

      /**
       * 创建 GraphQL Yoga 实例
       * GraphQL Yoga 是一个完整的 GraphQL 服务器
       */
      const yoga = createYoga({
        schema,
        context: {
          openai,
        },
        // 启用 GraphiQL 界面（仅在开发环境）
        graphiql: env.ENVIRONMENT === 'development' || !env.ENVIRONMENT,
        // 启用跨域
        cors: {
          origin: '*',
          credentials: true,
          methods: ['GET', 'POST', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization'],
        },
        landingPage: false,
      });

      /**
       * 使用 GraphQL Yoga 处理请求
       * 自动解析 GraphQL 查询并执行相应的 resolver
       */
      const response = await yoga.fetch(request, {
        openai,
      });

      /**
       * 为响应添加 CORS 头
       * 确保客户端能够读取响应数据
       */
      const newResponse = new Response(response.body, response);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newResponse.headers.set(key, value);
      });

      return newResponse;
    } catch (error) {
      // 记录错误日志（在 Workers 控制台中可见）
      console.error('Worker Error:', error);

      /**
       * 返回标准化的错误响应
       * 包含错误信息和适当的 HTTP 状态码
       */
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  },
};
