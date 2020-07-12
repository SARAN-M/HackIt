require('./faculty');

const express =require('express');
const mongoose=require('mongoose');
const test= mongoose.model('Testdetail');

const router=express.Router();

router.get('/', (req, res) => {
    res.render('createTest.hbs', {layout: false});
});

router.post("/ups", (req,res) => {
    var c = new test();
    c.title= req.body.title;
    c.duration=req.body.duration;
    c.question=req.body.question;
    c.save((err,doc)=>{
    if (!err)
        res.redirect('/faculty/uploadTest');
    else
        console.log('Error during record insertion : ' + err);
   });
});

module.exports = router;