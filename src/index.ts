import { runAgent } from "./agent";

async function main() {
  const response = await runAgent("请使用 calculator 计算 128 乘以 36");

  console.log("模型回答:",response);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});