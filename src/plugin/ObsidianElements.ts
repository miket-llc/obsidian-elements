import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import TYPES from '../types'
import { type Logger, log } from '../lib/logger'
import { type Elements } from '../elements/core/'
import { Plugin } from 'obsidian'
import { Result, ok, resultToPromise, } from 'typescript-monads'

@injectable()
export class ObsidianElements implements Elements {
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

        log('debug', `...obsidian-elements initializaton complete. (${Date.now().valueOf() - start}ms)`)
        return resultToPromise(ok(undefined));
    }
}