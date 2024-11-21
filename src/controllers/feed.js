const lessonRepository = require('../repository/lesson');
const feedRepository = require('../repository/feed');
const FeedResponse = require('../models/feed-response');
const moment = require('moment');

module.exports = {
    index: async function (req, res) {
        let since = moment(0);
        if (!!req.query.since) {
            since = moment(req.query.since);
        }
        // console.log(now, req.query.since, since);
        const items = await feedRepository.getItemsSince(since);
        const countPendingItems = await feedRepository.countPendingItemsSince(since);
        const lastTimestamp = items.length ? items[items.length - 1].created : null;
        const nextLink = lastTimestamp ? `/feed?since=${lastTimestamp}` : null;
        const items2 = items.map(
            (item) => {
                return {
                    id: item.id,
                    resource_type: item.resource_type,
                    resource_id: item.resource_id,
                    typeofChange: item.change,
                    timestamp: item.created,
                    resource: JSON.parse(item.json)
                };
            }
        );
        const response = new FeedResponse(
            countPendingItems,
            items2,
            nextLink
        );
        res.json(response.getData());
    }
};
