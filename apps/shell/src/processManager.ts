import { spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import os from 'os';
import { app } from 'electron';
import AutoLaunch from 'electron-auto-launch';
import { logger } from '../../../packages/shared';

type ProcessInfo = {
  pid: number | undefined | null;
  script: string;
  detached: boolean;
  shouldRestart: boolean;
};

const processes: Record<string, ProcessInfo> = {};
const storePath = path.join(app.getPath('userData'), 'processes.json');

/**
 * Resolve path to daemon script (dev vs packaged)
 */
function resolveDaemonScript(scriptName: string): string {
  const isPackaged = app.isPackaged;
  const platform = os.platform();

  const basePath = isPackaged
    ? path.join(process.resourcesPath, 'daemon', 'bin')
    : path.join(__dirname, '..', '..', 'daemon');

  const fileName = isPackaged ? platform === 'win32'
      ? `${scriptName}.exe`
      : `${scriptName}-mac` : path.join(scriptName, 'dist', 'index.js');
  const fullScripthPath = path.join(basePath, fileName);
  console.log('fullScripthPath: ', fullScripthPath);
  return fullScripthPath;
}

/**
 * Save processes.json
 */
function persistProcesses() {
  writeFileSync(storePath, JSON.stringify(processes, null, 2));
}

/**
 * Load and relaunch saved processes (used in dev/debug)
 */
function loadProcesses() {
  if (!existsSync(storePath)) return;

  const raw = readFileSync(storePath, 'utf8');
  const saved = JSON.parse(raw);

  for (const [name, proc] of Object.entries(saved)) {
    const p = proc as ProcessInfo;

    processes[name] = p;

    if (p.shouldRestart) {
      console.log(`[ProcessManager] Process "${name}" marked for auto-restart.`);
      logger.info(`[ProcessManager] Process "${name}" marked for auto-restart.`);
    }
  }
}

/**
 * Register a process to start on system boot
 */
function setupAutoLaunch(name: string, scriptFile: string) {
  const execPath = process.execPath;

  const autoLauncher = new AutoLaunch({
    name: `Daemon-${name}`,
    path: execPath,
    isHidden: true,
  });

  autoLauncher.enable().catch((e) => {
    console.error(`[ProcessManager] AutoLaunch error for "${name}":`, e);
    logger.error(`[ProcessManager] AutoLaunch error for "${name}":`, null, e);
  });
}

/**
 * Remove a startup entry for a process
 */
function removeAutoLaunch(name: string) {
  const autoLauncher = new AutoLaunch({ name: `Daemon-${name}` });
  autoLauncher.disable().catch((e) => {
    console.error(`[ProcessManager] Failed to remove AutoLaunch for "${name}":`, e);
    logger.error(`[ProcessManager] Failed to remove AutoLaunch for "${name}":`, e);
  });
}

/**
 * Start and optionally register a background process
 */
function startProcess(
  name: string,
  scriptFile: string,
  detached: boolean = true,
  skipSave: boolean = false
): number | null | undefined {
  const scriptPath = resolveDaemonScript(scriptFile);

  if (!existsSync(scriptPath)) {
    logger.error(`[ProcessManager] Script not found: ${scriptPath}`);
    throw new Error(`[ProcessManager] Script not found: ${scriptPath}`);
  }

  const isPackaged = app.isPackaged;
  const command = isPackaged ? scriptPath : process.execPath;
  const args = isPackaged ? [] : [scriptPath];

  console.log(`[ProcessManager] Executing: ${[command, ...args].join(' ')}`);
  logger.info(`[ProcessManager] Executing: ${[command, ...args].join(' ')}`);

  const proc = spawn(command, args, {
    detached,
    stdio: detached ? 'ignore' : 'inherit',
  });

  if (detached) proc.unref();

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

  logger.info(`[ProcessManager] Started "${name}" (PID: ${proc.pid})`);
  console.log(`[ProcessManager] Started "${name}" (PID: ${proc.pid})`);
  return proc.pid;
}

/**
 * Kill a process and remove its restart configuration
 */
function stopProcess(name: string): boolean {
  const proc = processes[name];
  if (!proc) return false;
  if (checkStatus(name) === 'not-running') {
    return false;
  }

  try {
    process.kill(proc.pid ?? 0, 'SIGTERM');
    setTimeout(() => {
      try {
        process.kill(proc.pid ?? 0, 'SIGKILL');
        console.warn(`[ProcessManager] Force killed "${name}"`);
      } catch {
        // already exited
      }
    }, 5000);

    delete processes[name];
    persistProcesses();
    //removeAutoLaunch(name);

    console.log(`[ProcessManager] Stopped "${name}"`);
    logger.info(`[ProcessManager] Stopped "${name}"`);

    return true;
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? { message: err.message, stack: err.stack } : { error: String(err) };
    logger.error(`[ProcessManager] Failed to stop "${name}":`, null, errorObj);
    throw new Error(`[ProcessManager] Failed to stop "${name}":  ${err}`);
  }
}

/**
 * Check the current status of a managed process
 */
function checkStatus(name: string): 'running' | 'not-running' | 'not-found' {
  const proc = processes[name];
  if (!proc) return 'not-found';

  try {
    process.kill(proc.pid ?? 0, 0);
    return 'running';
  } catch {
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

export const ProcessManager = {
  start: startProcess,
  stop: stopProcess,
  status: checkStatus,
  list: listProcesses,
};
