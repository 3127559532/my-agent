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

export class SessionManager{
    private sessions = new Map<string, Session>();

    //创建并注册一个Session
    createSession(): Session{
        const session = createSession();
        this.sessions.set(session.id,session);
        return session;
    }

    //根据SessionId查询
    getSession(id: string): Session | undefined {
        return this.sessions.get(id);
    }

    //查询全部Session
    listSessions(): Session[]{
        return Array.from(this.sessions.values());
    }

    //删除指定Session
    deleteSession(id: string): boolean {
        return this.sessions.delete(id);
    }

}