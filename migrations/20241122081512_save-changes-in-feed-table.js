/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex
        .schema
        .table('feed', table => {
            table.string('changes');
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex
        .schema
        .table('feed', table => {
            table.dropColumn('changes');
        })
};
