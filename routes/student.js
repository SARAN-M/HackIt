require('../app.js');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
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

app.get('/:title', test.paginatedResults);

app.use('/', test.testAvail);


module.exports = app;