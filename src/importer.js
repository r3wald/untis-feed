const lessonRepository = require('./repository/lesson');
const feedRepository = require('./repository/feed');
const _ = require('lodash');

module.exports = {

    add: async function (resourceType, newResource) {

        const resourceId = newResource.id;
        const oldRow = await lessonRepository.get(resourceId);

        if (!oldRow) {
            //console.debug("new:       ",  null, " -> ",  newResource);
            //console.debug("new:       ", newResource.id);
            return Promise.all(
                [
                    feedRepository.add(resourceType, newResource, 'A', null),
                    lessonRepository.save(newResource)
                ]
            );
        }

        const oldResource = JSON.parse(oldRow.json);
        if (!_.isEqual(oldResource, newResource)) {
            //console.debug("changed:   ",  oldResource, " -> ",  newResource);
            //console.debug("changed:   ", newResource.id);
            changes = this._compare(oldResource, newResource);
            return Promise.all(
                [
                    feedRepository.add(resourceType, newResource, 'U', changes),
                    lessonRepository.save(newResource)
                ]
            )
        }

        //console.debug("unchanged: ",  oldResource, " == ",  newResource);
        //console.debug("unchanged: ", newResource.id);
        return await undefined;
    },

    _compare: function (oldValue, newValue) {
        const added = _.fromPairs(_.differenceWith(_.toPairs(newValue), _.toPairs(oldValue), _.isEqual));
        const removed = _.fromPairs(_.differenceWith(_.toPairs(oldValue), _.toPairs(newValue), _.isEqual));
        return {added, removed};
    }
};
