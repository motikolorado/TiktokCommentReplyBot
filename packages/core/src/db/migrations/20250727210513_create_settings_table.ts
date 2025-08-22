import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('settings', (table) => {
        table.increments('id').primary();
        table.enum('bot_status', ['running', 'paused', 'stopped']);
        table.boolean('run_in_background').defaultTo(false);
        table.integer('post_per_day').nullable();
        table.integer('post_interval').nullable();
        table.integer('maximum_comments').nullable();
        table.integer('max_auto_find_videos').nullable();
        table.integer('delay_between_reply').nullable();
        table.boolean('test_mode').nullable().defaultTo(true);
        table.timestamps();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('settings');
}

