import { Notice } from "obsidian";
import { ElementsError } from "./Error";

export function logMessage(msg: string): void {
    const notice = new Notice("", 15000);
    notice.setMessage(`<b>Elements</b>:<br/>`+ msg);
    console.log(msg);
}

export function logError(e: Error | ElementsError): void {
    const notice = new Notice("", 15000);
    if (e instanceof ElementsError && e.console_msg) {
        notice.setMessage(`<b>Elements Error</b>:<br/>' + e.message + '<br/>Check console for more information`);
        console.error(`Elements Error:`, e.message, "\n", e.console_msg);
    } else {
        notice.noticeEl.innerHTML = `<b>Elements Error</b>:<br/>${e.message}`;
    }
}
