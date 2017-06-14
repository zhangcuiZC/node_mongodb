var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('pages/index', {
		title: '首页',
		movies:[
			{
				title: '黑客帝国',
				_id: 1,
				poster: 'http://img7.doubanio.com/view/movie_poster_cover/lpst/public/p1910908765.webp'
			},
			{
				title: '黑客帝国',
				_id: 2,
				poster: 'http://img7.doubanio.com/view/movie_poster_cover/lpst/public/p1910908765.webp'
			},
			{
				title: '黑客帝国',
				_id: 3,
				poster: 'http://img7.doubanio.com/view/movie_poster_cover/lpst/public/p1910908765.webp'
			},
			{
				title: '黑客帝国',
				_id: 4,
				poster: 'http://img7.doubanio.com/view/movie_poster_cover/lpst/public/p1910908765.webp'
			}
		]
	});
});

router.get('/movie/:id', function(req, res, next) {
	res.render('pages/detail', {
		title: '电影详情',
		movie: {
			director: '莉莉·沃卓斯基 / 拉娜·沃卓斯基',
			country: '美国',
			title: '黑客帝国',
			year: '1999',
			poster: 'http://img7.doubanio.com/view/movie_poster_cover/lpst/public/p1910908765.webp',
			language: '英语',
			flash: "http://w3schools.com/tags/helloworld.swf",
			summary: '第二集中，尼奥（基努·里维斯 Keanu Reeves 饰）没有能从内部摧毁“母体”，他的身体在真实世界的飞船上陷于昏迷，思想却被困在介于“母体”和真实世界的中间地带，这个地方由“火车人”控制。墨菲斯（劳伦斯·菲什伯恩 Laurence Fishburne 饰）和崔妮蒂（凯瑞-安·莫斯 Carrie-Anne Moss 饰）等人知道了尼奥的情况，在守护天使的带领下， 找到了“火车人”的控制者梅罗纹奇，经过一番激斗，将尼奥救了出来。 此时，电子乌贼部队对锡安发起了猛烈的攻击，人类组织所有机甲战士展开顽强的抵抗，形势危在旦夕；尼奥和崔妮蒂驾驶了一艘飞船克服重重困难，到达机器城市，尼奥终于见到了机器世界的统治者“机器大帝”，双方谈判并达成了协议：尼奥除掉不受“母体”控制的史密斯，以换取锡安的和平。 '
		}
	});
});

module.exports = router;
