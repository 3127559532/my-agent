import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
    apiKey: process.env.MODEL_API_KEY,
    baseURL: process.env.MODEL_BASE_URL,
})


export async function chat(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    return await client.chat.completions.create({
        model: process.env.MODEL_NAME!,
        messages,
        tools: [
            {
                type: "function",
                function: {
                    name: "get_current_time",
                    description: "获取当前系统时间",
                    parameters: {
                        type: "object",
                        properties: {},
                        required: [],
                    }
                }

            }
        ],
        tool_choice: "auto"
    })
}


//第一版测试 chat
// export  async  function  chat(message: string): Promise<string>{
//     //构建客户端
//     const response = await  client.chat.completions.create({
//         //组织参数
//         model: process.env.MODEL_NAME!,
//         messages: [
//             {
//                 role: "user",
//                 content: message,
//             }
//         ]
//     })
//     //抽取返回数据
//     return  response.choices[0]?.message.content ?? "";
// }


