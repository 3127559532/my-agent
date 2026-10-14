import {mkdir, writeFile, readFile} from "node:fs/promises";
import {join} from "node:path";
import type {Session} from "./session";

const SESSION_DIR = join(process.cwd(), "data", "sessions");

export async function saveSession(session: Session): Promise<void> {
    //1.确保目录存在
    await mkdir(SESSION_DIR, {recursive: true});

    //2.生成文件路径
    const filePath = join(SESSION_DIR, `${session.id}.json`);

    //3.转换成JSON字符串
    const data = JSON.stringify(session, null, 2);
    //4. 保存到磁盘
    await writeFile(filePath, data, "utf-8");
}

export async function loadSession(
    sessionId: string
): Promise<Session | undefined> {
    //1.检查Session Id
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(sessionId)) {
        throw new Error("Session Id 格式不正确！");
    }

    //2.生成文件路径
    const filePath = join(SESSION_DIR, `${sessionId}.json`);

    //3.读取文件
    let content: string;

    try {
        content = await readFile(filePath, "utf-8");
    } catch (error: unknown) {
        if (
            error instanceof Error &&
            "code" in error &&
            error.code === "ENOENT"
        ) {
            return undefined;
        }
        throw error;
    }
    //4. JSON 字符串转换成对象
    const data: unknown = JSON.parse(content);

    //5.检查基本结果
    if (
        typeof data !== "object" ||
        data === null ||
        !("id" in data) ||
        !("messages" in data) ||
        data.id !== sessionId ||
        !Array.isArray(data.messages)
    ) {
        throw new Error("Session 文件格式不正确");
    }

    //6返回Session
    return data as Session;
}