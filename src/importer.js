const lessonRepository = require('./repository/lesson');
const feedRepository = require('./repository/feed');
const _ = require('lodash');

module.exports = {

    add: async function (resourceType, newResource) {

        const resourceId = newResource.id;
        const oldRow = await lessonRepository.get(resourceId);

        if (!oldRow) {
            console.log("new:       ",  null, " -> ",  newResource);
            return Promise.all(
                [
                    feedRepository.add(resourceType, newResource, 'A'),
                    lessonRepository.save(newResource)
                ]
            );
        }

        const oldResource = JSON.parse(oldRow.json);
        if (!_.isEqual(oldResource, newResource)) {
            console.log("changed:   ",  oldResource, " -> ",  newResource);
            return Promise.all(
                [
                    feedRepository.add(resourceType, newResource, 'U'),
                    lessonRepository.save(newResource)
                ]
            )
        }

        console.log("unchanged: ",  oldResource, " == ",  newResource);
        return await undefined;
    }
};
