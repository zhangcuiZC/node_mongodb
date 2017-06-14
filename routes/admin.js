var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/movie');

/* GET admin listing. */
router.get('/movie', function(req, res, next) {
	res.render('./pages/admin', {
		title: '电影录入',
		movie: {
			title: '',
			director: '',
			year: '',
			country: '',
			language: '',
			poster: '',
			flash: '',
			summary: '',
			_id: ''
		}
	});
});

router.post('/movie', function(req, res, next) {
	var id = req.body._id;
	var movieObj = req.body;
	var _movie = {};

	if (id) {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}
			Object.assign(movie, movieObj);
			movie.save(function(err, movie) {
				if (err) {
					console.log(err);
				}
				res.redirect('/movie/' + movie._id);
			});
		});
	}else {
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}
			res.redirect('/movie/' + movie._id);
		});
	}
});

router.get('/update/:id', function(req, res, next) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id, function(err, movie) {
			res.render('./pages/admin', {
				title: '更新电影信息',
				movie: movie
			})
		});
	}
});

router.get('/list', function(req, res, next) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		res.render('pages/list', {
			title: '电影列表',
			movies: movies
		});
	});
});

router.delete('/list/:id', function(req, res, next) {
	var id = req.params.id;
	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if (err) {
				console.log(err);
				res.json({ success: 0 });
			}else {
				res.json({ success: 1 });
			}
		});
	}else {
		res.json({ success: 0 });
	}
});

module.exports = router;
