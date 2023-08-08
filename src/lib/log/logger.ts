import { createLogger, format, transports } from 'winston'

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

export function getConsoleLevel(): loggerLevel { return _consoleTranport.level as loggerLevel }
export function setConsoleLevel(level: loggerLevel) { _consoleTranport.level = level }

/**
 * Adds a new file transport to the logger. You are responsible for ensuring that the path and filename are valid.
 * @param filename Path and filename of the log file to add.
 * @param level @link{logLevel} filter for this file. All levels above this level will be logged.
 * @warn If a file transport with the same filename has already been added, this method will do nothing.
 * @warn By design, this api will not throw errors for file errors. We highly recommend registering a
 * callback witn the link @link(onError) method to handle file errors.
 */
export function addFileLog( filename: string, level: loggerLevel ): boolean {
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
export function removeFileLog( filename: string ): boolean {
    return _logger.remove(_fileTransportMap.get(filename)) !== undefined
}

/**
 * Safely loges a message at the provided @type{loggerLevel} to all active log transports. Note that, by design, exactly one
 * console is transport is always active. Each transport has it's own log level filter.
 * @param level Level of this message. If the @type(logLevel) is below the level of the transport, the message will not be logged.
 * @param message Message to add to each log transport.
 */
export function log( level: loggerLevel, message: string ) {
    _logger.log(level, message)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onError( callback: (error: Error) => void ) {
    _logger.on('error', callback)
}