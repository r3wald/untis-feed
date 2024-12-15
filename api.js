const express = require('express');
const cron = require('node-cron');
const lessonsController = require('./src/controllers/lessons');
const feedController = require('./src/controllers/feed');
const importer = require('./src/importer');
const expressHandlebars = require('express-handlebars');

require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');

cron.schedule('30 */5 * * * *', async () => {
    await importer.import();
});

const app = express();
const port = parseInt(process.env.PORT) || 2999;
app.set('json spaces', 2);


const handlebarsHelpers = expressHandlebars.create({
    helpers: require("./src/helpers/handlebars"),
    defaultLayout: 'layout',
});

app.engine('handlebars', handlebarsHelpers.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.json({extended: true}));
app.use(express.Router());
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
app.get('/', require('./src/controllers/index'));
app.get('/feed', feedController.index);
app.get('/feed/:id', feedController.one);
app.get('/lessons', lessonsController.list);
app.get('/lessons/:id', lessonsController.one);
app.get('/view', feedController.latest);

app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}/`);
});
