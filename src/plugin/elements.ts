import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { type IControlServices } from './ControlService'
import { type Logger } from '../lib/logger/Logger'
import TYPES from './types'

export interface IElements {
    controlServices: IControlServices;
    onLoad(): Promise<void>; 
}

@injectable()
export class Elements implements IElements {
    controlServices: IControlServices;
    private _logger: Logger;
    
    constructor(
        @inject(TYPES.Logger) logger: Logger
    ) {
        this._logger = logger
    }

    async onLoad(): Promise<void> {
        //log('info', 'Got here!')
        this._logger.log('info', 'Got here!')
    }
}