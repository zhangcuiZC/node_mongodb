var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/movie');

var index = require('./routes/index');
var admin = require('./routes/admin');
var user = require('./routes/user');
var category = require('./routes/category');
var login_required = require('./libs/mw_login_required');
var admin_required = require('./libs/mw_admin_required');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	secret: 'zhangcui',
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
    ttl: 60 * 60 * 24,
    autoRemove: 'native'
	})
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
	var user = req.session.user;
	res.locals.user = user;
	next();
});

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, credentials");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json");
    next();
});

app.use('/', index);
app.use('/admin', admin);
// app.use('/admin', login_required, admin_required, admin);
app.use('/user', user);
app.use('/category', category);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
