var mongoose = require('mongoose');

var MovieSchema = require('./schema');

var Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;