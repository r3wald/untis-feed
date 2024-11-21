const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV])

module.exports = {

    count: async function () {
        return knex('lessons')
            .count('id as total')
            .first()
            .then((row) => {
                    return row.total;
                }
            );
    },

    list: async function (limit, page) {
        return knex('lessons')
            .select('*')
            .orderBy('created')
            .limit(limit)
            .offset(page * limit);
    },

    get: async function (id) {
        if (!id) {
            throw new Error('no id');
        }
        return knex('lessons')
            .where('id', id)
            .first();
    },

    save: async function (data) {
        if (!data.id) {
            throw new Error('no id');
        }
        return await knex('lessons')
            .insert({
                id: data.id,
                json: JSON.stringify(data),
                created: knex.raw("STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')"),
                updated: knex.raw("STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')")
            })
            .onConflict(
                'id'
            )
            .merge({
                id: data.id,
                json: JSON.stringify(data),
                updated: knex.raw("STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')")
            })
            .then(() => {
            })
            .catch((error) => {
                console.log('lesson not saved:');
                console.log(error);
                process.exit(1);
            });
    }
};

