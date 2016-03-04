var database = require('./lib/database');
var riot     = require('./lib/riot');
var webapp   = require('./lib/webserver');
var updater  = require('./lib/update-champs');

// called whenever full update succeeds
var start = function () {
	// get datadragon version from riot
	riot.getDataDragonVersion(function (version) {
		process.env.DDRAGON_VERSION = version;
		console.log('DataDragon version %s', process.env.DDRAGON_VERSION);

		// start the webapp, and then start the updater
		webapp.listen(webapp.get('port'), function () {
			console.log('listening on port %d', webapp.get('port'));

			console.log('starting updater...');
			updater.start();
		});
	});
};

// called whenever full update fails
// TODO: handle gracefully
var error = function (err) {
	if (err) throw err;
};

var fullUpdate = updater.promise.fullUpdate;
fullUpdate.getPromise(start, error);
