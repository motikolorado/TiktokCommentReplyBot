import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('history', (table) => {
        table.increments('id').primary();
        table.integer('post_id');
        table.integer('last_comment_position').nullable();
        table.timestamps();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('history');
}

