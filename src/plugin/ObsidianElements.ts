import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import TYPES from '../types'
import { type Logger } from '../lib/logger/Logger'
import { type Elements } from '../elements/core/'
import { Plugin } from 'obsidian'

@injectable()
export class ObsidianElements implements Elements {
    private _logger: Logger
    //private _plugin: Plugin
    
    constructor(
        @inject(TYPES.Logger) logger: Logger,
    ) {
        this._logger = logger
        //this._plugin = plugin
    }

    public  onload(): void {
    }
}