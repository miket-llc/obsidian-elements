
import { Result } from 'typescript-monads'

export interface Settings {
    idType: string,
    coreConcepts: Array<string>
    userConcepts: Array<string>
}