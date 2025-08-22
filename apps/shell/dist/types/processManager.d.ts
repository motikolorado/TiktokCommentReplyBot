/**
 * Start and optionally register a background process
 */
declare function startProcess(name: string, scriptFile: string, detached?: boolean, skipSave?: boolean): number | null | undefined;
/**
 * Kill a process and remove its restart configuration
 */
declare function stopProcess(name: string): boolean;
/**
 * Check the current status of a managed process
 */
declare function checkStatus(name: string): 'running' | 'not-running' | 'not-found';
/**
 * List all managed processes
 */
declare function listProcesses(): {
    name: string;
    pid: number | null | undefined;
    script: string;
    detached: boolean;
    shouldRestart: boolean;
    status: "running" | "not-running" | "not-found";
}[];
export declare const ProcessManager: {
    start: typeof startProcess;
    stop: typeof stopProcess;
    status: typeof checkStatus;
    list: typeof listProcesses;
};
export {};
