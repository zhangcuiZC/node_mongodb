var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');

/* GET user page. */
router.post('/signup', function(req, res, next) {
	var _user = req.body;

	User.find({name: _user.signupName}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (user.length) {
			console.log(user);
			return res.redirect('/');
		}else {
			var new_user = new User({
				name: _user.signupName,
				password: _user.signupPass 
			});

			new_user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				res.redirect('/user/userlist');
			});
		}
	});
});

router.post('/signin', function(req, res, next) {
	var _user = req.body;
	var name = _user.signinName;
	var pass = _user.signinPass;

	User.findOne({name: name}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (!user) {
			console.log('no user');
			return res.redirect('/');
		}

		user.comparePassword(pass, function(err, isMatch) {
			if (err) {
				console.log(err);
			}

			if (isMatch) {
				console.log('matched');
				req.session.user = user;
				return res.redirect('/');
			}else {
				console.log('not matched');
			}
		});
	});
});

router.get('/logout', function(req, res, next) {
	delete req.session.user;
	res.redirect('/');
});

module.exports = router;
