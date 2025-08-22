"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('hashtags', (table) => {
        table.increments('id').primary();
        table.text('text');
        table.timestamps();
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('hashtags');
}
