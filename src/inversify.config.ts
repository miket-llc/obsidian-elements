import "reflect-metadata"
import { Container } from "inversify"
import TYPES from "./types"
import { WinstonLogger } from './lib/logger/winston-logger/WinstonLogger';
import { ObsidianElements } from './plugin/ObsidianElements';
import { Plugin } from 'obsidian';
import { Either, either } from 'typescript-monads';

const container = new Container()

container.bind(TYPES.Elements).to(ObsidianElements).inSingletonScope()
container.bind(TYPES.Logger).to(WinstonLogger).inSingletonScope()

/**
 * Sets the Plugin singleton we inject into classes that need it. This is necessitated because
 * of Obsidian's unconventional plugin architecture and is the documented Inversify workaround
 * for this scenario. We provide this convenience function to encasulate all Container-savvy
 * logic in the global (or top-level) Inversify Container.
 * @param plugin Reference to the singleton Plugin instance. Needs to be set very early in the
 * lifetime of the the plugin, and remain availble throughout its lifetime.
 * @returns true if the Plugin singleton was set, false otherwise. We recommend panicking if
 * this value can't be set successfully.
 */
export function setPluginSingleton(plugin: Plugin): boolean {
   return ( container.bind(TYPES.Plugin).toConstantValue(plugin) !== undefined || null) 
   ? true : false
}

export default container