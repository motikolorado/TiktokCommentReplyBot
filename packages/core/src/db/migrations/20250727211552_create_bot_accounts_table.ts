import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('bot_accounts', (table) => {
        table.increments('id').primary();
        table.string('name');
        table.string('email');
        table.string('password');
        table.timestamp('last_used');
        table.enum('health', ['good', 'banned', 'warning']).nullable().defaultTo('good');
        table.enum('status', ['active', 'inactive']).nullable().defaultTo('inactive');
        table.timestamps();
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('bot_accounts');
}

