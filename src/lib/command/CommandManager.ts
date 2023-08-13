import { type Command } from './Command'
import { type CommandHistory } from './CommandHistory'
import { Either, Maybe } from 'typescript-monads'

export interface CommandManager {
    commandHistory: Maybe<CommandHistory>
    setCommand(command: Command): Either<Error, void>
    executeCommand(command: Command): Either<Error, void>
}