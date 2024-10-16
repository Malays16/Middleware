const express = require('express');
const bodyParser = require('body-parser');
const error404 = require('./middleware/error404');
const error400 = require('./middleware/error400');
const bookRoutes = require('./routes/bookRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use('/', bookRoutes);
app.use('/api', apiRoutes);

app.use(error404);
app.use(error400);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on ${PORT}`));