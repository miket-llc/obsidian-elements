
import { Result } from 'typescript-monads'

export interface Settings {
    idType: string,
    coreConcepts: Array<string>
    userConcepts: Array<string>
}

export const DEFAULT_SETTINGS = {
    idType: "uuid",
    coreConcepts: [
        "Concept",
        "Person",
        "Meeting",
        "Institutions",
        "Projects",
    ],
}