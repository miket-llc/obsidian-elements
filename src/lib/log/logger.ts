import { createLogger, format, transports } from 'winston'

// Levels above which a log will log messages. 
export type loggerLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'

const _consoleTranport = new transports.Console();
const _fileTransportMap = new Map<string, transports.FileTransportInstance>()
const _logger = createLogger({
    level: 'info',
    transports: [_consoleTranport],
    format: format.combine(
        format.colorize({level: true}),
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.printf(info => `${info.level}: ${info.message}`),
    )
})

/**
 * Returns the current log level of the default console log. All levels above this level are being logged.
 */
export function getConsoleLevel(): loggerLevel { return _consoleTranport.level as loggerLevel }

/**
 * Sets the log level of the default console log. All levels above this level are being logged.
 * @param level @link{logLevel} to which to set the default console log.
 */
export function setConsoleLevel(level: loggerLevel) { _consoleTranport.level = level }

/**
 * Adds a new file transport to the logger and sets its @link(logLevel). 
 * You are responsible for ensuring that the path and filename are valid. Errors are not thrown, but
 * are reported via callbacks registered with the @link(onError) method.
 * @param filename Path and filename of the log file to add.
 * @param level @link{logLevel} filter for this file. All levels above this level will be logged.
 * @warn If a file transport with the same filename has already been added, this method will do nothing.
 * @warn By design, this api will not throw errors for file errors. We highly recommend registering a
 * callback witn the link @link(onError) method to handle file errors.
 */
export function addFileTransport( filename: string, level: loggerLevel ): boolean {
    if(!_fileTransportMap.has(filename)) {
        const fileTransport = new transports.File({ filename, level })
        _fileTransportMap.set(filename, fileTransport)
        _logger.add(fileTransport)
        return true
    } else { return false }
}

/**
 * Removes a previously added file transport to the logger. 
 * @param filename Path and filename of the log file previously added.
 * @returns True if the file transport was removed, false if it was not found.
 */
export function removeFileTransport( filename: string ): boolean {
    return _logger.remove(_fileTransportMap.get(filename)) !== undefined
}

/**
 * Safely logs a message at the provided @type{loggerLevel} to all active log transports. Note that, by design, exactly one
 * console is transport is always active. Each transport has it's own log level filter.
 * @param level Level of this message. If the @type(logLevel) is below the level of the transport, the message will not be logged.
 * @param message Message to be sent to all active log transports.
 */
export function log( level: loggerLevel, message: string ) {
    _logger.log(level, message)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onError( callback: (error: Error) => void ) {
    _logger.on('error', callback)
}