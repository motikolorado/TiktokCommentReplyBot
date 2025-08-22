import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('post_commented', (table) => {
        table.bigIncrements('id').primary();
        table.string('post_id', 200);
        table.timestamps();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('post_commented');
}

