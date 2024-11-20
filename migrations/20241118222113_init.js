/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('feed', function (table) {
            table.increments('id').primary();
            table.string('resource_type').notNullable();
            table.string('resource_id').notNullable();
            table.string('json').notNullable();
            table.string('created').notNullable();
            table.string('change').notNullable();
            table.index(
                ['resource_type','resource_id'],
                'unique_resource',
                {
                    indexType: 'UNIQUE',
                }
            );
        })
        .createTable('lessons', function (table) {
            table.string('id').primary();
            table.string('json').notNullable();
            table.string('created').notNullable();
            table.string('updated').notNullable();
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
