import { inject, injectable } from 'inversify';
import { Maybe, Result, maybe, ok } from 'typescript-monads';

export interface CoreConceptSettings {
    type: string;
    folder: string;
    tag: string;
}

@injectable()
export class ElementsSettings {
    _coreConcepts: Maybe<Array<CoreConceptSettings>>
    _useConceptFolders: Maybe<boolean>

    get coreConcepts() { return this._coreConcepts.valueOr(DEFAULT_SETTINGS.coreConcepts) }
    set CoreConcepts( coreConcepts: Array<CoreConceptSettings> ) { this._coreConcepts = maybe(coreConcepts) }

    get useConceptFolders() { return this._useConceptFolders.valueOr(DEFAULT_SETTINGS.useConceptFolders) }
    set useConceptFolders( useConceptFolders: boolean ) { this._useConceptFolders = maybe(useConceptFolders) }
}

const DEFAULT_SETTINGS = {
    coreConcepts: [
        {type: "Concept", folder: "/02 Concepts", tag: "concept"},
        {type: "Person", folder: "/03 People", tag: "person"},
        {type: "Meeting", folder: "/04 Meetings", tag: "meeting"},
        {type: "Institutions", folder: "/04 Institutions", tag: "institutions"},
        {type: "Projects", folder: "/05 Projects", tag: "meeting"},
        {type: "PrivateMeetings", folder: "/07 Private/1-1s", tag: "meeting/1-1"},
    ],
    useConceptFolders: true,
}