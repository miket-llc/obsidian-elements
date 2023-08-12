/// <reference types="svelte" />
//import { CachedMetadata,  } from 'obsidian';
import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	TFile,
	TFolder,
} from "obsidian";
import { SettingsTab } from "../ui/settings-tab";
// import { DEFAULT_SETTINGS } from './lib/settings/settings';
// import { move_tfile_to_folder as moveTFile } from 'lib/fsutil/tfile';
import { log } from "../lib/logger/logger";

export type IElements 

export default class Elements extends Plugin {
	public async onload() {
		log("info", "Loading Elements plugin...");
		// We should load settings as soon as the plugin is loaded.
		await this.loadSettings();

		this.registerView(VIEW_TYPE_EXAMPLE, (leaf) => new ExampleView(leaf));

		this.addRibbonIcon("dice", "Activate view", () => {
			this.activateView();
		});

		// Create Elements icon in the left ribbon. See https://lucide.dev/icons.
		const ribbonIconEl = this.addRibbonIcon(
			"atom",
			"Elements",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				//new Notice('Now you\'ve done it');

				new Notice("Now you've really done it");
			}
		);
		// Add aditional icon eleement styling or processing
		ribbonIconEl.addClass("elements-plugin-icon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Elements is active.");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: () => {
				new ElementsCommandModal(
					this.app,
					"This command will blow your mind.",
					"OK to have mind blown.",
					"Cancel to say no to adventure"
				).open();
			},
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new ElementsCommandModal(
							this.app,
							"Elements",
							"This command will blow your mind.",
							"Cancel to say no to adventure"
						).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// this.addCommand({
		// 	id: 'move-all-files-to-best-folder',
		// 	name: "Moves all notes to the most appropriate folder",
		// 	callback: async () => {
		// 		await this.moveAllNotesToBestFolder();
		// 	}
		// });

		// this.addCommand({

		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);

		log("info", "Elements plugin loaded.");
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);
		log('info', 'got to activateView()')

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: VIEW_TYPE_EXAMPLE,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0]
		);
	}

	public onunload() {}

	private async loadSettings() {
		const start = new Date().getTime();
		log("debug", "Loading Elements plugin settings...");
		//this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		log(
			"debug",
			`Elements plugin settings loaded in ${
				new Date().getTime() - start
			}ms.`
		);
	}

	public async saveSettings() {
		const start = new Date().getTime();
		log("debug", "Saving Elements plugin settings...");
		//await this.saveData(this.settings);
		log(
			"debug",
			`Elements plugin settings loaded in ${
				new Date().getTime() - start
			}ms.`
		);
	}

	// protected isFileInIgnoredFolder(tfile: TFile): boolean {
	// 	// for each setting in the string array...
	// 	return ( this.settings.folders_to_ignore.findIndex((str: string) => {
	// 			// return true to findIndex if the string starts with the path of the file
	// 			return tfile.path.indexOf(normalizePath(str)) == 0;
	// 		// return true to the caller of this methodif findIndex returns a value other than -1
	// 		// meaning that we found a match
	// 		}) != -1);
	// }

	private indexOfTypeSetting(tfile: TFile): number {
		return -1;
	}

	// private async moveAllNotesToBestFolder(): Promise<void> {
	// 	console.log('got to MoveAllToBestFolder async function');
	// 	const files = this.app.vault.getMarkdownFiles();
	// 	let success = false;
	// 	console.log("length of markdown files array: " + files.length);
	// 	for(let i = 0; i < files.length; i++) {
	// 		const file = files[i];
	// 		if(this.isFileInIgnoredFolder(file))
	// 		{
	// 			console.log("SKIPPING" + file.basename)
	// 		} else {
	// 			console.log("PROCESSING" + file.basename);
	// 		}
	//         const cache = this.app.metadataCache.getFileCache(files[i]);
	// 		const tags = getAllTags((cache as CachedMetadata));
	// 		if(tags?.length > 0) {
	// 			console.log(files[i].basename)
	// 			console.log(tags);
	// 			for (let j = 0; i < this.settings.core_concepts.length; j++) {
	// 				const concept = this.settings.core_concepts[j];
	// 				if(tags?.includes('#' + concept.tag)) {
	// 					//move_tfile_to_folder(tfile, concept.folder)
	// 					console.log(concept.folder + '/' + file.name);
	// 					success = true
	// 					break
	// 				}
	// 			}
	// 		}
	// 		if(!success) {
	// 			// move_tfile_to_folder(files[i], this.settings.default_concept_folder);
	// 		}
	// 	}
	// }

	private getBestFolder(file: TFile): TFolder {
		const bestFolder = new TFolder();

		return bestFolder;
	}
}


import { ItemView, WorkspaceLeaf } from "obsidian";

import Component from "../ui/components/Component.svelte";

export const VIEW_TYPE_EXAMPLE = "example-view-two";

export class ExampleView extends ItemView {
	component: Component;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "Example view";
	}

	async onOpen() {
		this.component = new Component({
			target: this.contentEl,
			props: {
				variable: 1,
			},
		});
	}

	async onClose() {
		this.component.$destroy();
	}
}

class ElementsCommandModal extends Modal {
	constructor(app: App, desc: string, okText: string, cancelText: string) {
		super(app);
		this.descriptionText = desc;
		this.okButtonText = okText;
		this.cancelButtonText = cancelText;
	}

	okButtonText = "OK";
	cancelButtonText = "Cancel";
	descriptionText = "";

	onOpen() {
		//logUpdate("got here");
		console.log("got here");
		const { contentEl } = this;
		contentEl.createEl("h1", { text: "Elements" });
		contentEl.createEl("h2", { text: this.descriptionText });
		this.containerEl.empty();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
