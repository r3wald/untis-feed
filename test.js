const importer = require('./src/importer');
const WebUntis = require('webuntis').WebUntis;
const fs = require('fs');

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
    const timetable = await untis.getOwnTimetableForToday();
    const fileName = 'timetable.json';
    fs.writeFileSync(fileName, JSON.stringify(timetable));
    //console.log(timetable);

    return Promise.all(
        timetable.map(async (lesson)=> {
            await importer.add('lesson', lesson);
        })
    );
}
