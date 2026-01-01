const lessonRepository = require('./repository/lesson');
const feedRepository = require('./repository/feed');
const _ = require('lodash');
const {WebUntis} = require("webuntis");
const moment = require("moment/moment");
const fs = require("fs");

module.exports = {

    import: async function(){

        const untis = new WebUntis(
            process.env.UNTIS_SCHOOL,
            process.env.UNTIS_USERNAME,
            process.env.UNTIS_PASSWORD,
            process.env.UNTIS_SERVER
        );
        await untis.login();

        const today = moment()
            .utcOffset(0)
            .set({hour: 0, minute: 0, second: 0, millisecond: 0});

        const nextWeek = moment()
            .utcOffset(0)
            .set({hour: 0, minute: 0, second: 0, millisecond: 0})
            .add(7, 'days');

        const timetable = await untis.getOwnTimetableForRange(
            today.toDate(),
            nextWeek.toDate()
        );

        if (process.env.NODE_ENV === 'development') {
            const fileName = __dirname + '/../timetables/' + Date.now() + '.json';
            fs.writeFileSync(fileName, JSON.stringify(timetable, null, 2));
        }

        let result = Promise.all(
            timetable.map(async (lesson) => {
                await this.add('lesson', lesson);
            })
        );

        return result;
    },

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
