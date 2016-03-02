var database = require('./lib/database');
var riot     = require('./lib/riot');
var webapp   = require('./lib/webserver');
var updater  = require('./lib/update-champs');

var start = function () {
	webapp.listen(webapp.get('port'), function () {
		console.log('listening on port %d', webapp.get('port'));
		console.log('starting updater...');

		updater.start();
	});
};

var error = function (err) {
	if (err) throw err;
};

var Promise    = require('promise');
var fullUpdate = updater.promise.fullUpdate;
fullUpdate.getPromise(start, error);
