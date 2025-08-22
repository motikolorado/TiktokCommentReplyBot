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
exports.db = void 0;
exports.getDatabasePath = getDatabasePath;
require('../patch/patch-sqlite3');
const path = __importStar(require("path"));
const knex_1 = __importDefault(require("knex"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
// Helper to resolve the database file path
function getDatabasePath() {
    return path.join(os.homedir(), '.TiktokReplyBot', 'data', 'app.sqlite');
}
const dbPath = getDatabasePath();
function ensureDatabaseDir() {
    const dir = path.dirname(getDatabasePath());
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
ensureDatabaseDir();
// Initialize knex
exports.db = (0, knex_1.default)({
    client: 'sqlite3',
    connection: {
        filename: dbPath,
    },
    useNullAsDefault: true,
});
// Export for other modules
exports.default = exports.db;
