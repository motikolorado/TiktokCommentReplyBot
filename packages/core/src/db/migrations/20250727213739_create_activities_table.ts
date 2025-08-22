import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('activities', (table) => {
        table.increments('id').primary();
        table.text('description');
        table.string('video_link');
        table.enum('status', ['success', 'failed', 'queued']);
        table.timestamps();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('activities');
}

