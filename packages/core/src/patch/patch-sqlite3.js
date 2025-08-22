const path = require('path');
const fs = require('fs');
//const bindings = require('bindings');

// Patch sqlite3 to load native module from real filesystem
const nativeBindingPath = path.join(
  process.cwd(),
  'node_modules/sqlite3/build/Release',
  'node_sqlite3.node'
);

if (!fs.existsSync(nativeBindingPath)) {
  throw new Error(`[sqlite3] Native binding not found: ${nativeBindingPath}`);
}

// Ensure the .node file is required from real path
/*bindings({
  bindings: 'node_sqlite3',
  path: path.dirname(nativeBindingPath)
});*/
require(nativeBindingPath);
