import { Notice } from "obsidian";

export function logMessage(msg: string): void {
    const notice = new Notice("", 15000);
    notice.setMessage(`<b>Elements</b>:<br/>`+ msg);
    console.log(msg);
}
