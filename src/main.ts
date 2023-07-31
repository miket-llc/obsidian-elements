import { CachedMetadata } from 'obsidian';
import { App, getAllTags, Editor, MarkdownView, Modal, Notice, Plugin, TFile, TFolder } from 'obsidian';
import { ElementsSettingTab, ElementsPluginSettings, DEFAULT_SETTINGS } from './settings/Settings';
import {move_tfile_to_folder} from 'utils/Utils';

export default class ElementsPlugin extends Plugin {
	settings: ElementsPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon. See https://lucide.dev/icons. 
		const ribbonIconEl = this.addRibbonIcon('atom', 'Elements Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Now you\'ve done it!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Elements is active.');

		// Create a command to automatically sort all files in the vault to the correct folders

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new ElementsSampleModal(this.app).open();
			}
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new ElementsSampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});


		this.addCommand({
			id: 'sort-all-files-by-elements-tag',
			name: 'Sort all files by elements tag',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new ElementsSampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		this.addCommand({
			id: 'move-to-most-appropriate-folder',
			name: 'Move to most appropriate folder',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const file = view.file;
				console.log(file);
				console.log(file instanceof TFile);
				if(file instanceof TFile) {
					const cache = this.app.metadataCache.getFileCache(file);
					const tags = getAllTags((cache as CachedMetadata));
					for (let i = 0; i < this.settings.core_concepts.length; i++) {
						const concept = this.settings.core_concepts[i];
						if(tags?.includes('#' + concept.tag)) {
							//this.app.vault.rename(file, concept.folder + '/' + file.name);
							move_tfile_to_folder(file, concept.folder)
							break;
						}
					}
				}
			}
		});


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ElementsSettingTab(this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	getBestFolder(file: TFile) : TFolder {
		const bestFolder = new TFolder();
		
		return bestFolder;
	}


	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ElementsSampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}