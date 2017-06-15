var mongoose = require('mongoose');

var MovieSchema = require('./schema_movie');

var Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;