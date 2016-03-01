/* requires */
// system
var path     	= require('path');
var sizeof    = require('object-sizeof');
// express
var express  	= require('express');
var session		= require('express-session');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var app      	= express();
// passport
var passport	= require('passport');
// psql
var pg				= require('pg');
var pgSession	= require('connect-pg-simple')(session);
var database 	= require('../../../database');
/* end requires */


// locals
app.locals.buildImageURL = function (key) {
	return 'http://ddragon.leagueoflegends.com/cdn/6.4.1/img/champion/#{champ_key}.png'.replace('#{champ_key}', key);
};


// basics
app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, '/static')));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');


// session
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
// session cookie info
app.use(session({
	secret: 'weg-secret', resave: true, saveUninitialized: false,
	cookie: { expires: false },
	store: new pgSession({ pg: pg })
}));


// passport
passport.use(require('./passport-strategy.js'));
// serialize (object -> string)
passport.serializeUser(function (user, callback) {
	var ser = JSON.stringify(user);
	console.log('serialized: %s', ser);
	return callback(null, ser);
});
// deserialize  (string -> get user from database -> user)
passport.deserializeUser(function (str, callback) {
	database.findOrCreateUser(JSON.parse(str), function (err, user) {
		if (err) return callback(err, null);
		console.log('deserialized user %d (%s) - %d bytes', user.id, user.username, sizeof(user));
		return callback(null, user);
	});
});
// passport middleware
app.use(passport.initialize());
app.use(passport.session());


// our own middleware
function getListOfChamps (req, res, next) {
	database.getFreeChamps(function (err, champs) {
		if (err)
			return res.status(500).end('database error: ' + err);

		if (!champs || champs.length < 1)
			return res.status(500).end('no champs');

		req.champs = champs;
		return next();
	});
};

function getAllChamps (req, res, next) {
	database.getAllChamps(function (err, champs) {
		if (err)
			return res.status(500).end('database error: ' + err);

		if (!champs || champs.length < 1)
			return res.status(500).end('no champs');

		req.champs = champs;
		return next();
	});
};



// routing
app.get('/', getListOfChamps, function (req, res) {
	res.render('index', { champs: req.champs, user: req.user });
});

// passport login/logout routing
var redirects = { successRedirect: '/', failureRedirect: '/' };
app.get('/signin', passport.authenticate('twitter'));
app.get('/signin/return', passport.authenticate('twitter', redirects));
app.get('/signout', function (req, res) { req.logout(); res.redirect('/'); });

// account
app.get('/account', getAllChamps, ensureLoggedIn(), function (req, res) {
	var title = 'Account'
	res.render('account', { title: title, user: req.user, champs: req.champs });
});

app.post('/account/update', ensureLoggedIn(), function (req, res) {
	var user = req.user;
	user.champs = req.body.selected;

	database.updateUserTrackedChamps(user, function (err, data) {
		if (err) {
			console.log(err);
			return res.status(500).end('database error: ' + err);
		}

		return res.redirect('/account');
	});
});


exports = module.exports = app;
