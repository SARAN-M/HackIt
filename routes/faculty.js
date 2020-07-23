require('../app.js');
require('../models/Form');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const test = mongoose.model('Testdetail');

var app = express();
const User = mongoose.model('Users');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.engine('hbs', exphbs({ extname: 'hbs', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', 'hbs');


app.get('/', ensureAuthenticated,(req, res) => {
    User.find({email:req.user.email},(err,docs)=>{
        if(docs[0].stat=='Staff'){
        res.render('dashboard.hbs', {layout: false});}
        else if(docs[0].stat=='Student'){
        res.redirect('/student');
        }
    })
  });

var form = require('./createTest.js');
app.use('/createTest', form);

var uploads = require('../middleware/uploadController');
app.get('/uploadTest',uploads.loadHome);

app.post('/uploadTest/upload', uploads.uploadFile);

app.post('/created', (req, res) => {
    res.redirect('/faculty');
});

module.exports = app;
