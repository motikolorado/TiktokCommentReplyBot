"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const child_process_1 = require("child_process");
const ipcHandlers_1 = require("./ipcHandlers");
const core_1 = require("../../../packages/core");
const shared_1 = require("../../../packages/shared");
//
// 🪝 Custom Squirrel.Windows Event Handler
//
const handleSquirrelEvent = () => {
    if (process.platform !== 'win32')
        return false;
    if (process.argv.length === 1)
        return false;
    const squirrelEvent = process.argv[1];
    const updateExe = node_path_1.default.resolve(node_path_1.default.dirname(process.execPath), '..', 'Update.exe');
    const exeName = node_path_1.default.basename(process.execPath);
    const spawnUpdate = (args) => {
        try {
            (0, child_process_1.spawn)(updateExe, args, { detached: true });
        }
        catch (e) {
            console.error('Squirrel spawn error:', e);
        }
    };
    switch (squirrelEvent) {
        case '--squirrel-uninstall':
            try {
                const dataDir = node_path_1.default.join(os.homedir(), '.TiktokReplyBot');
                if (fs.existsSync(dataDir)) {
                    fs.rmSync(dataDir, { recursive: true, force: true });
                    console.log('Deleted:', dataDir);
                }
                else {
                    console.log('No cleanup needed, directory does not exist:', dataDir);
                }
            }
            catch (err) {
                console.error('Error cleaning up ~/.TiktokReplyBot:', err);
            }
            // Remove shortcuts
            spawnUpdate(['--removeShortcut', exeName]);
            setTimeout(() => {
                electron_1.app.quit();
            }, 1000);
            return true;
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(() => {
                electron_1.app.quit();
            }, 1000);
            return true;
        case '--squirrel-obsolete':
            electron_1.app.quit();
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
    const mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        title: 'FacebookCommentBot',
        webPreferences: {
            preload: node_path_1.default.join(__dirname, 'preload/index.js'),
        },
    });
    //mainWindow.setMenuBarVisibility(false);
    //mainWindow.removeMenu();
    mainWindow.loadFile(node_path_1.default.join(__dirname, '../../gui/src/index.html'));
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setTitle('TiktokReplyBot');
    });
    mainWindow.webContents.openDevTools(); // Uncomment if needed
    // Handle target="_blank" or window.open()
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            electron_1.shell.openExternal(url);
            return { action: "deny" };
        }
        return { action: "allow" }; // allow internal pages
    });
    // Intercept any navigation attempts (e.g., clicking normal <a> links)
    mainWindow.webContents.on("will-navigate", (event, url) => {
        const appUrl = mainWindow.webContents.getURL();
        if (url !== appUrl && (url.startsWith("http://") || url.startsWith("https://"))) {
            event.preventDefault();
            electron_1.shell.openExternal(url);
        }
    });
};
electron_1.app.on('ready', () => {
    const migratedFlag = node_path_1.default.join(os.homedir(), '.TiktokReplyBot/.migrated');
    if (!fs.existsSync(migratedFlag)) {
        (0, core_1.runMigrations)()
            .then(() => {
            shared_1.logger.info('Migration successful');
            fs.writeFileSync(migratedFlag, 'migrated');
        })
            .catch((err) => {
            shared_1.logger.error('Migration error: ', null, err);
            console.error('Migration error:', err);
        });
    }
    (0, ipcHandlers_1.registerIpcHandlers)();
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
