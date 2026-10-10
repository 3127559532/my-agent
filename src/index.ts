import { runAgent } from "./agent";

async function main() {
  const response = await runAgent("请告诉我现在几点钟");

  console.log("模型回答:",response);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});