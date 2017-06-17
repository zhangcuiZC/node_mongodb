module.exports = function(req, res, next) {
	var user = req.session.user;
	
	if (user.role < 200) {
		return res.redirect('/');
	}
	next();
};