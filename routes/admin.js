var express = require('express');
var router = express.Router();

/* GET admin listing. */
router.get('/movie', function(req, res, next) {
	res.render('./pages/admin', {
		title: '电影录入'
	});
});

router.get('/list', function(req, res, next) {
	res.render('./pages/list', {
  		title: '电影列表',
		movies: [{
			director: '莉莉·沃卓斯基 / 拉娜·沃卓斯基',
			country: '美国',
			title: '黑客帝国',
			year: '1999',
			language: '英语',
			createdAt: '2017-12-12',
		}]
	});
});

module.exports = router;
