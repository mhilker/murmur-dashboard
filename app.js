const express = require('express');
const app = express();
const dotenv = require('dotenv');
const index = require('./src/Index');

dotenv.config();

app.use(express.static('public'));
app.get('/', index);
app.set('views', './views');
app.set('view engine', 'pug');

app.listen(process.env.PORT, function () {
    console.log('Listening on port ' + process.env.PORT);
});
