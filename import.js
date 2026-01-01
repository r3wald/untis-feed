const importer = require('./src/importer');

console.log("starting import");

importer.import()
    .then((x) => {
        console.log("import finished: ", x.length, " lessons processed");
        process.exit(0);
    })
    .catch(error => {
        console.log("import failed");
        console.error(error);
        process.exit(1);
    });
