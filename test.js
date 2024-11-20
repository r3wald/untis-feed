const importer = require('./src/importer');

runAll()
    .then(() => {
        console.log('all done');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(0);
    });

async function runAll() {

    const lesson1 = {id: 1, foo: "bar"};
    await importer.add('lesson', lesson1);

    const lesson2 = {id: 2, foo: "bar"};
    await importer.add('lesson', lesson2);

    const lesson3 = {id: 1, foo: "bar"};
    await importer.add('lesson', lesson3);

    const lesson4 = {id: 2, foo: "baz"};
    await importer.add('lesson', lesson4);
}
