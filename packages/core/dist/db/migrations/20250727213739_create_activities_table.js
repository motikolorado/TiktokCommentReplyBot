"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('activities', (table) => {
        table.increments('id').primary();
        table.text('description');
        table.string('video_link');
        table.enum('status', ['success', 'failed', 'queued']);
        table.timestamps();
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('activities');
}
