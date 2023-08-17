import { Result } from 'typescript-monads'
import { type Settings } from './Settings'

export interface SettingsStore {
    load(): Promise<Result<Settings, Error>>
    save(settings: Settings): Promise<Result<void, Error>>
}
