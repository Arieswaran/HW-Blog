const Joi = require('joi');
const mongoose = require('mongoose');
 
const Post = mongoose.model('posts', new mongoose.Schema({
    post: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        minlength: 2,
        maxlength: 50
    }

}));
exports.Post = Post;