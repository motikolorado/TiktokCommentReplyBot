"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('./dist/patch/patch-sqlite3');
var path = require("path");
var knex_1 = require("./dist/db/knex");
var config = {
    client: 'sqlite3',
    connection: {
        filename: (0, knex_1.getDatabasePath)(),
    },
    migrations: {
        directory: path.resolve(__dirname, 'dist/db/migrations'),
        extension: 'js',
    },
    useNullAsDefault: true,
};
exports.default = config;
