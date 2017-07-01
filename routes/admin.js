var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var Category = require('../models/category');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/movie');

// 添加电影，等待改造
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
								res.json({
									status: 1,
									msg: '电影修改成功！'
								});
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
										res.json({
											status: 1,
											msg: '电影修改成功！'
										});
									});
								});
							});
						});
					}else {
						res.json({
							status: 1,
							msg: '电影修改成功！'
						});
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
						res.json({
							status: 1,
							msg: '添加电影成功！'
						});
					});
				});
			});
		}else {
			_movie.save(function(err, movie) {
				movie_category = movieObj.category;
				if (!movie_category) {
					movie_category = '59570e6900e25f0a8306f64d';
				}
				Category.findById(movie_category, function(err, category) {
					category.movies.push(movie._id);
					category.save(function(err, category) {
						if (err) {
							console.log(err);
						}
						res.json({
							status: 1,
							msg: '添加电影成功！'
						});
					});
				});
			});
		}
	}
});

// 暂无用处
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

// 获取电影列表，已改造
router.get('/list', function(req, res, next) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		res.json(movies);
	});
});

// 删除电影，改造完成
router.delete('/list/:id', function(req, res, next) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id, function(err, movie) {
			var category_id = movie.category;
			Category.findById(category_id, function(err, category) {
				if (err) {
					console.log(err);
				}
				if (category) {
					category.movies.forEach(function(ele, idx) {
						if (ele.toString() === id.toString()) {
							category.movies.splice(idx, 1);
						}
					});
					category.save(function(err, category) {
						if (err) {
							console.log(err);
						}
						Movie.remove({_id: id}, function(err, movie) {
							if (err) {
								console.log(err);
								res.json({ status: 0 });
							}else {
								res.json({ status: 1 });
							}
						});
					});
				}else {
					Movie.remove({_id: id}, function(err, movie) {
						if (err) {
							console.log(err);
							res.json({ status: 0 });
						}else {
							res.json({ status: 1 });
						}
					});
				}
			});
		});
	}else {
		res.json({ status: 0 });
	}
});



module.exports = router;
