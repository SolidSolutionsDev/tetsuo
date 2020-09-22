import { Logger } from "webpack";

export type LoggerLevel = "verbose" | "info" | "error";

let currentLogLevel: LoggerLevel = "error";

const Logger = {
    verbose: (...msgs: any[]) => {
        if (currentLogLevel === "verbose") {
            console.log(`${Date.now()} [VERBOSE]`, ...msgs);
        }
    },

    log: (...msgs: any[]) => {
        if (currentLogLevel === "info" || currentLogLevel === "verbose") {
            console.log(`${Date.now()} [LOG]`, ...msgs);
        }
    },

    warn: (...msgs: any[]) => {
        if (currentLogLevel === "info" || currentLogLevel === "verbose") {
            console.warn(`${Date.now()} [WARNING]`, ...msgs);
        }
    },

    error: (...msgs: any[]) => {
        if (currentLogLevel === "error") {
            console.trace(`${Date.now()} [ERROR]`, ...msgs);
        }
    },

    setLevel: (newLevel: LoggerLevel) => {
        currentLogLevel = newLevel;
    },
};

export default Logger;
