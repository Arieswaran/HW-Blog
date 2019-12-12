const Joi = require('joi');
const mongoose = require('mongoose');
 
const comment = mongoose.model('comments', new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    user_id: {
        type: Object,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    post_id: {
        type: Object,
        required: true,
        minlength: 2,
        maxlength: 50
    }
}));
exports.comment = comment;