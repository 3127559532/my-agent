import OpenAI from "openai";
import { withRetry } from "../src/retry";

async function main() {

    const controller = new AbortController();

    let count = 0;

    const task = withRetry(async () => {

        count++;

        console.log(`第 ${count} 次模拟请求`);

        throw new OpenAI.APIConnectionError({
            message: "模拟网络失败"
        });

    }, controller.signal);

    // 第一次失败后，本应等待 1 秒重试
    // 500 毫秒时提前取消
    setTimeout(() => {
        console.log("用户主动取消");
        controller.abort();
    }, 500);

    try {
        await task;
    } catch (error) {
        console.log(
            "捕获取消：",
            error instanceof Error ? error.message : String(error)
        );
    }

    console.log("最终请求次数：", count);
}

main().catch(console.error);