const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const app = express();
const passport = require('passport');
const flash = require('connect-flash');
const { ensureAuthenticated, forwardAuthenticated } = require("./config/auth");
const session = require('express-session');
require('./config/passport')(passport);

//MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//EJS
app.set('view engine', 'ejs');

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  // Connect flash
  app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

app.use(express.static(__dirname + '/views'));
app.use(express.static(path.join(__dirname +'/views')));
app.set('views', path.join(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/',forwardAuthenticated, (req, res) => {
    res.render('index.ejs');
});

app.get('/user',(req, res) => {
  res.send({user: req.user})
});
//Routes
app.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
})
//Upload Files
var uploads = require('./routes/uploads');
app.use('/uf',ensureAuthenticated,uploads);

//Admin
var admin = require('./routes/admin.js');
app.use('/admin', admin);

//Student
var student = require('./routes/student');
app.use('/student',student);

//Faculty
var faculty = require('./routes/faculty');
app.use('/faculty',faculty);

//Port
const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
