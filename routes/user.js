var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/user');

/* GET user page. */
router.post('/signup', function(req, res, next) {
	var _user = req.body;
	var new_user = new User({
		name: _user.signupName,
		password: _user.signupPass 
	});

	User.find({name: _user.signupName}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (user.length) {
			console.log(user);
			return res.redirect('/');
		}else {
			new_user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				res.redirect('/user/userlist');
			});
		}
	});
});

router.get('/userlist', function(req, res, next) {

	User.fetch(function(err, users) {
		res.render('pages/userlist', {
			title: '注册用户列表',
			users: users
		});
	});
});

module.exports = router;
