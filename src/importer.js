const lessonRepository = require('./repository/lesson');
const feedRepository = require('./repository/feed');
const _ = require('lodash');

module.exports = {

    add: async function (resourceType, newResource) {

        const resourceId = newResource.id;
        const oldRow = await lessonRepository.get(resourceId);

        if (!oldRow) {
            // console.log("new:       ",  null, " -> ",  newResource);
            console.log("new:       ", newResource.id);
            return Promise.all(
                [
                    feedRepository.add(resourceType, newResource, 'A'),
                    lessonRepository.save(newResource)
                ]
            );
        }

        const oldResource = JSON.parse(oldRow.json);
        if (!_.isEqual(oldResource, newResource)) {
            //console.log("changed:   ",  oldResource, " -> ",  newResource);
            console.log("changed:   ", newResource.id);
            return Promise.all(
                [
                    feedRepository.add(resourceType, newResource, 'U'),
                    lessonRepository.save(newResource)
                ]
            )
        }

        //console.log("unchanged: ",  oldResource, " == ",  newResource);
        console.log("unchanged: ", newResource.id);
        return await undefined;
    }
};
