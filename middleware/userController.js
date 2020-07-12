const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Login Page
router.get('/home', (req, res) => {
    res.render('adminUI.html');
});

router.get('/', (req, res) => {
    res.render("admin/addOrEdit", {
        viewTitle: "Insert User"
    });
});

router.get('/login',(req, res) => {
    res.render('login.html');
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    console.log(req.body.password );
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt,(err, hash) => {
            if (err) throw err;
            req.body.password = hash;
            console.log(req.body.password );
            const { fullName, email,rollno, password,stat} = req.body;
            var user = new User();
            user.fullName = req.body.fullName;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.dept = req.body.dept;
            user.rollno = req.body.rollno;
            user.password = req.body.password;
            user.stat = req.body.stat;
            user.save((err, doc) => {
            if (!err)
                    res.redirect('admin/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        res.render("admin/addOrEdit", {
                            viewTitle: "Insert User",
                            user: req.body
                        });
                    }
                    else
                        console.log('Error during record insertion : ' + err);        
                }
            });
        });
    });
}


function updateRecord(req, res) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt,(err, hash) => {
            if (err) throw err;
            req.body.password = hash;
            User.findOneAndUpdate({ _id: req.body._id }, req.body,{ new: true }, (err, doc) => {
                if (!err) { res.redirect('admin/list'); }
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        res.render("admin/addOrEdit", {
                            viewTitle: 'Update User',
                            user: req.body
                        });
                    }
                    else
                        console.log('Error during record update : ' + err);
                }
            });
        });
    });
}


router.get('/list', (req, res) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("admin/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving user list :' + err);
        }
    });
});

router.get('/student', (req, res) => {
    User.find({stat:'Student'},(err, docs) => {
        if (!err) {
            res.render("admin/student", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving user list :' + err);
        }
    });
});

router.get('/staff', (req, res) => {
    User.find({stat:'Staff'},(err, docs) => {
        if (!err) {
            res.render("admin/staff", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving user list :' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id',(req, res) => {
    User.findById(req.params.id,(err, doc) => {
        if (!err) {
            res.render("admin/addOrEdit", {
                viewTitle: "Update User",
                user: doc
            });  
        }
    }); 
});

router.get('/delete/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/admin/student');
        }
        else { console.log('Error in user delete :' + err); }
    });
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/faculty',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
});

module.exports = router;