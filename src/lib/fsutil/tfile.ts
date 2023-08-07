import { normalizePath, TAbstractFile, TFile, TFolder, Vault } from "obsidian";

export function resolve_tfolder(folder_str: string): TFolder {
    folder_str = normalizePath(folder_str);

    const folder = app.vault.getAbstractFileByPath(folder_str);
    if (!folder) {
        throw new Error(`Folder "${folder_str}" doesn't exist`);
    }
    if (!(folder instanceof TFolder)) {
        throw new Error(`${folder_str} is a file, not a folder`);
    }

    return folder;
}

export function resolve_tfile(file_str: string): TFile {
    file_str = normalizePath(file_str);

    const file = app.vault.getAbstractFileByPath(file_str);
    if (!file) {
        throw new Error(`File "${file_str}" doesn't exist`);
    }
    if (!(file instanceof TFile)) {
        throw new Error(`${file_str} is a folder, not a file`);
    }

    return file;
}

export function get_tfiles_from_folder(folder_str: string): Array<TFile> {
    const folder = resolve_tfolder(folder_str);

    const files: Array<TFile> = [];
    Vault.recurseChildren(folder, (file: TAbstractFile) => {
        if (file instanceof TFile) {
            files.push(file);
        }
    });

    files.sort((a, b) => {
        return a.basename.localeCompare(b.basename);
    });

    return files;
}

export function move_tfile_to_folder( tfile: TFile, newPath: string):void {
    app.fileManager.renameFile(tfile, newPath);
}