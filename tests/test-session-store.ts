import { createSession } from "../src/session";
import { saveSession, loadSession } from "../src/session-store";
import { randomUUID } from "node:crypto";

async function main() {

    const session = createSession();

    session.messages.push({
        role: "user",
        content: "你好，我正在学习 TypeScript Agent"
    });

    session.messages.push({
        role: "assistant",
        content: "你好，我们继续学习。"
    });

    await saveSession(session);
    // 从磁盘读取刚刚保存的 Session
    const loadedSession = await loadSession(session.id);

    if (!loadedSession) {
        throw new Error("Session 读取失败");
    }

    console.log("原始 Session ID:", session.id);
    console.log("读取 Session ID:", loadedSession.id);

    console.log("原始消息数量:", session.messages.length);
    console.log("读取消息数量:", loadedSession.messages.length);

// 验证恢复的数据
    if (loadedSession.id !== session.id) {
        throw new Error("Session ID 不一致");
    }

    if (
        JSON.stringify(loadedSession.messages) !==
        JSON.stringify(session.messages)
    ) {
        throw new Error("Session 消息历史不一致");
    }

    console.log("Session 保存与读取测试通过");


    const missingSession = await loadSession(randomUUID());

    console.log("不存在的 Session:", missingSession);

    if (missingSession !== undefined) {
        throw new Error("不存在的 Session 应返回 undefined");
    }

    console.log("Session 保存成功");
    console.log("Session ID:", session.id);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});