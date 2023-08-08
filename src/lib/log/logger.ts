import { createLogger, format, transports } from 'winston'

export type loggerLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'

export function log( level: loggerLevel, message: string ) {
    Logger.log(level, message)
}

/**
 * Simple, powerful logging. Abstracts away the underlying logging framework
 * for maximum ease of use and future-proofing. 
 * @warn This is a singleton class. Do not instantiate it.
 */
export default class Logger {
    private static _logLevel: loggerLevel = 'info'
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
    static get consoleLevel(): loggerLevel { return Logger._consoleTranport.level as loggerLevel }
    /**
     * Sets the current log level of the console transport.
     */
    static set consoleLevel(level: loggerLevel) { Logger._consoleTranport.level = level }

    /**
     * Adds a new file transport to the logger. You are responsible for ensuring that the path and filename are valid.
     * @param filename Path and filename of the log file to add.
     * @param level @link{logLevel} filter for this file. All levels above this level will be logged.
     * @warn If a file transport with the same filename has already been added, this method will do nothing.
     * @warn By design, this api will not throw errors for file errors. We highly recommend registering a
     * callback witn the link @link(onError) method to handle file errors.
     */
    static addFileLog( filename: string, level: loggerLevel ): boolean {
        if(!Logger._fileTransportMap.has(filename)) {
            const fileTransport = new transports.File({ filename, level })
            Logger._fileTransportMap.set(filename, fileTransport)
            Logger._logger.add(fileTransport)
            return true
        } else { return false }
    }

    /**
     * Removes a previously added file transport to the logger. 
     * @param filename Path and filename of the log file previously added.
     * @returns True if the file transport was removed, false if it was not found.
     */
    static removeFileLog( filename: string ): boolean {
        return Logger._logger.remove(Logger._fileTransportMap.get(filename)) !== undefined
    }   
    /**
     * Safely loges a message at the provided @type{loggerLevel} to all active log transports. Note that, by design, exactly one
     * console is transport is always active. Each transport has it's own log level filter.
     * @param level Level of this message. If the @type(logLevel) is below the level of the transport, the message will not be logged.
     * @param message Message to add to each log transport.
     */
    static log( level: loggerLevel, message: string ) {
       Logger._logger.log(level, message)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static onError( callback: (error: Error) => void ) {
        Logger._logger.on('error', callback)
    }
}