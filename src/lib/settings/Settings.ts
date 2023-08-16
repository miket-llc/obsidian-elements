import { type Setting } from './Setting'
import { Result } from 'typescript-monads'

export interface Settings
{
    settings: Map<string, Setting>
    load(): Promise<Result<void, Error>>
    save(): Promise<Result<void, Error>>
}