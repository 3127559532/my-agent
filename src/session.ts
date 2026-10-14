import type OpenAI from "openai";
import {randomUUID} from "node:crypto";

export type Message =
    OpenAI.Chat.Completions.ChatCompletionMessageParam;
//定义Session
export type Session = {
    id: string,
    messages: Message[];
};


//提供外部方法
export function createSession(): Session {
    return {
        id: randomUUID(),
        messages: []
    };
}