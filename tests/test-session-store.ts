import { createSession } from "../src/session";
import { saveSession } from "../src/session-store";

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

    console.log("Session 保存成功");
    console.log("Session ID:", session.id);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});