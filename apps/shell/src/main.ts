import { app, BrowserWindow, Menu, MenuItemConstructorOptions, shell } from 'electron';
import path from 'node:path';
import * as fs from 'fs';
import * as os from 'os';
import { spawn } from 'child_process';
import { registerIpcHandlers } from './ipcHandlers';
import { runMigrations } from '../../../packages/core';
import { logger } from '../../../packages/shared';

//
// 🪝 Custom Squirrel.Windows Event Handler
//
const handleSquirrelEvent = (): boolean => {
  if (process.platform !== 'win32') return false;
  if (process.argv.length === 1) return false;

  const squirrelEvent = process.argv[1];
  const updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  const exeName = path.basename(process.execPath);

  const spawnUpdate = (args: string[]) => {
    try {
      spawn(updateExe, args, { detached: true });
    } catch (e) {
      console.error('Squirrel spawn error:', e);
    }
  };

  switch (squirrelEvent) {
    case '--squirrel-uninstall':
      try {
        const dataDir = path.join(os.homedir(), '.TiktokReplyBot');
        if (fs.existsSync(dataDir)) {
          fs.rmSync(dataDir, { recursive: true, force: true });
          console.log('Deleted:', dataDir);
        } else {
          console.log('No cleanup needed, directory does not exist:', dataDir);
        }
      } catch (err) {
        console.error('Error cleaning up ~/.TiktokReplyBot:', err);
      }

      // Remove shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(() => {
        app.quit();
      }, 1000);
      return true;

    case '--squirrel-install':

    case '--squirrel-updated':
      spawnUpdate(['--createShortcut', exeName]);
      setTimeout(() => {
        app.quit();
      }, 1000);
      return true;

    case '--squirrel-obsolete':
      app.quit();
      return true;
  }

  return false;
};

if (handleSquirrelEvent()) {
  // Exit early during install/uninstall events
  process.exit(0);
}

// Main app logic
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'FacebookCommentBot',
    webPreferences: {
      preload: path.join(__dirname, 'preload/index.js'),
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();
  mainWindow.loadFile(path.join(__dirname, '../../gui/src/index.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('TiktokReplyBot');
  });

   //mainWindow.webContents.openDevTools(); // Uncomment if needed
   // Handle target="_blank" or window.open()
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" }; // allow internal pages
  });

  // Intercept any navigation attempts (e.g., clicking normal <a> links)
  mainWindow.webContents.on("will-navigate", (event, url) => {
    const appUrl = mainWindow.webContents.getURL();

    if (url !== appUrl && (url.startsWith("http://") || url.startsWith("https://"))) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
};

app.on('ready', () => {
  const migratedFlag = path.join(os.homedir(), '.TiktokReplyBot/.migrated');

  if (!fs.existsSync(migratedFlag)) {
    runMigrations()
      .then(() => {
        logger.info('Migration successful');
        fs.writeFileSync(migratedFlag, 'migrated');
      })
      .catch((err) => {
        logger.error('Migration error: ', null, err);
        console.error('Migration error:', err);
      });
  }

  registerIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
