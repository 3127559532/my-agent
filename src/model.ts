import OpenAI from "openai";
import "dotenv/config";
import {getToolDefinitions} from "./tools";
const client = new OpenAI({
    apiKey: process.env.MODEL_API_KEY,
    baseURL: process.env.MODEL_BASE_URL,
})


export async function chat(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    return await client.chat.completions.create({
        model: process.env.MODEL_NAME!,
        messages,
        // tools: [
        //     {
        //         type: "function",
        //         function: {
        //             name: "get_current_time",
        //             description: "获取当前系统时间",
        //             parameters: {
        //                 type: "object",
        //                 properties: {},
        //                 required: [],
        //             }
        //         }
        //
        //     }
        // ],
        tools: getToolDefinitions(),
        tool_choice: "auto"
    })
}


