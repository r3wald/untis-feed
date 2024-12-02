const lessonRepository = require('../repository/lesson');
const feedRepository = require('../repository/feed');
const FeedResponse = require('../models/feed-response');
const moment = require('moment');

function analyzeChanges(changes, resource) {
    if (changes.added.code === 'cancelled') {
        return "Fällt aus!";
    }
    if (changes.added.ro[0].longname) {
        return "Findet stattdessen im Raum <i>" + changes.added.ro[0].longname + "</i> (" + changes.added.ro[0].name + ") statt.";
    }
    //console.log(changes);
    return "?";
}

module.exports = {
    latest: async function (req, res) {
        const items = await feedRepository.getLatestChanges();
        const items2 = items.map(
            (item) => {
                const resource = JSON.parse(item.json);
                const changes = JSON.parse(item.changes);
                return {
                    id: item.id,
                    resource_type: item.resource_type,
                    resource_id: item.resource_id,
                    typeofChange: item.change,
                    timestamp: item.created,
                    resource: resource,
                    changes: changes,
                    message: analyzeChanges(changes, resource)
                };
            }
        );
        return res.render('home', {items: items2});
    },

    index: async function (req, res) {
        let since = moment(0);
        if (req.query.since === 'yesterday') {
            since = moment()
                .subtract(1, 'days')
                .set({hour: 0, minute: 0, second: 0, millisecond: 0});
        } else if (req.query.since === 'today') {
            since = moment()
                .set({hour: 0, minute: 0, second: 0, millisecond: 0});
        } else if (!!req.query.since) {
            since = moment(req.query.since);
        }
        // console.log(now, req.query.since, since);
        const items = await feedRepository.getItemsSince(since);
        const countPendingItems = await feedRepository.countPendingItemsSince(since);
        const lastTimestamp = items.length ? items[items.length - 1].created : null;
        const nextLink = lastTimestamp ? `/feed?since=${lastTimestamp}` : null;

        const items2 = items.map(
            (item) => {
                const resource = JSON.parse(item.json);
                const changes = JSON.parse(item.changes);
                return {
                    id: item.id,
                    resource_type: item.resource_type,
                    resource_id: item.resource_id,
                    typeofChange: item.change,
                    timestamp: item.created,
                    resource: resource,
                    changes: changes,
                    message: analyzeChanges(changes, resource)
                };
            }
        );
        const response = new FeedResponse(
            countPendingItems,
            items2,
            nextLink
        );
        res.json(response.getData());
    },
    one: async function (req, res) {
        const id = req.params.id;
        const row = await feedRepository.get(id);
        const resource = JSON.parse(row.json);
        const changes = JSON.parse(row.changes);
        const response = {
            id: row.id,
            resource_type: row.resource_type,
            resource_id: row.resource_id,
            typeofChange: row.change,
            timestamp: row.created,
            resource: resource,
            changes: changes,
            message: analyzeChanges(changes, resource)
        };
        res.json(response);
    },
};

