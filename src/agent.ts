import {chat} from "./model";
import OpenAI from "openai";
import {executeTool} from "./tools";
import type {Session} from "./session";
import {debug} from "./logger";

type Message = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export async function runAgent(
    session: Session,
    userInput: string,
    signal?: AbortSignal
) {

    //从传入的Session中取出message
    const messages = session.messages;
    //将本轮用户消息 + 历史消息
    messages.push({
        role: "user",
        content: userInput
    });

    let finalAnswer = "";

    let completed = false;
    const MAX_MODEL_CALLS = 5;
    let modelCallCount = 0;

    while (modelCallCount < MAX_MODEL_CALLS) {
        modelCallCount++;
        signal?.throwIfAborted();
        debug(`Agent 模型调用: ${modelCallCount}/${MAX_MODEL_CALLS}`);
        //1.请求模型
        const response = await chat(messages, signal);
        const choice = response.choices[0];

        if (!choice) {
            throw new Error("模型没有返回有效响应");
        }

        const message = choice.message;

        //2.保存助手消息
        messages.push(message);

        //3.判断是否想要调用工具
        if (message.tool_calls?.length) {

            for (const toolCall of message.tool_calls) {
                if (toolCall.type !== "function") {
                    throw new Error("暂不支持该工具类型");
                }
                const toolName = toolCall.function.name;
                debug("AGENT 调用工具:", toolName);

                signal?.throwIfAborted();
                //4.执行本地工具
                const result = await executeTool(
                    /*工具名称*/
                    toolName,
                    /* 模型生成的工具调用参数 */
                    toolCall.function.arguments);

                //5.将工具执行结果添加到历史信息
                messages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: result
                });
            }

            //6.带着工具结果再次请求模型
            continue;
        }


        //7.没有工具调用，本轮结束
        finalAnswer = message.content ?? "";
        completed = true;
        break;
    }
    if (!completed) {
        throw new Error(`Agent 已到达最大调用次数: ${MAX_MODEL_CALLS}`);
    }
    // 循环结束后执行
    debug("Session 消息历史：", messages);

    return finalAnswer;

}