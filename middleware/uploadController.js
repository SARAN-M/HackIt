require('../models/Form');

const MongoClient = require('mongodb');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');

const url = "mongodb+srv://mongo:mongo@cluster0-4zn27.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "test";

let storage = new GridFsStorage({
  url: url,
  file: (req, file) => {
    return {
      bucketName: 'uploads',       //Setting collection name, default name is fs
      filename: Title + '_' + file.originalname     //Setting file name to original name of file
    }
  }
});

let upload = null;

storage.on('connection', (db) => {
  //Setting up upload for a single file
  upload = multer({
    storage: storage
  }).single('file1');
  
});

module.exports.loadHome = (req, res) => {

  var Title = req.params.title;
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client){
    if(err){
        return res.render('upload.hbs', {title: Title, message: 'MongoClient Connection error', error: err.errMsg, layout: false});
    }
    const db = client.db(dbName);
    
    const collection = db.collection('uploads.files');
    const collectionChunks = db.collection('uploads.chunks');

    collection.find({'filename': {$regex: `${Title}`}}).toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('upload.hbs', { files: false, message: "Upload Questions", layout: false });
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('upload.hbs', { title: Title, message: "Upload Questions", cond: true, files: files, layout: false });
      }
    });
  });
};

module.exports.uploadFile = async (req, res) => {
  var Title = req.params.title;
  upload(req, res, (err) => {
    if(err){
      return res.render('upload.hbs', {title: Title, message: 'File could not be uploaded', error: err, layout: false});
    }
    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client){
      if(err){
          return res.render('upload.hbs', {title: Title, message: 'MongoClient Connection error', error: err.errMsg});
      }
      const db = client.db(dbName);
      
      const collection = db.collection('uploads.files');
      const collectionChunks = db.collection('uploads.chunks');
  
      collection.find({'filename': {$regex: `${Title}`}}).toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
          res.render('upload.hbs', { files: false, layout: false });
        } else {
          files.map(file => {
            if (
              file.contentType === 'image/jpeg' ||
              file.contentType === 'image/png'
            ) {
              file.isImage = true;
            } else {
              file.isImage = false;
            }
          });
          res.render('upload.hbs', {title: Title, message: `File ${req.file.filename} has been uploaded!`, cond: true, files: files, layout: false});
        }
      });
    });
  });
};

module.exports.getFile = (req, res) => {
  //Accepting user input directly is very insecure and should 
  //never be allowed in a production app. Sanitize the input.
  let fileName = req.body.text1;
  //Connect to the MongoDB client
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client){

    if(err){
      return res.render('upload.hbs', {title: 'Uploaded Error', message: 'MongoClient Connection error', error: err.errMsg, layout: false});
    }
    const db = client.db(dbName);
    
    const collection = db.collection('uploads.files');
    const collectionChunks = db.collection('uploads.chunks');
    collection.find({filename: fileName}).toArray(function(err, docs){
      if(err){
        return res.render('upload.hbs', {title: 'File error', message: 'Error finding file', error: err.errMsg, layout: false});
      }
      if(!docs || docs.length === 0){
        return res.render('upload.hbs', {title: 'Download Error', message: 'No file found', layout: false});
      }else{
        //Retrieving the chunks from the db
        collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray(function(err, chunks){
          if(err){
            return res.render('upload.hbs', {title: 'Download Error', message: 'Error retrieving chunks', error: err.errmsg, layout: false});
          }
          if(!chunks || chunks.length === 0){
            //No data found
            return res.render('upload.hbs', {title: 'Download Error', message: 'No data found', layout: false});
          }
          //Append Chunks
          let fileData = [];
          for(let i=0; i<chunks.length;i++){
            //This is in Binary JSON or BSON format, which is stored
            //in fileData array in base64 endocoded string format
            fileData.push(chunks[i].data.toString('base64'));
          }
          //Display the chunks using the data URI format
          let finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
          res.render('imageView', {title: 'Image File', message: 'Image loaded from MongoDB GridFS', imgurl: finalFile});
        });
      }
      
    });
  });
};

module.exports.testAvail = async (req, res, next) => {
  var Title = req.params.title;
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client){

    if(err){
        return res.render('index', {title: 'Uploaded Error', message: 'MongoClient Connection error', error: err.errMsg});
    }

    test.find().exec((err, docs) => {
      // Check if files
      res.render('testAvail.hbs', {status: "Faculty", message: "Tests Created", tests: docs, cond: false, layout: false});
    });
  });
};

module.exports.viewTest = (req, res) => {
  var Title = req.params.title;
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client){
    if(err){
        return res.render('upload.hbs', {title: Title, message: 'MongoClient Connection error', error: err.errMsg, layout: false});
    }
    const db = client.db(dbName);
    
    const collection = db.collection('uploads.files');
    const collectionChunks = db.collection('uploads.chunks');

    collection.find({'filename': {$regex: `${req.params.title}`}}).toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('upload.hbs', { files: false, message: "Upload Questions", layout: false });
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('upload.hbs', { title: Title, message: "Upload Questions", cond: false, files: files, layout: false });
      }
    });
  });
};