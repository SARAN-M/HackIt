require('../app.js');
require('../models/Form');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connectEnsureLogin = require('connect-ensure-login');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const test = mongoose.model('Testdetail');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.engine('hbs', exphbs({ extname: 'hbs', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', 'hbs');

app.get('/', connectEnsureLogin.ensureLoggedIn(),(req, res) => {
    res.render('dashboard.hbs', {layout: false});
});

var form = require('./createTest.js');
app.use('/createTest', form);

var uploads = require('../middleware/uploadController');
app.get('/uploadTest', uploads.loadHome);

app.post('/uploadTest/upload', uploads.uploadFile);

app.post('/created', (req, res) => {
    res.redirect('/faculty');;
});

module.exports = app;