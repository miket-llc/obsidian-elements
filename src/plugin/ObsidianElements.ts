import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import TYPES from '../types'
import { type Logger } from '../lib/logger/Logger'
import { type Elements } from '../elements/core/'

@injectable()
export class ObsidianElements implements Elements {
    private _logger: Logger;
    
    constructor(
        @inject(TYPES.Logger) logger: Logger
    ) {
        this._logger = logger
    }

    public  onload(): void {
   
    }
}