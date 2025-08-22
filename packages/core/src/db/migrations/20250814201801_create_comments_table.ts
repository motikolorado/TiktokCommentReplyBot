import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('comments', (table) => {
        table.increments('id').primary();
        table.text('text');
        table.string('emojis');
        table.timestamps();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('comments');
}

