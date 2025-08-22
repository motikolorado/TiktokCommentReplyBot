"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('videos_queue', (table) => {
        table.increments('id').primary();
        table.string('link', 200);
        table.timestamps();
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('videos_queue');
}
