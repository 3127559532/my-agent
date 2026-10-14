import { runAgent } from "./agent";
import { createSession } from "./session";

async function main() {
  const session = createSession();

  console.log("Session ID:", session.id);

  const answer1 = await runAgent(
      session,
      "我最喜欢的编程语言是 Python，请记住这个信息。"
  );

  console.log("第一轮回答：", answer1);

  const answer2 = await runAgent(
      session,
      "我最喜欢的编程语言是什么？"
  );

  console.log("第二轮回答：", answer2);

  console.log("历史消息数量：", session.messages.length);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});