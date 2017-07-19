var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Comment = require('../models/comment');
var mongoose = require('mongoose');
var login_required = require('../libs/mw_login_required');

// 获取用户列表，已改造
router.get('/list', function(req, res, next) {
	User.fetch(function(err, users) {
		res.json(users);
	});
});

// 注册用户，已改造
router.post('/signup', function(req, res, next) {
	var _user = req.body;
	User.find({name: _user.name}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (user.length) {
			res.json({
				status: 0,
				msg: '用户名已被注册'
			});
		}else {
			var new_user = new User(_user);

			new_user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				res.json({
					status: 1,
					msg: '注册成功'
				});
			});
		}
	});
});

// 验证用户是否可用，已改造
router.post('/validate', function(req, res, next) {
	var _user = req.body;
	var name = _user.name;
	User.find({name: name}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (user.length) {
			res.json({
				status: 0,
				msg: 'existed'
			});
		}else {
			res.json({
				status: 1,
				msg: 'useable'
			});
		}
	});
});

// 登录，已改造
router.post('/signin', function(req, res, next) {
	var _user = req.body;
	var name = _user.userName;
	var pass = _user.password;

	User.findOne({name: name}, function(err, user) {
		if (err) {
			console.log(err);
		}
		console.log(user);
		if (!user) {
			res.json({
				status: 0,
				msg: '账号或密码错误'
			});
			return false;
		}

		user.comparePassword(pass, function(err, isMatch) {
			if (err) {
				console.log(err);
			}

			if (isMatch) {
				req.session.user = user;
				if (user.role > 1) {
					res.json({
						status: 1,
						name: user.name,
						_id: user._id,
						role: user.role
					});
				}else {
					res.json({
						status: 0,
						msg: '没有权限访问管理系统'
					})
				}
			}else {
				res.json({
					status: 0,
					msg: '账号或密码错误'
				})
			}
		});
	});
});

// 检查登录状态，已改造
router.get('/check', function(req, res, next) {
	var user = req.session.user;
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
		});
	}
});

// 登出，已改造
router.get('/logout', function(req, res, next) {
	delete req.session.user;
	res.json({
		status: 1
	});
});

// 评论，未改造
router.post('/comment', function(req, res, next) {
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

// 删除用户
router.get('/delete/:id', function(req, res, next) {
	var user_id = req.params.id;
	if (user_id) {
		User.remove({ _id: user_id }, function(err, user) {
			if (err) {
				res.json({ status: 0 });
			}
			res.json({ status: 1 });
		});
	}else {
		res.json({ status: 0 });
	}
});

module.exports = router;
