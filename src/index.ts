import { runAgent } from "./agent";

async function main() {
  const response = await runAgent("使用 calculator 计算 100 除以 0，并解释结果");

  console.log("模型回答:",response);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});