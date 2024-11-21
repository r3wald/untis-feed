const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV])

module.exports = {

    countPendingItemsSince: async function(since) {
        const sinceDateString = since.format('YYYY-MM-DD HH:mm:ss.SSS');
        return knex('feed')
            .count('id as total')
            .whereRaw('created > ?', [sinceDateString])
            .first()
            .then((row) => {
                    return row.total;
                }
            );
    },

    getItemsSince: async function(since) {
        const sinceDateString = since.format('YYYY-MM-DD HH:mm:ss.SSS');
        /*
        console.log(knex('feed')
            .select('*')
            .orderBy('created', 'asc')
            .orderBy('id', 'asc')
            .whereRaw('created > ?', [sinceDateString])
            .limit(1)
            .toSQL()
            .toNative()
        );*/
        return knex('feed')
            .select('*')
            .orderBy('created', 'id')
            .whereRaw('created > ?', [sinceDateString])
            .limit(10);
    },

    add: async function (type, data, change) {
        if (!type) {
            throw new Error('no type');
        }
        if (!data.id) {
            throw new Error('no id');
        }
        return await knex('feed')
            .insert({
                // id: autoincrement
                resource_type: type,
                resource_id: data.id,
                json: JSON.stringify(data),
                created: knex.raw("STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')"),
                change: change
            })
            .then(() => {
//                console.log('feed saved:');
//                console.log(arguments);
            })
            .catch((error) => {
                console.log('feed not saved:');
                console.log(error);
                process.exit();
            })
            ;
    }
};

