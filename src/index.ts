import { runAgent } from "./agent";
import { createSession } from "./session";
import { SessionManager } from "./session";

async function main() {

  const manager = new SessionManager();

  // 1. 创建两个 Session
  const sessionA = manager.createSession();
  const sessionB = manager.createSession();

  console.log("Session A:", sessionA.id);
  console.log("Session B:", sessionB.id);

  // 2. 根据 ID 查询
  const found = manager.getSession(sessionA.id);

  console.log("查询是否为同一个对象:", found === sessionA);

  // 3. 查看全部会话
  console.log("会话数量:", manager.listSessions().length);

  // 4. 删除 Session A
  const deleted = manager.deleteSession(sessionA.id);

  console.log("删除成功:", deleted);
  console.log("删除后会话数量:", manager.listSessions().length);

  // 5. 再次查询已删除的 Session
  console.log("查询已删除的会话:", manager.getSession(sessionA.id));

  // 6. 验证 B 仍然存在
  console.log(
      "Session B 是否仍存在:",
      manager.getSession(sessionB.id) === sessionB
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});