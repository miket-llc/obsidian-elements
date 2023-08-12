import { type Command } from 'obsidian';

export type CommandProperties = Pick<Command, 'id' | 'name' | 'hotkeys' | 'icon' | 'mobileOnly' | 'repeatable'>;
