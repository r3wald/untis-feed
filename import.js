const importer = require('./src/importer');

importer.import()
    .then(() => {
        console.log('done');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(0);
    });
