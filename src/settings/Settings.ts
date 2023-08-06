
// import { errorWrapperSync, ElementsError } from "../utils/Error";
//import { FileSuggest, FileSuggestMode } from "./suggesters/FileSuggester";
// import { arraymove, get_tfiles_from_folder } from "../utils/Utils";
//import { log_error } from "../utils/Log";
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
    default_concept_folder: "/02 Concepts",
    folders_to_ignore: ["/10 Files"],
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
    default_concept_folder: string;
    folders_to_ignore: Array<string>;
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


