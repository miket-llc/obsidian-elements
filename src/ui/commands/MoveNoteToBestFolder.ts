import { EditorCommand } from '../../lib/command/EditorCommand';
// import { MarkdownView, CachedMetadata, getAllTags } from 'obsidian';
// import { Either } from 'typescript-monads';

export class MoveNoteToBestFolder extends EditorCommand {
    
    constructor() { 
        super({
            id: 'move-to-best-folder',
			name: 'Move note to most appropriate folder',
            icon: 'atom',
            hotkeys: [],
            mobileOnly: false,
            repeatable: false
        })
    }
}

    //execute(): Either<Error, void> {
        // const file = this._context.view.file;
        // let success = false;
        // if(file instanceof TFile) {
        //     const cache = this.app.metadataCache.getFileCache(file);
        //     const tags = getAllTags((cache as CachedMetadata));
        //     for (let i = 0; i < this.settings.core_concepts.length; i++) {
        //         const concept = this.settings.core_concepts[i];
        //         if(tags?.includes('#' + concept.tag)) {
        //             moveTFile(file, concept.folder)
        //             success = true;
        //             break;
        //         }
        //     }
        //     if(!success) {
        //         moveTFile(file, this.settings.default_concept_folder);
        //     }
        // }