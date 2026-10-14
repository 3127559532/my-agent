import { runAgent } from "./agent";
import { SessionManager } from "./session";

async function main() {

  const manager = new SessionManager();

  // 1. 创建Session
  const session = manager.createSession();
  const sessionId = session.id;

  console.log("创建会话", sessionId);


  // 2. 第一轮对话
  const answer1 = await  runAgent(
      session,
      "我最喜欢的编程语言是python");
  console.log("第一轮回答",answer1);

  //3. 第二 通过ID找回Session
  const restoredSession = manager.getSession(sessionId);
  if(!restoredSession){
    throw  new Error("Session 不存在");
  }
  const answer2 = await  runAgent(
      restoredSession,
      "我刚才说我最喜欢的编程语言是什么?"
  );

  console.log("第二轮回答",answer2);
  console.log("历史消息数量:",restoredSession.messages.length);

}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});