const express = require('express');
const morgan = require('morgan');
const cron = require('node-cron');
const lessonsController = require('./src/controllers/lessons');
const feedController = require('./src/controllers/feed');
const importer = require('./src/importer');

cron.schedule('30 */5 * * * *', async () => {
    console.log('starting import');
    await importer.import();
});

const server = express();
const port = parseInt(process.env.PORT) || 2999;
server.set('json spaces', 2);
server.use(express.json({extended: true}));
server.use(express.Router());
server.use(morgan('combined'));

server.get('/', require('./src/controllers/index'));
server.get('/feed', feedController.index);
server.get('/lessons', lessonsController.list);
server.get('/lessons/:id', lessonsController.one);

server.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}/`);
});
