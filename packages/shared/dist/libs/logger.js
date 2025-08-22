"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const { combine, timestamp, errors, printf } = winston_1.format;
const baseLogDir = path_1.default.join(os_1.default.homedir(), '.TiktokReplyBot', 'logs');
// Ensure directory exists
function ensureDir(dirPath) {
    if (!fs_1.default.existsSync(dirPath))
        fs_1.default.mkdirSync(dirPath, { recursive: true });
}
ensureDir(baseLogDir);
// Format for all logs
const logFormat = printf(({ timestamp, level, message, module, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level.toUpperCase()}]${module ? ` [${module}]` : ''}: ${stack || message}${metaStr}`;
});
// Create a logger for a file
function createFileLogger(filePath, level) {
    return (0, winston_1.createLogger)({
        level,
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
        transports: [
            new winston_1.transports.File({
                filename: filePath,
                level,
                maxsize: 5 * 1024 * 1024,
                maxFiles: 5,
            })
        ],
    });
}
// General loggers
const generalInfoLogger = createFileLogger(path_1.default.join(baseLogDir, 'app.log'), 'info');
const generalErrorLogger = createFileLogger(path_1.default.join(baseLogDir, 'error.log'), 'error');
// Module loggers cache
const moduleLoggers = {};
// Check if a module name refers to general/system logging
function isGeneralModule(module) {
    return !module || module === '' || module.toLowerCase() === 'system';
}
// Get or create per-module logger
function getModuleLogger(moduleName) {
    if (moduleLoggers[moduleName])
        return moduleLoggers[moduleName];
    const moduleDir = path_1.default.join(baseLogDir, moduleName);
    ensureDir(moduleDir);
    const infoLogger = createFileLogger(path_1.default.join(moduleDir, 'activity.log'), 'info');
    const errorLogger = createFileLogger(path_1.default.join(moduleDir, 'error.log'), 'error');
    moduleLoggers[moduleName] = { info: infoLogger, error: errorLogger };
    return moduleLoggers[moduleName];
}
// Final logger interface
const logger = {
    info(message, module, context = {}) {
        if (isGeneralModule(module)) {
            generalInfoLogger.info({ message, ...context });
        }
        else if (typeof module === 'string') {
            const { info } = getModuleLogger(module);
            info.info({ message, module, ...context });
        }
    },
    error(message, module, context = {}) {
        if (isGeneralModule(module)) {
            generalInfoLogger.error({ message, ...context });
        }
        else if (typeof module === 'string') {
            const { error } = getModuleLogger(module);
            error.error({ message, module, ...context });
        }
    }
};
exports.logger = logger;
