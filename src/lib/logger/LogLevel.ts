// Levels above which a log will log messages. 
/**
 * @type{loggerLevel} is a string type that represents a message level. It can also be used to set
 * the level of a log transport, which filters messages sent to the transport below this level.
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'