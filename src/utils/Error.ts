import { log_error } from "./Log";

export class ElementsError extends Error {
    constructor(msg: string, public console_msg?: string) {
        super(msg);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export async function errorWrapper<T>(
    fn: () => Promise<T>,
    msg: string
): Promise<T> {
    try {
        return await fn();
    } catch (e) {
        if (!(e instanceof ElementsError)) {
            log_error(new ElementsError(msg, e.message));
        } else {
            log_error(e);
        }
        return null as T;
    }
}

export function errorWrapperSync<T>(fn: () => T, msg: string): T {
    try {
        return fn();
    } catch (e) {
        log_error(new ElementsError(msg, e.message));
        return null as T;
    }
}
