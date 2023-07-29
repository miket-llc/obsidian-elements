import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';

interface ElementsPluginSettings {
	homePath: string, 
	mapsPath: string, 
	conceptsPath: string, 
	peoplePath: string,
	meetingsPath: string,
	projectsPath: string,
}

const DEFAULT_SETTINGS: ElementsPluginSettings = {
	homePath: '/00 Home',
	mapsPath: '/01 Maps',
	conceptsPath: '/02 Concepts',
	peoplePath: '/03 People',
	meetingsPath: '/04 Meetings',
	projectsPath: '/05 Projects',
}

export default class ElementsPlugin extends Plugin {
	settings: ElementsPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon. See https://lucide.dev/icons. 
		const ribbonIconEl = this.addRibbonIcon('atom', 'Elements Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ElementsSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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

class ElementsSettingTab extends PluginSettingTab {
	plugin: ElementsPlugin;

	constructor(app: App, plugin: ElementsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: "Notes Folders"})

		new Setting(containerEl)
			.setName('Home Folder')
			.setDesc('Folder for a start page or readme.')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.homePath)
				.setValue(this.plugin.settings.homePath)
				.onChange(async (value) => {
					this.plugin.settings.homePath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Maps Folder')
			.setDesc('Folder for a start page or pages.')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.mapsPath)
				.setValue(this.plugin.settings.mapsPath)
				.onChange(async (value) => {
					this.plugin.settings.mapsPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Concepts Folder')
			.setDesc('Concepts Folder.')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.conceptsPath)
				.setValue(this.plugin.settings.conceptsPath)
				.onChange(async (value) => {
					this.plugin.settings.conceptsPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
				.setName('People Folder')
				.setDesc('Folder to store Person notes.')
				.addText(text => text
					.setPlaceholder('Path to folder')
					.setValue(this.plugin.settings.peoplePath)
					.onChange(async (value) => {
						this.plugin.settings.peoplePath = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Meetings Folder')
			.setDesc('Folder for Meeting notes.')
			.addText(text => text
				.setPlaceholder('Path to folder')
				.setValue(this.plugin.settings.meetingsPath)
				.onChange(async (value) => {
					this.plugin.settings.meetingsPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Projects Folder')
			.setDesc('Folder for Project Notes.')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.projectsPath)
				.setValue(this.plugin.settings.projectsPath)
				.onChange(async (value) => {
					this.plugin.settings.projectsPath = value;
					await this.plugin.saveSettings();
				}));
	}
}
