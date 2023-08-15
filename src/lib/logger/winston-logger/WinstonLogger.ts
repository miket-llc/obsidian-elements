import { createLogger, format, transports } from 'winston'
import { type LogLevel } from '../LogLevel'
import { type Logger } from '../Logger';
import { injectable } from 'inversify';

@injectable()
export class WinstonLogger implements Logger {

    private _consoleTranport = new transports.Console();
    private _fileTransportMap = new Map<string, transports.FileTransportInstance>()
    private _logger = createLogger({
        level: 'info',
        transports: [this._consoleTranport],
        format: format.combine(
            format.colorize({level: true}),
            format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            format.printf(info => `${info.level}: ${info.message}`),
        )
    })

    /**
     * Returns the current log level of the default console log. All levels above this level are being logged.
     */
    get level(): LogLevel { return this._consoleTranport.level as LogLevel }

    /**
     * Sets the log level of the default console log. All levels above this level are being logged.
     * @param level @link{logLevel} to which to set the default console log.
     */
    set level(level: LogLevel) { this._consoleTranport.level = level }

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
    addFileTransport( filename: string, level: LogLevel ): boolean {
        if(!this._fileTransportMap.has(filename)) {
            const fileTransport = new transports.File({ filename, level })
            this._fileTransportMap.set(filename, fileTransport)
            this._logger.add(fileTransport)
            return true
        } else { return false }
    }

    /**
     * Removes a previously added file transport to the logger. 
     * @param filename Path and filename of the log file previously added.
     * @returns True if the file transport was removed, false if it was not found.
     */
    removeFileTransport( filename: string ): boolean {
        return this._logger.remove(this._fileTransportMap.get(filename)) !== undefined
    }

    /**
     * Safely logs a message at the provided @type{LogLevel} to all active log transports. Note that, by design, exactly one
     * console is transport is always active. Each transport has it's own log level filter.
     * @param level Level of this message. If the @type(logLevel) is below the level of the transport, the message will not be logged.
     * @param message Message to be sent to all active log transports.
     */
    log( level: LogLevel, message: string ) {
        this._logger.log(level, message)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError( callback: (error: Error) => void ) {
        this._logger.on('error', callback)
    }
}