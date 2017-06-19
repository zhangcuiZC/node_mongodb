var mongoose = require('mongoose');

var CommentSchema = require('./schema_comment');

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;