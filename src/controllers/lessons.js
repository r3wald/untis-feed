const lessonRepository = require('../repository/lesson');
const feedRepository = require('../repository/feed');
const _ = require('lodash');
const CollectionResponse = require('../models/collection-response');

module.exports = {
    list: async function (req, res) {
        const limit = 1;
        const page = parseInt(res.page) || 0;
        const lessons = await lessonRepository.list(limit, page);
        const total = await lessonRepository.count();
        res.setHeader('Content-Type', 'application/json');
        const response = new CollectionResponse(
            lessons.map((lesson) => JSON.parse(lesson.json)),
            total,
            limit,
            page
        );
        res.end(JSON.stringify(response.getData()));
    },
    one: async function (req, res) {
        const id = req.params.id;
        const row = await lessonRepository.get(id);
        res.setHeader('Content-Type', 'application/json');
        res.end(row.json);
    }
};
