//异步理解实例代码
async  function  main(){
    console.log("1.开始");
    const task = new Promise<string>((resolve) => {
        console.log("2.Promise 开始执行");

        setTimeout(() => {
            console.log("4.定时器执行");
            resolve("任务成功");
        },2000);
        console.log("3.Promise 内的同步代码执行完成");
    });
    const result = await  task;
    console.log("5.获得结果: ",result);
}
main();