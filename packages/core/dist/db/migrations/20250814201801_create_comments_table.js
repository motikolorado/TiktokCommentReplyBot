"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('comments', (table) => {
        table.increments('id').primary();
        table.text('text');
        table.string('emojis');
        table.timestamps();
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('comments');
}
