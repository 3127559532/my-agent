import OpenAI from "openai";
import {setTimeout as sleep} from "node:timers/promises"
//最大重试次数
const MAX_RETRIES = 2;
//两次间隔延时时间
const BASE_DELAY = 1000;

//判断哪些错误运行重试
export function isRetryable(error: unknown): boolean {
    if (error instanceof OpenAI.APIConnectionError) {
        return true;
    }
    if (error instanceof OpenAI.APIError) {
        const status = error.status;
        return status === 408 ||
            status === 409 ||
            status === 429 ||
            (status !== undefined && status >= 500);
    }
    return false;
}

//统一执行带重试的操作
export async function withRetry<T>(
    operation: () => Promise<T>,
    signal?: AbortSignal //可选参数
): Promise<T> {

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {

        //每次发起请求前，检查是否已经取消
        signal?.throwIfAborted();
        try {
            return await operation();
        } catch (error: unknown) {

            //如果任务取消不允许重试
            signal?.throwIfAborted();
            if (!isRetryable(error) || attempt === MAX_RETRIES) {
                throw error;
            }
            const delay = BASE_DELAY * 2 ** attempt;

            console.warn(`模型请求失败, ${delay}ms 后重试 (${attempt + 1}/${MAX_RETRIES})`);
            //等待期间也可以取消
            await sleep(delay,undefined,{signal});
        }
    }
    throw new Error("模型重试流程异常");
}