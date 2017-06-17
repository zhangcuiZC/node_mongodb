module.exports = function(req, res, next) {
	var user = req.session.user;
	
	if (!user) {
		return res.redirect('/');
	}
	next();
};