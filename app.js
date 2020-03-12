const express = require('express');
const app = express();
const dotenv = require('dotenv');
const index = require('./src/Index');

dotenv.config();
const port = 3000;

app.use(express.static('public'));
app.get('/', index);
app.set('views', './views');
app.set('view engine', 'pug');

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
