import { createLogger, format, transports } from 'winston'
import { IResult, ok, fail, maybe} from 'typescript-monads'

export type logLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'

export function log( level: logLevel, message: string ) {
    Logger.log(level, message)
}

/**
 * Simple, powerful logging. Abstracts away the underlying logging framework
 * for maximum ease of use and future-proofing. 
 * @warn This is a singleton class. Do not instantiate it.
 */
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

    /**
     * Gets the current log level of the console transport.
     */
    static get consoleLevel(): logLevel { return Logger._consoleTranport.level as logLevel }
    /**
     * Sets the current log level of the console transport.
     */
    static set consoleLevel(level: logLevel) { Logger._consoleTranport.level = level }

    /**
     * Adds a new file transport to the logger. You are responsible for ensuring that the path and filename are valid.
     * @param filename Path and filename of the log file to add.
     * @param level @link{logLevel} filter for this file. All levels above this level will be logged.
     */
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

    /**
     * Removes a previously added file transport to the logger. 
     * @param filename Path and filename of the log file previously added.
     * @returns true if the file transport was removed, an Error object if it did not exist or the removal failed for some other reason.
     */
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
    
    /**
     * Safely loges a message at the provided @type{logLevel} to all active log transports. Note that, by design, exactly one
     * console is transport is always active. Each transport has it's own log level filter.
     * @param level Level of this message. If the @type(logLevel) is below the level of the transport, the message will not be logged.
     * @param message Message to add to each log transport.
     */
    static log( level: logLevel, message: string ) {
       Logger._logger.log(level, message)
    }
}