import { createLogger, format, transports, Logger } from 'winston';
import fs from 'fs';
import path from 'path';
import os from 'os';

const { combine, timestamp, errors, printf } = format;

const baseLogDir = path.join(os.homedir(), '.TiktokReplyBot', 'logs');

// Ensure directory exists
function ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}
ensureDir(baseLogDir);

// Format for all logs
const logFormat = printf(({ timestamp, level, message, module, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level.toUpperCase()}]${module ? ` [${module}]` : ''}: ${stack || message}${metaStr}`;
});

// Create a logger for a file
function createFileLogger(filePath: string, level: 'info' | 'error'): Logger {
    return createLogger({
        level,
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            logFormat
        ),
        transports: [
            new transports.File({
                filename: filePath,
                level,
                maxsize: 5 * 1024 * 1024,
                maxFiles: 5,
            })
        ],
    });
}

// General loggers
const generalInfoLogger = createFileLogger(path.join(baseLogDir, 'app.log'), 'info');
const generalErrorLogger = createFileLogger(path.join(baseLogDir, 'error.log'), 'error');

// Module loggers cache
const moduleLoggers: Record<string, { info: Logger; error: Logger }> = {};

// Check if a module name refers to general/system logging
function isGeneralModule(module: any): boolean {
    return !module || module === '' || module.toLowerCase() === 'system';
}

// Get or create per-module logger
function getModuleLogger(moduleName: string ): { info: Logger; error: Logger } {
    if (moduleLoggers[moduleName]) return moduleLoggers[moduleName];

    const moduleDir = path.join(baseLogDir, moduleName);
    ensureDir(moduleDir);

    const infoLogger = createFileLogger(path.join(moduleDir, 'activity.log'), 'info');
    const errorLogger = createFileLogger(path.join(moduleDir, 'error.log'), 'error');

    moduleLoggers[moduleName] = { info: infoLogger, error: errorLogger };
    return moduleLoggers[moduleName];
}

// Final logger interface
const logger = {
    info(message: string, module?: string | null, context: Record<string, any> = {}) {
        if (isGeneralModule(module)) {
            generalInfoLogger.info({ message, ...context });
        } else if (typeof module === 'string') {
            const { info } = getModuleLogger(module);
            info.info({ message, module, ...context });
        }
    },

    error(message: string, module?: string | null, context: Record<string, any> = {}) {
        if (isGeneralModule(module)) {
            generalInfoLogger.error({ message, ...context });
        } else if (typeof module === 'string') {
            const { error } = getModuleLogger(module);
            error.error({ message, module, ...context });
        }
    }
};

export { logger };
