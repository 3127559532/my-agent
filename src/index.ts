import { runAgent } from "./agent";

async function main() {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    console.log("用户请求停止 Agent");
    controller.abort();
  }, 60000);

  try {
    const answer = await runAgent(
        "请使用 calculator 计算 128 乘以 36",
        controller.signal
    );

    console.log("模型回答：", answer);
  } finally {
    clearTimeout(timer);
  }
}

main().catch(error => {
  console.error(
      "Agent 结束：",
      error instanceof Error ? error.message : String(error)
  );
  process.exitCode = 1;
});