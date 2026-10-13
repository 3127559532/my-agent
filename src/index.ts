import { runAgent } from "./agent";

async function main() {
  const response = await runAgent("请调用 calculator 工具计算 128 乘以 36，告诉我结果");

  console.log("模型回答:",response);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});