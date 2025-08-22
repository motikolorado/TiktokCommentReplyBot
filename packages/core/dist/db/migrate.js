"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const path_1 = __importDefault(require("path"));
const knex_1 = __importDefault(require("./knex"));
async function runMigrations() {
    await knex_1.default.migrate.latest({
        directory: path_1.default.resolve(__dirname, './migrations'),
        extension: 'js'
    });
    console.log('Database migrations applied successfully.');
}
