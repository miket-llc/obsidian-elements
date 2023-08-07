import { createLogger, format, transports } from 'winston'
import { IResult, ok, fail, maybe} from 'typescript-monads'

export type logLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'

export function log( level: logLevel, message: string ) {
    Logger.log(level, message)
}

export default class Logger {
    private static _logLevel: logLevel = 'info'
    private static _consoleTranport = new transports.Console();
    private static _fileTransportMap = new Map<string, transports.FileTransportInstance>()
    private static _logger = createLogger({
        level: this._logLevel,
        transports: [Logger._consoleTranport],
        format: format.combine(
            format.colorize({level: true}),
            format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            format.printf(info => `${info.level}: ${info.message}`),
        )
    })

    static get consoleLevel(): logLevel { return Logger._consoleTranport.level as logLevel }
    static set consoleLevel(level: logLevel) { Logger._consoleTranport.level = level }

    static addFileTransport( filename: string, level: logLevel ): IResult<boolean, Error> {
        try {
            if(!Logger._fileTransportMap.has(filename)) {
                const fileTransport = new transports.File({ filename, level })
                Logger._fileTransportMap.set(filename, fileTransport)
                Logger._logger.add(fileTransport)
                return ok(true)
            } else {
                return fail(new Error(`File transport already exists for ${filename}`))
            }
        } catch(e) {
            return fail(new Error(`Error adding file transport for ${filename}: ${maybe(e.message).valueOr('unknown error')}`))
        }
    }

    static removeFileTransport( filename: string ): IResult<boolean, Error> {
        try {
            if(Logger._fileTransportMap.has(filename)) {
                const fileTransport = Logger._fileTransportMap.get(filename)
                Logger._fileTransportMap.delete(filename)
                Logger._logger.remove(fileTransport)
                return ok(true)
            } else {
                return fail(new Error(`File transport does not exist for ${filename}`))
            }
        } catch(e) {
            return fail(new Error(`Error removing file transport for ${filename}: ${maybe(e.message).valueOr('unknown error')}`))
        }
    }
    
    static log( level: logLevel, message: string ) {
       Logger._logger.log(level, message)
    }
}