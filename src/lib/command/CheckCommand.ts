import { log } from "../logger/logger";
import { Either } from "typescript-monads";
import { fail } from "assert";
import { CommandBase, CommandProperties } from "./BasicCommand";

/**
 * Abstract base class for commands that need to check before they can be invoked. This check is not just for safety. For example, an
 * application client may want to check to see if the command or a UI element associated with the command should be enabled
 * or disabled based on the current applcation context.
 */
export abstract class CheckCommand extends CommandBase {
	constructor(cmd: CommandProperties) {
		super(cmd);
		this.command.checkCallback = this.checkCallbackHandler;
	}

	/**
	 * Checks to see if this Command can be executed for the current context. Called by the app before the command is executed.
	 * For example, when the user is presented with a list of commands to execute in a command palette.
	 * @returns @type The default implementation returns an Error. if not implemented. Implemtations should
	 * return `Either<Error, boolen>` which is true if the command can be executed in the current context, false if not, and
	 * immplementations should return and custom Error when needed.
	 *
	 */
	executeCheck(): Either<Error, boolean> {
		fail(
			new Error(
				`Elements Command ${typeof this}.executeCheck() is not implemented.`
			)
		);
	}

	/**
	 * Callback handler for Obsidian to call when the command is executed. This is for the "checkCommand" type. See @link{CommandBase}
	 * for our rant on why this is so icky.
	 * @param checking Passed by obsidian to indicate whether it is checking to see if the command can be executed, or if it is
	 * executing the command.
	 */
	private checkCallbackHandler(checking: boolean): boolean | void {
		if (checking) {
			return this.executeCheck().match({
				// Yeah, we sort of eat the error here for the good of the user. Better check the Obsidian log.
				left: (e: Error) => {
					log("error", e.message);
				},
				// Return the result of the check.
				right: (b: boolean) => {
					return b;
				},
			});
		} else {
			this.execute().match({
				left: (e: Error) => {
					log("error", e.message);
				},
				right: () => {
					log("debug", `Command ${typeof this} executed successfully.`);
				},
			});
		}
	}
}
