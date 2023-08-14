import 'reflect-metadata'
import { type Logger } from './Logger'
import { type LogLevel } from './LogLevel'

const _loggers = new Array<Logger>()

function log(level: LogLevel, message: string) {
    if(_loggers.length == 0) { console.log(message) }
    _loggers.map(logger => logger.log(level, message))
}

function addLogger(logger: Logger) {
    if(!_loggers.contains(logger)) {
        _loggers.push(logger)
    }
}

function removeLogger(logger: Logger) {
    _loggers.remove(logger)
}
