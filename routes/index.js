var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var Comment = require('../models/comment');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('session:', req.session.user);
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		res.render('pages/index', {
			title: '首页',
			movies: movies
		});
	});
});

router.get('/movie/:id', function(req, res, next) {
	var id = req.params.id;

	Movie.findById(id, function(err, movie) {
		Comment
			.find({movie: id})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments) {
				res.render('pages/detail', {
					title: '电影详情:' + movie.title,
					movie: movie,
					comments: comments
				});
			});
	});
});

module.exports = router;
