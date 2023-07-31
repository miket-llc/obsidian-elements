import { Notice } from "obsidian";
import { ElementsError } from "./Error";

export function log_update(msg: string): void {
    const notice = new Notice("", 15000);
    // TODO: Find better way for this
    // @ts-ignore
    notice.noticeEl.innerHTML = `<b>Elements update</b>:<br/>${msg}`;
}

export function log_error(e: Error | ElementsError): void {
    const notice = new Notice("", 8000);
    if (e instanceof ElementsError && e.console_msg) {
        // TODO: Find a better way for this
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Elements Error</b>:<br/>${e.message}<br/>Check console for more information`;
        console.error(`Elements Error:`, e.message, "\n", e.console_msg);
    } else {
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Elements Error</b>:<br/>${e.message}`;
    }
}
