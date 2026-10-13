import type OpenAI from "openai";



/**
 * 通用工具执行函数类型。
 * 接收一个未知类型的参数值，通常是模型返回的 JSON 参数对象。
 * 执行结果可以同步返回 string，也可以异步返回 Promise<string>。
 */
export  type  ToolHandler = (
    args: unknown
) => string | Promise<string>;


/**
 * 定义工具对象的结构契约。类似对象的概念，但是不是真实对象，无法通过new创建
 * 每个工具必须包含名称、描述、参数 Schema 和执行函数。
 *  type 仅用于 TS 类型检查，不会生成运行时类。
 */
export type ToolDefinition = {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
    handler: ToolHandler;
};


/**
 * 工具注册集合 key  value
 * key  键,工具名
 * value 值，工具实体
 */
const registry = new Map<string, ToolDefinition>();


/**
 * 添加工具方法，调用方法传入工具实体自动注册工具到列表
 * @param tool
 */
export function registerTool(tool: ToolDefinition): void {
    registry.set(tool.name, tool);
}

/**
 * 获取工具方法，并且讲参数转换成ai能看懂的格式，将列表里面的工具全部拿出来，放到一个集合里面
 * key 此处统一function
 * value function 工具的几个属性  里面包含三个参数 特别点，不要把handler给到AI
 */
export function getToolDefinitions():
    OpenAI.Chat.Completions.ChatCompletionTool[]{
    return  Array.from(registry.values()).map(tool =>({
        type: "function" as const,
        function:{
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
        }
    }));
}


/**
 * 工具执行函数  传入工具名称和参数 自动执行
 * @param name
 * @param args
 */
export async function executeTool(
    name: string,
    args: string
): Promise<string> {

    const tool = registry.get(name);
    if (!tool) {
        return `未知工具: ${name}`;
    }
    const parsedArgs: unknown = JSON.parse(args);
    return  await tool.handler(parsedArgs)

}

//注册时间工具
registerTool({
    name: "get_current_time",
    description:"获取当前系统日期和时间",
    parameters:{
        type:"object",
        properties:{},
        required:[]
    },
    handler:()=>{
        return new Date().toLocaleString("zh-CN");
    }
});

