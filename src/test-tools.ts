import { executeTool } from "./tools";

async function main() {

    const tests = [
        {
            name: "正常乘法",
            args: '{"a":128,"b":36,"operation":"multiply"}'
        },
        {
            name: "参数类型错误",
            args: '{"a":"128","b":36,"operation":"add"}'
        },
        {
            name: "除数为零",
            args: '{"a":100,"b":0,"operation":"divide"}'
        },
        {
            name: "非法 JSON",
            args: '{"a":100,"b":}'
        }
    ];

    for (const test of tests) {
        const result = await executeTool("calculator", test.args);

        console.log(`${test.name}：${result}`);
    }
}

main().catch(console.error);