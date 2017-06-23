var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var User = require('../models/user');
var Category = require('../models/category');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/movie');

/* GET admin listing. */
router.get('/', function(req, res, next) {
	res.redirect('/admin/list');
});


router.get('/movie', function(req, res, next) {
	Category.fetch(function(err, categories) {
		if (err) {
			console.log(err);
		}
		res.render('./pages/admin', {
			title: '电影录入',
			movie: {
				title: '',
				director: '',
				category: '',
				year: '',
				country: '',
				language: '',
				poster: '',
				flash: '',
				summary: '',
				_id: ''
			},
			categories: categories
		});
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

			if (movieObj.newCategory) {
				var category = new Category({
					name: movieObj.newCategory,
					movies: [movie._id]
				});

				category.save(function(err, new_category) {
					movie.category = new_category._id;
					movie.save(function(err, movie) {
						Category.findById(movieObj.prev_category, function(err, prev_category) {
							prev_category.movies.forEach(function(ele, idx) {
								if (ele.toString() === movie._id.toString()) {
									prev_category.movies.splice(idx, 1);
								}
							});
							prev_category.save(function(err, prev_category) {
								if (err) {
									console.log(err);
								}
								res.redirect('/movie/' + movie._id);
							});
						});
					});
				});
			}else {
				movie.save(function(err, movie) {
					if (err) {
						console.log(err);
					}
					if (movieObj.prev_category.toString() !== movieObj.category.toString()) {
						Category.findById(movieObj.prev_category, function(err, prev_category) {
							prev_category.movies.forEach(function(ele, idx) {
								if (ele.toString() === movie._id.toString()) {
									prev_category.movies.splice(idx, 1);
								}
							});
							prev_category.save(function(err, prev_category) {
								Category.findById(movieObj.category, function(err, category) {
									category.movies.push(movie._id);
									category.save(function(err, category) {
										if (err) {
											console.log(err);
										}
										res.redirect('/movie/' + movie._id);
									});
								});
							});
						});
					}else {
						res.redirect('/movie/' + movie._id);
					}
				});
				
			}
		});
	}else {
		_movie = new Movie({
			director: movieObj.director,
			category: movieObj.category,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});
		if (movieObj.newCategory) {
			var category = new Category({
				name: movieObj.newCategory
			});
			category.save(function(err, new_category) {
				_movie.category = new_category._id;
				_movie.save(function(err, movie) {
					new_category.movies.push(movie._id);
					new_category.save(function(err, new_category) {
						if (err) {
							console.log(err);
						}
						res.redirect('/movie/' + movie._id);
					});
				});
			});
		}else {
			_movie.save(function(err, movie) {
				Category.findById(movieObj.category, function(err, category) {
					category.movies.push(movie._id);
					category.save(function(err, category) {
						if (err) {
							console.log(err);
						}
						res.redirect('/movie/' + movie._id);
					});
				});
			});
		}
	}
});

router.get('/update/:id', function(req, res, next) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id, function(err, movie) {
			Category.fetch(function(err, categories) {
				res.render('./pages/admin', {
					title: '更新电影信息',
					movie: movie,
					categories: categories
				});
			});
		});
	}
});

router.get('/list', function(req, res, next) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		// res.render('pages/list', {
		// 	title: '电影列表',
		// 	movies: movies
		// });
		res.json(movies);
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

router.get('/userlist', function(req, res, next) {

	User.fetch(function(err, users) {
		// res.render('pages/userlist', {
		// 	title: '注册用户列表',
		// 	users: users
		// });
		res.json(users);
	});
});

router.get('/category', function(req, res, next) {
	res.render('pages/category', {
		title: '添加分类',
		
	});
});

router.post('/category', function(req, res, next) {
	var _category = req.body;
	var category = new Category({
		name: _category.category_name
	});

	category.save(function(err, category) {
		if (err) {
			console.log(err);
		}
		res.redirect('/admin/catelist');
	});
});

router.get('/catelist', function(req, res, next) {
	Category.fetch(function(err, categories) {
		// res.render('pages/catelist', {
		// 	title: '分类列表',
		// 	categories: categories
		// });
		var categoryList = [];
		categories.forEach(function(val, idx) {
			var item = {};
			item._id = val._id;
			item.name = val.name;
			item.movies = val.movies.length;
			item.meta = val.meta;
			categoryList.push(item);
		});
		console.log(categoryList);
		res.json(categoryList);
	})
});

module.exports = router;
