var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Comment = require('../models/comment');
var mongoose = require('mongoose');
var login_required = require('../libs/mw_login_required');

/* GET user page. */
router.post('/signup', function(req, res, next) {
	var _user = req.body;
	User.find({name: _user.name}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (user.length) {
			// console.log(user);
			// return res.redirect('/');
			res.json({
				status: 0,
				msg: '用户名已被注册'
			})
		}else {
			var new_user = new User(_user);

			new_user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				// res.redirect('/user/userlist');
				res.json({
					status: 1,
					msg: '注册成功'
				})
			});
		}
	});
});

// validate a username
router.post('/validate', function(req, res, next) {
	var name = req.body;
	User.find({name: name}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (user.length) {
			res.json({
				status: 0,
				msg: 'existed'
			})
		}else {
			res.json({
				status: 1,
				msg: 'useable'
			})
		}
	});
});

router.post('/signin', function(req, res, next) {
	var _user = req.body;
	var name = _user.userName;
	var pass = _user.password;

	User.findOne({name: name}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (!user) {
			console.log('no user');
			// return res.redirect('/');
		}

		user.comparePassword(pass, function(err, isMatch) {
			if (err) {
				console.log(err);
			}

			if (isMatch) {
				console.log('matched', user);
				req.session.user = user;
				res.json({
					status: 1,
					name: user.name,
					_id: user._id,
					role: user.role
				});
				// return res.redirect('/');
			}else {
				console.log('not matched');
			}
		});
	});
});

router.get('/check', function(req, res, next) {
	var user = req.session.user;
	console.log(req.session);
	if (user) {
		res.json({
			status: 1,
			name: user.name,
			_id: user._id,
			role: user.role
		});
	}else {
		res.json({
			status: 0,
			msg: '账号或密码错误'
		})
	}
});


router.get('/logout', function(req, res, next) {
	delete req.session.user;
	res.json({
		status: 1
	})
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
