const importer = require('./src/importer');

importer.import()
    .then((x) => {
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
