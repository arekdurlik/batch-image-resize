/* eslint-disable @typescript-eslint/no-explicit-any */
import { css } from 'styled-components';
import { DEBUG_LEVEL } from './config';

const style = css`
    font-weight: bold;
    color: black;
    padding: 2px 5px;
    border-radius: 2px;
    text-align: center;
`;

enum LogType {
    DEBUG = 'DEBUG',
    WARN = 'WARNING',
    ERROR = 'ERROR',
}
enum LogColor {
    INFO = '#c2c2c2',
    DEBUG = '#808080',
    WARN = '#ffd900',
    ERROR = '#ff2b2b',
}
enum Func {
    INF = 'info',
    DBG = 'debug',
    WRN = 'warn',
    ERR = 'error',
}

export class Log {
    static #log(level: number, funcType: Func, type: LogType, color: string, data: any[]) {
        if (level > DEBUG_LEVEL) return;

        console[funcType](`%c${type}`, style + `background: ${color}`, ...data);
    }

    static debug_verbose(...params: any[]) {
        this.#log(3, Func.DBG, LogType.DEBUG, LogColor.DEBUG, params);
    }

    static debug(...params: any[]) {
        this.#log(2, Func.INF, LogType.DEBUG, LogColor.INFO, params);
    }

    static warn(...params: any[]) {
        this.#log(1, Func.WRN, LogType.WARN, LogColor.WARN, params);
    }

    static error(...params: any[]) {
        this.#log(0, Func.ERR, LogType.ERROR, LogColor.ERROR, params);
    }

    static assert(value: boolean, ...params: any[]) {
        if (value) return;

        this.#log(0, Func.ERR, LogType.ERROR, LogColor.ERROR, params);
    }
}
