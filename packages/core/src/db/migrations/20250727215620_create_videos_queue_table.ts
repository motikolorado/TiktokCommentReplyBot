import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('videos_queue', (table) => {
        table.increments('id').primary();
        table.string('link', 200);
        table.timestamps();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('videos_queue');
}

