import {chat} from "./model";
import OpenAI  from "openai";


type Message = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export async function runAgent(userInput: string){
    const messages: Message[] = [
        {role:"user",content: userInput}
    ];

    let finalAnswer = "";
    while (true){

        //1.请求模型
        const response = await chat(messages);
        const choice = response.choices[0];

        if(!choice){
            throw new  Error("模型没有返回有效响应");
        }

        const message = choice.message;

        //2.保存助手消息
        messages.push(message);

        //3.判断是否想要调用工具
        if(message.tool_calls?.length){

            for(const toolCall of message.tool_calls){
                if(toolCall.type !== "function"){
                    throw new Error("暂不支持该工具类型");
                }
                const toolName = toolCall.function.name;
                console.log("AGENT 调用工具：",toolName)

                //4.执行本地工具
                let result: string;

                if(toolName ==="get_current_time"){
                    result = new Date().toLocaleString("zh-CN");
                }else{
                    result =   `未知工具${toolName}`;
                }
                //5.将工具执行结果添加到历史信息
                messages.push({
                    role:"tool",
                    tool_call_id: toolCall.id,
                    content:result
                });
            }
            //6.带着工具结果再次请求模型
            continue;
        }


        //7.没有工具调用，本轮结束
        finalAnswer= message.content ?? "";
        break;
    }
    // 循环结束后执行
    console.dir(messages, { depth: null });

    return finalAnswer;

}