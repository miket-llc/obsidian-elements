import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import container from '../inversify.config'
import TYPES from '../types'
import { type Logger, log } from '../lib/logger'
import { type Elements } from '../elements/core/'
import { Plugin } from 'obsidian'
import { Result, ok, resultToPromise, } from 'typescript-monads'
import { type Settings } from '../elements/settings'

@injectable()
export class ElementsCore implements Elements {
    private _logger: Logger
    private _plugin: Plugin
    
    constructor(
        @inject(TYPES.Logger) logger: Logger,
        @inject(TYPES.Plugin) plugin: Plugin
    ) {
        this._logger = logger
        this._plugin = plugin
    }

    async setup(): Promise<Result<void, Error>> {
        const start = Date.now().valueOf();
        log('debug', `Initializing obsidian-elements...`)
        
        // load settings
        //container.get<Settings>(TYPES.Settings).load()

        // initialize command subsystem

        // initialize the ui


        log('debug', `...obsidian-elements initializaton complete. (${Date.now().valueOf() - start}ms)`)
        return resultToPromise(ok(undefined));
    }
}