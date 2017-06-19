var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Comment = require('../models/comment');
var mongoose = require('mongoose');
var login_required = require('../libs/mw_login_required');

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

// comment
router.post('/comment', login_required, function(req, res, next) {
	var _comment = req.body;

	if (_comment.cid) {
		Comment.findById(_comment.cid, function(err, comment) {
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			};

			comment.reply.push(reply);

			comment.save(function(err, comment) {
				if (err) {
					console.log(err);
				}
				res.redirect('/movie/' + _comment.movie);
			});
		});
	}else {
		var new_comment = new Comment({
			movie: _comment.movie,
			from: _comment.from,
			to: _comment.to,
			content: _comment.content
		});
		new_comment.save(function(err, comment) {
			if (err) {
				console.log(err);
			}
			res.redirect('/movie/' + _comment.movie);
		});
	}
	
});

module.exports = router;
