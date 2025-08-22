import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('fetched_videos', (table) => {
        table.increments('id').primary();
        table.text('video_id');
        table.timestamps();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('fetched_videos');
}

