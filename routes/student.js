require('../app.js');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const User = mongoose.model('Users');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/student',ensureAuthenticated,(req, res) => {
    User.find({email:req.user.email},(err,docs)=>{
        console.log(req.user.email);
        if(docs[0].stat=='Student'){
            res.render('student.hbs', {layout: false});
        }
        else{
            res.redirect('/');
        }
    })
   
  });
app.engine('hbs', exphbs({ extname: 'hbs', handlebars: allowInsecurePrototypeAccess(Handlebars), helpers:{
    // Function to do basic mathematical operation in handlebar
    math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    }
} }));
app.set('view engine', 'hbs');

var test = require('../middleware/testController');

app.get('/:title',ensureAuthenticated, test.paginatedResults);

app.use('/',ensureAuthenticated, test.testAvail);


module.exports = app;
