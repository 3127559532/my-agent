import { runAgent } from "./agent";
import { createSession } from "./session";

async function main() {
  const sessionA = createSession();
  const sessionB = createSession();
  console.log("Session A",sessionA.id);
  console.log("Session B",sessionB.id);

  //A的第一轮
  await  runAgent(
      sessionA,
      "我最喜欢的编程语言是Python"
  );

  //B的第一轮
  const anserB = await  runAgent(
      sessionB,
      "是否知道我最喜欢的编程语言，如果不清楚直接说不知道"
  );

  console.log("Session B回答",anserB);

  //A的第二轮
  const answerA =await  runAgent(
      sessionA,
      "我刚才说的最喜欢的编程语言是什么？"
  );

  console.log("session A 回答",answerA)
  console.log("A的消息数量",sessionA.messages.length)
  console.log("B的消息数量",sessionB.messages.length)

  const bHasPythonHistory = sessionB.messages.some(
      message =>
          message.role === "user" &&
          typeof message.content === "string" &&
          message.content.includes("Python")
  );

  if (bHasPythonHistory) {
    throw new Error("Session 隔离失败：B 包含 A 的用户消息");
  }

  if (sessionA.id === sessionB.id) {
    throw new Error("Session ID 重复");
  }

  console.log("Session 隔离检查通过");

}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});