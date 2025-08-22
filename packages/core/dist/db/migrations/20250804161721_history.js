"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('history', (table) => {
        table.increments('id').primary();
        table.integer('post_id');
        table.integer('last_comment_position').nullable();
        table.timestamps();
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('history');
}
