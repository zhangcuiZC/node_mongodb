var mongoose = require('mongoose');

var UserSchema = require('./schema_user');

var User = mongoose.model('User', UserSchema);

module.exports = User;