import {clearTimeout} from "node:timers";



async function main() {
    const controller = new AbortController();
    const signal = controller.signal;

    console.log("任务开始");

    const task = new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
            resolve();
        }, 5000);

        signal.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(new Error("任务被主动取消"));
        }, {once: true});
    });
    setTimeout(() => {
        console.log("发送取消信号");
        controller.abort();
    }, 2000);

    await task;

    console.log("任务完成");

}
main().catch((error) =>{
    console.error(error.message);
});

