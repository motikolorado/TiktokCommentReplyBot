import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('pending_videos', (table) => {
        table.increments('id').primary();
        table.string('tag').nullable();
        table.string('link', 200);
        table.timestamps();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('pending_videos');
}

