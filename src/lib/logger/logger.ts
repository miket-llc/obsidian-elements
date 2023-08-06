import { Logger as Winston, createLogger, format, transports } from 'winston'
import { errorWrapperSync } from '../../utils/Error';

export type logLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'

export function log( level: logLevel, message: string ) {
    Logger.log(level, message)
}

export default class Logger {
    private static _logger = createLogger({
            level: 'info',
            transports: [new transports.Console()],
            format: format.combine(
                format.colorize({level: true}),
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.printf(info => `${info.level}: ${info.message}`),
            )
       })

    static log( level: logLevel, message: string ) {
       Logger._logger.log(level, message)
    }
}
        