import { type Command, MarkdownView, Editor, type MarkdownFileInfo } from 'obsidian';
import { log } from '../logger/logger';
import { Either } from 'typescript-monads';
import { fail } from 'assert';
import { EditorCommand } from './EditorCommand';

/**
* Base class for  command that can be executed in the context of an editor.
*/

export abstract class EditorCheckCommand extends EditorCommand {
private _checking: boolean;

constructor(cmd: Command) {
super(cmd);
this.command.checkCallback = undefined; // Manually override our parent class' handler, though the app is not supposed to call it.
this.command.editorCheckCallback = this.editorCheckCallbackHandler;
}

/**
* Checks to see if this Command can be executed for the current context. Called by the app before the command is executed.
* For example, when the user is presented with a list of commands to execute in a command palette.
* @returns The default implementation returns an Error. if not implemented. Implemtations should
* return `Either<Error, boolen>` which is true if the command can be executed in the current context, false if not, and
* immplementations should return and custom Error when needed.
*
*/
executeCheck(): Either<Error, boolean> { fail(new Error(`Elements Command ${typeof (this)}.executeCheck() is not implemented.`)); }

/**
* Callback handler intended to be called directly by the containing application. Calls @link{executeCheck} to see if the command
* can be executed in the current context. Calls @link{execute} when the command is invoked. Adds mondads, logging, and error handling
* to the implementation in keeping with the Elements Plugin conventions.
* @param checking First call from Obsidian will set `checking` to true to see if we return boolean. See @link{executeCheck}
* for more info on what happens when checking is true or false.
* @param editor Link to the editor that is currently active in Obsidian.
* @param ctx Sloppily, Obsidian insists on us doing a type check to see if the context is a MarkdownView or MarkdownFileInfo.
* @warning We don't `throw` errors, we return them. Unless we eat them. This is one time we eat it, but we log it. Check the Obsidian log.
* @todo Consider raising an error event rather than just logging it.
*/
private editorCheckCallbackHandler(checking: boolean, editor: Editor, ctx: MarkdownView | MarkdownFileInfo): boolean | void {
this._editor = editor;
this._context = ctx;

if (checking) {
return this.executeCheck().match({
// Yeah, we sort of eat the error here for the good of the user. Better check the Obsidian log.
left: (e: Error) => { log('error', e.message); },
// Return the result of the check.
right: (b: boolean) => { return b; }
});
} else {
this.execute().match({
left: (e: Error) => { log('error', e.message); },
right: () => { log('debug', `Command ${typeof this} executed successfully.`); }
});
}
}
}
