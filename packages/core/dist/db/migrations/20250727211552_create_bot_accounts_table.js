"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('bot_accounts', (table) => {
        table.increments('id').primary();
        table.string('name');
        table.string('email');
        table.string('password');
        table.timestamp('last_used');
        table.enum('health', ['good', 'banned', 'warning']).nullable().defaultTo('good');
        table.enum('status', ['active', 'inactive']).nullable().defaultTo('inactive');
        table.timestamps();
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('bot_accounts');
}
