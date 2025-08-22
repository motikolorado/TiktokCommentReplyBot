const path = require('path');
const fs = require('fs');
//const bindings = require('bindings');

// Patch sqlite3 to load native module from real filesystem
function getRootBindingPath() {
  const isPkg = typeof process.pkg !== 'undefined';

  if (isPkg) {
    // Running inside a pkg binary → execPath is the binary path
    return path.dirname(process.execPath);
  }

  // For Electron (main process)
  if (isElectronMain()) {
    const electron = require('electron');
    const app = electron.app || electron.remote?.app;
    if (app) {
      if (app.isPackaged) {
        return path.join(path.dirname(process.execPath), 'resources');
      } else {
        return path.join(app.getAppPath());
      }
    }
  }

  // Regular Node.js (not Electron, not pkg)
  return path.resolve(__dirname, '..', '..', '..' , '..'); // fallback
}

function isElectronMain() {
  return !!(process.versions.electron && process.type !== 'renderer');
}
const nativeBindingPath = path.join(
  getRootBindingPath(),
  'includes',
  'node_modules/sqlite3/build/Release',
  'node_sqlite3.node'
);

if (!fs.existsSync(nativeBindingPath)) {
  throw new Error(`[sqlite3] Native binding not found: ${nativeBindingPath}`);
}
require(nativeBindingPath);
