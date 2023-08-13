import { type LogLevel } from './LogLevel'

export interface Logger {
    /**
     * Returns the current log level of the dedfault log transport. All levels above this level are being logged.
     */
    level: LogLevel

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
    addFileTransport( filename: string, level: LogLevel ): boolean

    /**
     * Removes a previously added file transport to the logger. 
     * @param filename Path and filename of the log file previously added.
     * @returns True if the file transport was removed, false if it was not found.
     */
    removeFileTransport( filename: string ): boolean

    /**
     * Safely logs a message at the provided @type{LogLevel} to all active log transports. Note that, by design, exactly one
     * console is transport is always active. Each transport has it's own log level filter.
     * @param level Level of this message. If the @type(logLevel) is below the level of the transport, the message will not be logged.
     * @param message Message to be sent to all active log transports.
     */
    log( level: LogLevel, message: string ): void

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError( callback: (error: Error) => void ): void
}