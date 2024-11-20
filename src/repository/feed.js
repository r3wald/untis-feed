const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV])

module.exports = {

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
                created: knex.fn.now(),
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

