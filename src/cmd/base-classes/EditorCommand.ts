import { MarkdownView, Editor, MarkdownFileInfo } from "obsidian";
import { log } from "../../lib/log/logger";
import { CommandBase, CommandProperties } from "./BasicCommand";

/**
 * Abstract base class for Obsidian Editor commands that should be checked if they can be invoked. This check is not just for
 * safety, but can assist with user interface design and implementation. For example, an application client may want to check
 * to see if the command or a UI element associated with the command should be enabled or disabled based on the current
 * applcation context.
 */
export abstract class EditorCommand extends CommandBase {
	protected _editor: Editor;
	protected _context: MarkdownView | MarkdownFileInfo;

	constructor(cmd: CommandProperties) {
		super(cmd);
		this.command.callback = this.command.callback = null;
		this.command.editorCallback = this.editorCallbackHandler;
	}

	editorCallbackHandler(
		editor: Editor,
		ctx: MarkdownView | MarkdownFileInfo
	): void {
		this._editor = editor;
		this._context = ctx;

		this.execute().match({
			left: (e: Error) => {
				log('error', e.message);
			},
			right: () => {
				log('debug', `Command ${typeof this} executed successfully.`);
			},
		});
	}
}
