import { Logger } from "webpack";

export type LoggerLevel = "verbose" | "info" | "error";

let currentLogLevel: LoggerLevel = "error";

const Logger = {
    verbose: (...msgs: any[]) => {
        if (currentLogLevel === "verbose") {
            console.log(
                `%c[VERBOSE]`,
                "font-weight:bold; background: black; color: gray",
                ...msgs
            );
        }
    },

    log: (...msgs: any[]) => {
        if (currentLogLevel === "info" || currentLogLevel === "verbose") {
            console.log(
                `%c[LOG]`,
                "font-weight:bold; background: black; color: lightblue",
                ...msgs
            );
        }
    },

    warn: (...msgs: any[]) => {
        if (currentLogLevel === "info" || currentLogLevel === "verbose") {
            console.warn(
                `%c[WARNING]`,
                "font-weight:bold; background: black; color: yellow",
                ...msgs
            );
        }
    },

    error: (...msgs: any[]) => {
        if (currentLogLevel === "error") {
            console.trace(
                `%c[ERROR]`,
                "font-weight:bold; background: black; color: red",
                ...msgs
            );
        }
    },

    setLevel: (newLevel: LoggerLevel) => {
        currentLogLevel = newLevel;
    },
};

export default Logger;
