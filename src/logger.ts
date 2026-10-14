import { inspect } from "node:util";

const DEBUG = process.env.DEBUG === "true";

export function debug(...args: unknown[]): void {
    if (DEBUG) {
        console.log(...args.map(arg =>
            typeof arg === "object"
                ? inspect(arg, { depth: null, colors: true })
                : arg
        ));
    }
}