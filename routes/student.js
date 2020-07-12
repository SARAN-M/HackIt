require('../app.js');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('student.html');
});

var test = require('./files');
app.use('/quest', test.testAvail);

module.exports = app;