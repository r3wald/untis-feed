/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return Promise.all([
            knex.raw('UPDATE feed SET created = CONCAT(SUBSTRING(created, 1, 23), "Z"); '),
            knex.raw('UPDATE lessons SET created = CONCAT(SUBSTRING(created, 1, 23), "Z"); '),
            knex.raw('UPDATE lessons SET updated = CONCAT(SUBSTRING(updated, 1, 23), "Z"); ')
        ]
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return Promise.all([
            knex.raw('UPDATE feed SET created = SUBSTRING(created, 1, 23); '),
            knex.raw('UPDATE lessons SET created = SUBSTRING(created, 1, 23); '),
            knex.raw('UPDATE lessons SET updated = SUBSTRING(updated, 1, 23); ')
        ]
    );
};
