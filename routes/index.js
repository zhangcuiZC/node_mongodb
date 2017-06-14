var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/movie');

/* GET home page. */
router.get('/', function(req, res, next) {
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
		res.render('pages/detail', {
			title: '电影详情:' + movie.title,
			movie: movie
		});
	});
});

module.exports = router;
