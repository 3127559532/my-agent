import OpenAI from "openai";
import "dotenv/config";
import {withRetry} from "./retry";
import {getToolDefinitions} from "./tools";

const client = new OpenAI({
    apiKey: process.env.MODEL_API_KEY,
    baseURL: process.env.MODEL_BASE_URL,
    maxRetries: 0,
    timeout: 30000
})


export async function chat(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
) {
    try {
        return await withRetry(() =>
            client.chat.completions.create({
                model: process.env.MODEL_NAME!,
                messages,
                tools: getToolDefinitions(),
                tool_choice: "auto"
            })
        );
    } catch (error: unknown) {
        if (error instanceof OpenAI.AuthenticationError) {
            throw new Error(
                "模型鉴权失败，请检查API Key",
                {
                    cause: error
                });
        }

        if (error instanceof OpenAI.RateLimitError) {
            throw new Error("模型请求受到频率或配额限制", {
                cause: error
            });
        }

        if (error instanceof OpenAI.APIConnectionTimeoutError) {
            throw new Error("模型请求超时", {
                cause: error
            });
        }

        if (error instanceof OpenAI.APIConnectionError) {
            throw new Error("模型网络连接失败", {
                cause: error
            });
        }

        if (error instanceof OpenAI.APIError) {
            throw new Error(
                `模型 API 请求失败，HTTP 状态码：${error.status ?? "未知"}`,
                {cause: error}
            );
        }

        throw error;
    }
}


