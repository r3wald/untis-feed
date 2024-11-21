const importer = require('./src/importer');
const WebUntis = require('webuntis').WebUntis;
const fs = require('fs');
const moment = require('moment');

runAll()
    .then(() => {
        console.log('done');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(0);
    });

async function runAll() {

    const untis = new WebUntis(
        process.env.UNTIS_SCHOOL,
        process.env.UNTIS_USERNAME,
        process.env.UNTIS_PASSWORD,
        process.env.UNTIS_SERVER
    );
    await untis.login();
    //const timetable = await untis.getOwnTimetableForToday();

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

    const fileName = 'timetables/' + Date.now() + '.json';
    fs.writeFileSync(fileName, JSON.stringify(timetable, null, 2));

    return Promise.all(
        timetable.map(async (lesson) => {
            await importer.add('lesson', lesson);
        })
    );
}
