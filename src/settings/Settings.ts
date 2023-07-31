import { /* ButtonComponent,  */ PluginSettingTab, Setting } from "obsidian";
// import { errorWrapperSync, ElementsError } from "../utils/Error";
//import { FileSuggest, FileSuggestMode } from "./suggesters/FileSuggester";
// import { arraymove, get_tfiles_from_folder } from "../utils/Utils";
//import { log_error } from "../utils/Log";
import ElementsPlugin from "../main";

export interface ElementsTypeSettings {
    type: string;
    folder: string;
    tag: string;
}

export interface FolderTemplate {
    elements_type: string;
    elements_folder: string;
    elements_tag: string;
}

export const DEFAULT_SETTINGS: ElementsPluginSettings = {
    core_concepts: [
        {type: "Concept", folder: "/02 Concepts", tag: "concept"},
        {type: "Person", folder: "/03 People", tag: "person"},
        {type: "Meeting", folder: "/04 Meetings", tag: "meeting"},
        {type: "Institutions", folder: "/04 Institutions", tag: "institutions"},
        {type: "Projects", folder: "/05 Projects", tag: "meeting"},
        {type: "PrivateMeetings", folder: "/07 Private/1-1s", tag: "meeting/1-1"},
    ],
    command_timeout: 5,
    templates_folder: "",
    templates_pairs: [["", ""]],
    trigger_on_file_creation: false,
    auto_jump_to_cursor: false,
    enable_system_commands: false,
    shell_path: "",
    user_scripts_folder: "",
    enable_folder_templates: true,
    syntax_highlighting: true,
    syntax_highlighting_mobile: false,
    enabled_templates_hotkeys: [""],
    startup_templates: [""],
    enable_ribbon_icon: true,
};

export interface ElementsPluginSettings {
    core_concepts: Array<ElementsTypeSettings>;
    command_timeout: number;
    templates_folder: string;
    templates_pairs: Array<[string, string]>;
    trigger_on_file_creation: boolean;
    auto_jump_to_cursor: boolean;
    enable_system_commands: boolean;
    shell_path: string;
    user_scripts_folder: string;
    enable_folder_templates: boolean;
    syntax_highlighting: boolean;
    syntax_highlighting_mobile: boolean;
    enabled_templates_hotkeys: Array<string>;
    startup_templates: Array<string>;
    enable_ribbon_icon: boolean;
}

export class ElementsSettingTab extends PluginSettingTab {
    constructor(private plugin: ElementsPlugin) {
        super(app, plugin);
    }

    display(): void {
        this.containerEl.empty();
    }

    add_general_setting_header(): void {
        this.containerEl.createEl("h2", { text: "General Settings" });
    }

    add_template_folder_setting(): void {
        new Setting(this.containerEl)
            .setName("Template folder location")
            .setDesc("Files in this folder will be available as templates.")
            .addSearch((cb) => {
                // new FolderSuggest(cb.inputEl);
                cb.setPlaceholder("Example: folder1/folder2")
                    .setValue(this.plugin.settings.templates_folder)
                    .onChange((new_folder) => {
                        this.plugin.settings.templates_folder = new_folder;
                        this.plugin.saveSettings();
                    });
                // @ts-ignore
                cb.containerEl.addClass("Elements_search");
            });
    }

    add_internal_functions_setting(): void {
        const desc = document.createDocumentFragment();
        desc.append(
            "Elements provides multiples predefined variables / functions that you can use.",
            desc.createEl("br"),
            "Check the ",
            desc.createEl("a", {
                href: "https://silentvoid13.github.io/Elements/",
                text: "documentation",
            }),
            " to get a list of all the available internal variables / functions."
        );

        new Setting(this.containerEl)
            .setName("Internal Variables and Functions")
            .setDesc(desc);
    }

    add_syntax_highlighting_settings(): void {
        const desktopDesc = document.createDocumentFragment();
        desktopDesc.append(
            "Adds syntax highlighting for Elements commands in edit mode."
        );

        const mobileDesc = document.createDocumentFragment();
        mobileDesc.append(
            "Adds syntax highlighting for Elements commands in edit mode on " +
            "mobile. Use with caution: this may break live preview on mobile " +
            "platforms."
        );

        new Setting(this.containerEl)
            .setName("Syntax Highlighting on Desktop")
            .setDesc(desktopDesc)
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.syntax_highlighting)
                    .onChange((syntax_highlighting) => {
                        this.plugin.settings.syntax_highlighting =
                            syntax_highlighting;
                        this.plugin.saveSettings();
                        //this.plugin.event_handler.update_syntax_highlighting();
                    });
            });

        new Setting(this.containerEl)
            .setName("Syntax Highlighting on Mobile")
            .setDesc(mobileDesc)
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.syntax_highlighting_mobile)
                    .onChange((syntax_highlighting_mobile) => {
                        this.plugin.settings.syntax_highlighting_mobile =
                            syntax_highlighting_mobile;
                        this.plugin.saveSettings();
                        //this.plugin.event_handler.update_syntax_highlighting();
                    });
            });
    }

    add_auto_jump_to_cursor(): void {
        const desc = document.createDocumentFragment();
        desc.append(
            "Automatically triggers ",
            desc.createEl("code", { text: "tp.file.cursor" }),
            " after inserting a template.",
            desc.createEl("br"),
            "You can also set a hotkey to manually trigger ",
            desc.createEl("code", { text: "tp.file.cursor" }),
            "."
        );

        new Setting(this.containerEl)
            .setName("Automatic jump to cursor")
            .setDesc(desc)
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.auto_jump_to_cursor)
                    .onChange((auto_jump_to_cursor) => {
                        this.plugin.settings.auto_jump_to_cursor =
                            auto_jump_to_cursor;
                        this.plugin.saveSettings();
                    });
            });
    }

    add_trigger_on_new_file_creation_setting(): void {
        const desc = document.createDocumentFragment();
        desc.append(
            "Elements will listen for the new file creation event, and replace every command it finds in the new file's content.",
            desc.createEl("br"),
            "This makes Elements compatible with other plugins like the Daily note core plugin, Calendar plugin, Review plugin, Note refactor plugin, ...",
            desc.createEl("br"),
            desc.createEl("b", {
                text: "Warning: ",
            }),
            "This can be dangerous if you create new files with unknown / unsafe content on creation. Make sure that every new file's content is safe on creation."
        );

        new Setting(this.containerEl)
            .setName("Trigger Elements on new file creation")
            .setDesc(desc)
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.trigger_on_file_creation)
                    .onChange((trigger_on_file_creation) => {
                        this.plugin.settings.trigger_on_file_creation =
                            trigger_on_file_creation;
                        this.plugin.saveSettings();
                        // this.plugin.event_handler.update_trigger_file_on_creation();
                        // Force refresh
                        this.display();
                    });
            });
    }

    add_ribbon_icon_setting(): void {
        const desc = document.createDocumentFragment();
        desc.append(
            "Show Elements icon in sidebar ribbon, allowing you to quickly use templates anywhere."
        );

        new Setting(this.containerEl)
            .setName("Show icon in sidebar")
            .setDesc(desc)
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.enable_ribbon_icon)
                    .onChange((enable_ribbon_icon) => {
                        this.plugin.settings.enable_ribbon_icon =
                            enable_ribbon_icon;
                        this.plugin.saveSettings();
                        if (this.plugin.settings.enable_ribbon_icon) {
                            this.plugin
                                .addRibbonIcon(
                                    "Elements-icon",
                                    "Elements",
                                    async () => {
                                        // this.plugin.fuzzy_suggester.insert_template();
                                    }
                                )
                                .setAttribute("id", "rb-Elements-icon");
                        } else {
                            document
                                .getElementById("rb-Elements-icon")
                                ?.remove();
                        }
                    });
            });
    }
}
