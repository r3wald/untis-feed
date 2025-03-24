/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return Promise.all([
            knex.raw('UPDATE feed SET created = CONCAT(created, ".000") WHERE LENGTH(created)=19; '),
            knex.raw('UPDATE lessons SET created = CONCAT(created, ".000") WHERE LENGTH(created)=19; '),
            knex.raw('UPDATE lessons SET updated = CONCAT(updated, ".000") WHERE LENGTH(updated)=19; ')
        ]
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return Promise.all([]);
};
