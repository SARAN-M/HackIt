const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const app = express();
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const connectEnsureLogin = require('connect-ensure-login');
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
app.set('views', path.join(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/login', (req, res) => {
  res.render('login.html');
});

app.get('/user',connectEnsureLogin.ensureLoggedIn(),(req, res) => res.send({user: req.user})
);

//Routes

//Upload Files
var uploads = require('./routes/uploads');
app.use('/uf', uploads);

//Admin
var admin = require('./routes/admin.js');
app.use('/admin', admin);

//Student
var student = require('./routes/student');
app.use('/Student', student);

//Faculty
var faculty = require('./routes/faculty');
app.use('/Faculty', faculty);

//Port
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => console.log(`Server started on port ${port}`));