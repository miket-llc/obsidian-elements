import { Either } from 'typescript-monads';

export interface Command {
    execute(): Either<Error, void>;
}