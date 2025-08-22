"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('fetched_videos', (table) => {
        table.increments('id').primary();
        table.text('video_id');
        table.timestamps();
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('fetched_videos');
}
