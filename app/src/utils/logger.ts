import ENVS from "@/envs";

export default class Logger {
    public static debug(...args: any[]) {
        if(!ENVS.DEBUG) return;

        console.log(...args)
    }

    public static warn(...args: any[]) {
        console.log(...args)
    }

    public static error(...args: any[]) {
        console.log(...args)
    }

    public static readonly DEBUG_PREFIX = ""
}