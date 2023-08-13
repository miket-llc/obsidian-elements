import { type Command } from './Command'
import { Either, Maybe } from 'typescript-monads';

export interface CommandHistory {
    history: Command[]
    push(command: Command): Either<Error, void>
    pop(): Maybe<Command>
}