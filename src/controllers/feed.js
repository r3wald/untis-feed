const lessonRepository = require('../repository/lesson');
const feedRepository = require('../repository/feed');
const FeedResponse = require('../models/feed-response');
const moment = require('moment');

function analyzeChanges(changes, resource) {
    if (changes?.added?.code === 'cancelled') {
        return "Fällt aus!";
    }
    if (changes?.added?.ro?.length) {
        return "Findet stattdessen im Raum <i>" + changes.added.ro[0].longname + "</i> (" + changes.added.ro[0].name + ") statt.";
    }
    if (changes?.added?.info) {
        return "Neue Information: " + changes.added.info;
    }
    //console.log(changes);
    return "?";
}

function toMoment(resource) {
    const datetimeString = resource.date.toString() +
        ' ' +
        (resource.startTime < 1000 ? '0' : '') +
        resource.startTime.toString() +
        '00'
    ;
    return moment(datetimeString, 'YYYYMMDD HHmmss', 'de');
}

module.exports = {
    latest: async function (req, res) {
        let items = (await feedRepository.getLatestChanges())
            .map((item) => {
                const resource = JSON.parse(item.json);
                const changes = JSON.parse(item.changes);
                return {
                    id: item.id,
                    resource_type: item.resource_type,
                    resource_id: item.resource_id,
                    typeOfChange: item.change,
                    timestamp: item.created,
                    resource: resource,
                    changes: changes,
                    readableDate: toMoment(resource),
                    message: analyzeChanges(changes, resource)
                };
            })
            .filter((item) => {
                return moment().subtract(1, "days").isBefore(item.readableDate);
            })
            .sort((a, b) => a.readableDate.valueOf() - b.readableDate.valueOf());
        return res.render('home', {items: items});
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

        const items2 = items.map((item) => {
            const resource = JSON.parse(item.json);
            const changes = JSON.parse(item.changes);
            return {
                id: item.id,
                resource_type: item.resource_type,
                resource_id: item.resource_id,
                typeOfChange: item.change,
                timestamp: item.created,
                resource: resource,
                changes: changes,
                readableDate: toMoment(resource),
                message: analyzeChanges(changes, resource)
            };
        });
        const response = new FeedResponse(countPendingItems, items2, nextLink);
        res.json(response.getData());
    }, one: async function (req, res) {
        const id = req.params.id;
        const row = await feedRepository.get(id);
        const resource = JSON.parse(row.json);
        const changes = JSON.parse(row.changes);
        const response = {
            id: row.id,
            resource_type: row.resource_type,
            resource_id: row.resource_id,
            typeOfChange: row.change,
            timestamp: row.created,
            resource: resource,
            changes: changes,
            readableDate: toMoment(resource),
            message: analyzeChanges(changes, resource)
        };
        res.json(response);
    },
};

