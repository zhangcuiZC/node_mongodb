var mongoose = require('mongoose');

var CategorySchema = require('./schema_category');

var Category = mongoose.model('Category', CategorySchema);

module.exports = Category;