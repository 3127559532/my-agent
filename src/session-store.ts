import {mkdir, writeFile} from  "node:fs/promises";
import {join} from "node:path";
import  type {Session} from "./session";

const SESSION_DIR = join(process.cwd(),"data","sessions");
export async function saveSession(session:Session): Promise<void> {
    //1.确保目录存在
    await mkdir(SESSION_DIR,{recursive:true});

    //2.生成文件路径
    const filePath = join(SESSION_DIR,`${session.id}.json`);

    //3.转换成JSON字符串
    const  data = JSON.stringify(session,null,2);
    //4. 保存到磁盘
    await writeFile(filePath,data,"utf-8");
}