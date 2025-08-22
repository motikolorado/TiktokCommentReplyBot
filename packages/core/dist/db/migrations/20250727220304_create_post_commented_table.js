"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('post_commented', (table) => {
        table.bigIncrements('id').primary();
        table.string('post_id', 200);
        table.timestamps();
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('post_commented');
}
