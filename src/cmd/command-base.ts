import { Command, MarkdownView, Editor, MarkdownFileInfo, Hotkey, Plugin } from 'obsidian';
import { log } from '../lib/log/logger';
import { Either  } from 'typescript-monads';
import { fail } from 'assert';

export type CommandProperties = Pick<Command, 'id' | 'name' | 'hotkeys' | 'icon' | 'mobileOnly' | 'repeatable'>

/**
 * Base class for all Elements Plugin commands. Can be inherited directly for command implementations that don't required
 * real time updates to the their execution context from the plugin or application (e.g. the current editor, the current file, etc.).
 */
export abstract class CommandBase implements Command {
    private _command: Command;
    private _plugin: Plugin;

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

    get id(): string { return this._command.id }
    set id(id: string) { this._command.id = id } 

    get name(): string { return this._command.name }
    set name(name: string) { this._command.name = name }

    get hotkeys() { return this._command.hotkeys }
    set hotkeys(hotkeys: Hotkey[] ) { this._command.hotkeys = hotkeys }

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
            right: () => { log('debug', `Command ${this.name} executed successfully.`)}
        })
    }
}

/**
 * Abstract base class for commands that need to check before they can be invoked. This check is not just for safety. For example, an
 * application client may want to check to see if the command or a UI element associated with the command should be enabled
 * or disabled based on the current applcation context.
 */
export abstract class CheckCommand extends CommandBase {
    constructor(cmd : CommandProperties) {
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
    executeCheck(): Either<Error, boolean> { fail(new Error(`Elements Command ${typeof(this)}.executeCheck() is not implemented.`)) }
    
    /**
     * Callback handler for Obsidian to call when the command is executed. This is for the "checkCommand" type. See @link{CommandBase}
     * for our rant on why this is so icky.
     * @param checking Passed by obsidian to indicate whether it is checking to see if the command can be executed, or if it is
     * executing the command.
     */
    private checkCallbackHandler(checking: boolean): boolean | void
    {
        if(checking) {
            return this.executeCheck().match({
                // Yeah, we sort of eat the error here for the good of the user. Better check the Obsidian log.
                left: (e: Error) => { log('error', e.message)},
                // Return the result of the check.
                right: (b: boolean) => { return b }
            })
        } else {
            this.execute().match({
                left: (e: Error) => { log('error', e.message) },
                right: () => { log('debug', `Command ${this.name} executed successfully.`)}
            })
        }
    }
}

/**
 * Abstract base class for Obsidian Editor commands that should be checked if they can be invoked. This check is not just for 
 * safety, but can assist with user interface design and implementation. For example, an application client may want to check 
 * to see if the command or a UI element associated with the command should be enabled or disabled based on the current 
 * applcation context.
 */
export abstract class EditorCommand extends CommandBase {
    protected _editor: Editor
    protected _context: MarkdownView | MarkdownFileInfo

    constructor(cmd : CommandProperties) {
        super(cmd);
        this.command.callback = this.command.callback = null;
        this.command.editorCallback = this.editorCallbackHandler;
    }

    editorCallbackHandler(editor: Editor, ctx: MarkdownView | MarkdownFileInfo): void {
        this._editor = editor;
        this._context = ctx;

        this.execute().match({
            left: (e: Error) => { log('error', e.message) },
            right: () => { log('debug', `Command ${this.id} executed successfully.`) }
        })
    }
}

/**
 * Base class for  command that can be executed in the context of an editor.
 */
export abstract class EditorCheckCommand extends EditorCommand {
    private _checking: boolean
    
    constructor(cmd : Command) {
        super(cmd)
        this.command.checkCallback = undefined; // Manually override our parent class' handler, though the app is not supposed to call it.
        this.command.editorCheckCallback = this.editorCheckCallbackHandler
    }

    /**
     * Checks to see if this Command can be executed for the current context. Called by the app before the command is executed.
     * For example, when the user is presented with a list of commands to execute in a command palette.
     * @returns @type The default implementation returns an Error. if not implemented. Implemtations should 
     * return `Either<Error, boolen>` which is true if the command can be executed in the current context, false if not, and
     * immplementations should return and custom Error when needed.
     * 
     */
    executeCheck(): Either<Error, boolean> { fail(new Error(`Elements Command ${typeof(this)}.executeCheck() is not implemented.`)) }

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
        
        if(checking) {
            return this.executeCheck().match({
                // Yeah, we sort of eat the error here for the good of the user. Better check the Obsidian log.
                left: (e: Error) => { log('error', e.message)},
                // Return the result of the check.
                right: (b: boolean) => { return b }
            })
        } else {
            this.execute().match({
                left: (e: Error) => { log('error', e.message) },
                right: () => { log('debug', `Command ${this.name} executed successfully.`)}
            })
        }
    }
}
