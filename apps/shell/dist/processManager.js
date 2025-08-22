"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessManager = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const electron_1 = require("electron");
const electron_auto_launch_1 = __importDefault(require("electron-auto-launch"));
const shared_1 = require("../../../packages/shared");
const processes = {};
const storePath = path_1.default.join(electron_1.app.getPath('userData'), 'processes.json');
/**
 * Resolve path to daemon script (dev vs packaged)
 */
function resolveDaemonScript(scriptName) {
    const isPackaged = electron_1.app.isPackaged;
    const platform = os_1.default.platform();
    const basePath = isPackaged
        ? path_1.default.join(process.resourcesPath, 'daemon', 'bin')
        : path_1.default.join(__dirname, '..', '..', 'daemon');
    const fileName = isPackaged ? platform === 'win32'
        ? `${scriptName}.exe`
        : `${scriptName}-mac` : path_1.default.join(scriptName, 'dist', 'index.js');
    const fullScripthPath = path_1.default.join(basePath, fileName);
    console.log('fullScripthPath: ', fullScripthPath);
    return fullScripthPath;
}
/**
 * Save processes.json
 */
function persistProcesses() {
    (0, fs_1.writeFileSync)(storePath, JSON.stringify(processes, null, 2));
}
/**
 * Load and relaunch saved processes (used in dev/debug)
 */
function loadProcesses() {
    if (!(0, fs_1.existsSync)(storePath))
        return;
    const raw = (0, fs_1.readFileSync)(storePath, 'utf8');
    const saved = JSON.parse(raw);
    for (const [name, proc] of Object.entries(saved)) {
        const p = proc;
        processes[name] = p;
        if (p.shouldRestart) {
            console.log(`[ProcessManager] Process "${name}" marked for auto-restart.`);
            shared_1.logger.info(`[ProcessManager] Process "${name}" marked for auto-restart.`);
        }
    }
}
/**
 * Register a process to start on system boot
 */
function setupAutoLaunch(name, scriptFile) {
    const execPath = process.execPath;
    const autoLauncher = new electron_auto_launch_1.default({
        name: `Daemon-${name}`,
        path: execPath,
        isHidden: true,
    });
    autoLauncher.enable().catch((e) => {
        console.error(`[ProcessManager] AutoLaunch error for "${name}":`, e);
        shared_1.logger.error(`[ProcessManager] AutoLaunch error for "${name}":`, null, e);
    });
}
/**
 * Remove a startup entry for a process
 */
function removeAutoLaunch(name) {
    const autoLauncher = new electron_auto_launch_1.default({ name: `Daemon-${name}` });
    autoLauncher.disable().catch((e) => {
        console.error(`[ProcessManager] Failed to remove AutoLaunch for "${name}":`, e);
        shared_1.logger.error(`[ProcessManager] Failed to remove AutoLaunch for "${name}":`, e);
    });
}
/**
 * Start and optionally register a background process
 */
function startProcess(name, scriptFile, detached = true, skipSave = false) {
    const scriptPath = resolveDaemonScript(scriptFile);
    if (!(0, fs_1.existsSync)(scriptPath)) {
        shared_1.logger.error(`[ProcessManager] Script not found: ${scriptPath}`);
        throw new Error(`[ProcessManager] Script not found: ${scriptPath}`);
    }
    const isPackaged = electron_1.app.isPackaged;
    const command = isPackaged ? scriptPath : process.execPath;
    const args = isPackaged ? [] : [scriptPath];
    console.log(`[ProcessManager] Executing: ${[command, ...args].join(' ')}`);
    shared_1.logger.info(`[ProcessManager] Executing: ${[command, ...args].join(' ')}`);
    const proc = (0, child_process_1.spawn)(command, args, {
        detached,
        stdio: detached ? 'ignore' : 'inherit',
    });
    if (detached)
        proc.unref();
    processes[name] = {
        pid: proc.pid,
        script: scriptFile,
        detached,
        shouldRestart: true,
    };
    if (!skipSave) {
        persistProcesses();
        //if (detached) setupAutoLaunch(name, scriptFile);
    }
    shared_1.logger.info(`[ProcessManager] Started "${name}" (PID: ${proc.pid})`);
    console.log(`[ProcessManager] Started "${name}" (PID: ${proc.pid})`);
    return proc.pid;
}
/**
 * Kill a process and remove its restart configuration
 */
function stopProcess(name) {
    const proc = processes[name];
    if (!proc)
        return false;
    if (checkStatus(name) === 'not-running') {
        return false;
    }
    try {
        process.kill(proc.pid ?? 0, 'SIGTERM');
        setTimeout(() => {
            try {
                process.kill(proc.pid ?? 0, 'SIGKILL');
                console.warn(`[ProcessManager] Force killed "${name}"`);
            }
            catch {
                // already exited
            }
        }, 5000);
        delete processes[name];
        persistProcesses();
        //removeAutoLaunch(name);
        console.log(`[ProcessManager] Stopped "${name}"`);
        shared_1.logger.info(`[ProcessManager] Stopped "${name}"`);
        return true;
    }
    catch (err) {
        const errorObj = err instanceof Error ? { message: err.message, stack: err.stack } : { error: String(err) };
        shared_1.logger.error(`[ProcessManager] Failed to stop "${name}":`, null, errorObj);
        throw new Error(`[ProcessManager] Failed to stop "${name}":  ${err}`);
    }
}
/**
 * Check the current status of a managed process
 */
function checkStatus(name) {
    const proc = processes[name];
    if (!proc)
        return 'not-found';
    try {
        process.kill(proc.pid ?? 0, 0);
        return 'running';
    }
    catch {
        return 'not-running';
    }
}
/**
 * List all managed processes
 */
function listProcesses() {
    return Object.entries(processes).map(([name, info]) => ({
        name,
        pid: info.pid,
        script: info.script,
        detached: info.detached,
        shouldRestart: info.shouldRestart,
        status: checkStatus(name),
    }));
}
// Load on startup
loadProcesses();
exports.ProcessManager = {
    start: startProcess,
    stop: stopProcess,
    status: checkStatus,
    list: listProcesses,
};
