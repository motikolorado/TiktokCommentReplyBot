declare const logger: {
    info(message: string, module?: string | null, context?: Record<string, any>): void;
    error(message: string, module?: string | null, context?: Record<string, any>): void;
};
export { logger };
