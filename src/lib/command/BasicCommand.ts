import { type Command } from 'obsidian';
import { log } from '../logger/logger';
import { Either } from 'typescript-monads';
import { fail } from 'assert';

export type CommandProperties = Pick<Command, 'id' | 'name' | 'hotkeys' | 'icon' | 'mobileOnly' | 'repeatable'>

/**
 * Base class for all Elements Plugin commands. Can be inherited directly for command implementations that don't required
 * real time updates to the their execution context from the plugin or application (e.g. the current editor, the current file, etc.).
 */
export abstract class CommandBase {
    private _command: Command;

    constructor(props: CommandProperties) {
        this.command = {
            id: props.id,
            name: props.name,
            hotkeys: props.hotkeys,
            icon: props.icon,
            mobileOnly: props.mobileOnly,
            repeatable: props.repeatable,
        }
        this.command.callback = this.callbackHandler;
    }
    
    /** 
     * Obsidian @type(Command) object that is wrapped by this class.
     */
    protected get command(): Command {
        return this._command;
    }

    /** 
     * We want to protect the Command object from being set to null, though it's properties are
     * mutable to subclasses.
    */
    private set command(command: Command) {
        this._command = command;
    }

    /**
         * Executes the command in the current context. Intended to be called by the application and/or plugin.
         * @returns @type The default implementation returns a @type(Error) if not implemented. 
         * Implementers should Either<Error, void> which is void if the command executed successfully, and
     */
    execute(): Either<Error, void> { fail(new Error(`Elements Command ${typeof(this)}.execute() is not implemented.`)) }   

    /**
     * Callback handler for Obsidian to call when the command is executed. In Obsidian, 
     * each command type is implmented as a different variable holding a reference to your callback functions, 
     * each with it's own function signature. Worse, this function is called twice: once to check to see if it's OK to execute 
     * and a second time to execute. We abstract this away for implementers of this base class and handle the icky details.
     * 
     * We also introduce monads, logging, and error handling to our implementation to make the interface to our plugin more
     * more modern fault tolerance and debugging.
    */
    private callbackHandler(): void {
        this.execute().match({
            left: (e: Error) => { log('error', e.message) },
            right: () => { log('debug', `Command ${typeof this} executed successfully.`)}
        })
    }
}