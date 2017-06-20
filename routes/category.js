var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');

/* GET home page. */
router.get('/', function(req, res, next) {
	Category.find({}).populate({path: 'movies', options: {limit: 5}}).exec(function(err, categories) {
		if (err) {
			console.log(err);
		}
		res.render('pages/index', {
			title: '首页',
			categories: categories
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