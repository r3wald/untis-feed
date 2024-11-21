const lessonRepository = require('./repository/lesson');
const feedRepository = require('./repository/feed');
const _ = require('lodash');

module.exports = {

    add: async function (resourceType, newResource) {

        const resourceId = newResource.id;
        const oldRow = await lessonRepository.get(resourceId);

        if (!oldRow) {
            // console.debug("new:       ",  null, " -> ",  newResource);
            console.debug("new:       ", newResource.id);
            return Promise.all(
                [
                    feedRepository.add(resourceType, newResource, 'A'),
                    lessonRepository.save(newResource)
                ]
            );
        }

        const oldResource = JSON.parse(oldRow.json);
        if (!_.isEqual(oldResource, newResource)) {
            //console.debug("changed:   ",  oldResource, " -> ",  newResource);
            console.debug("changed:   ", newResource.id);
            return Promise.all(
                [
                    feedRepository.add(resourceType, newResource, 'U'),
                    lessonRepository.save(newResource)
                ]
            )
        }

        //console.debug("unchanged: ",  oldResource, " == ",  newResource);
        console.debug("unchanged: ", newResource.id);
        return await undefined;
    }
};
