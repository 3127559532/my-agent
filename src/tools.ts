//1.定义函数工具类型
export  type  ToolHandler = (
    args: unknown
) => string | Promise<string>;


//2.创建工具注册表
//2.1创建容器
const registry = new Map<string, ToolHandler>();

//2.2定义方法，后续传入工具名和handler 添加工具到容器
export function registerTool(
    name: string,
    handler: ToolHandler
): void {
    registry.set(name, handler);
}

//3.实现工具分发
export async function executeTool(
    name: string,
    args: string
): Promise<string> {
    //3.1.根据传入的工具名找到工具
    const handler = registry.get(name);
    //3.2.判断是否找到工具
    if (!handler) {
        return `未知工具: ${name}`;
    }
    //3.3解析传入的参数
    const parsedArgs: unknown = JSON.parse(args);
    //3.4传入参数调用工具
    return await handler(parsedArgs);
}

//4.注册时间工具
registerTool("get_current_time",() =>{
    return new Date().toLocaleString("zh-CN");
});

