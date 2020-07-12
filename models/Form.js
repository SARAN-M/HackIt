const mongoose = require('mongoose');

var formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'This field is required.',
        unique: true
    },
    duration: {
        type: Number,
        required: 'This field is required.',
    },
    question:{
        type: Number,
        required: 'This field is required.'
    },
});

module.exports = test = mongoose.model('Testdetail',formSchema);