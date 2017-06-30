var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');

// 分类
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

// 添加分类，已改造
router.post('/add', function(req, res, next) {
	var _category = req.body;
	var category = new Category({
		name: _category.category_name
	});

	category.save(function(err, category) {
		if (err) {
			res.json({
				status: 0,
				msg: '添加分类失败'
			});
		}
		res.json({
			status: 1,
			msg: '添加分类成功'
		});
	});
});

// 查看分类列表，已改造
router.get('/list', function(req, res, next) {
	Category.fetch(function(err, categories) {
		var categoryList = [];
		categories.forEach(function(val, idx) {
			var item = {};
			item._id = val._id;
			item.name = val.name;
			item.movies = val.movies.length;
			item.meta = val.meta;
			categoryList.push(item);
		});
		res.json(categoryList);
	})
});

module.exports = router;