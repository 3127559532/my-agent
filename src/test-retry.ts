import OpenAI from "openai";
import { withRetry } from "./retry";

async function main() {

    let count = 0;

    const result = await withRetry(async () => {
        count++;

        console.log(`第 ${count} 次模拟请求`);

        if (count <= 3) {
            // throw new OpenAI.APIConnectionError({
            //     message: "模拟网络连接失败"
            // });

            throw new OpenAI.AuthenticationError(
                401,
                { message: "模拟 API Key 无效" },
                "Unauthorized",
                new Headers()
            );
        }

        return "模型请求成功";
    });

    console.log("最终结果：", result);
    console.log("总请求次数：", count);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});