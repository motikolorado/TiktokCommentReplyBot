const path = require('path');
const fs = require('fs');

// Patch sqlite3 to load native module from real filesystem
const nativeBindingPath = path.join(
  process.cwd(),
  'node_modules/sqlite3/build/Release',
  'node_sqlite3.node'
);

if (!fs.existsSync(nativeBindingPath)) {
  throw new Error(`[sqlite3] Native binding not found: ${nativeBindingPath}`);
}

require(nativeBindingPath);
