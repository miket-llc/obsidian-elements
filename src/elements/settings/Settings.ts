import { type Setting } from './Setting'
import { Result } from 'typescript-monads'

export interface Settings {
    getSetting(key: string): Result<Setting, Error>
    setSetting(key: string, value: string): Result<void, Error>
    load(): Promise<Result<void, Error>>
    save(): Promise<Result<void, Error>>
}