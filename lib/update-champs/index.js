var database = require('./../../lib/database');
var updater  = require('./lib/database_update');
var delay    = parseInt(process.env.CHAMPS_UPDATE_DELAY_MS);

var timerNextRun = null;

function run () {
	var startTime = Date.now();

	updater.begin(function (champs) {
		var ids = isolateIDs(champs);

		database.setExclusivelyFreeChamps(ids, function (err) {
			console.log('updated database in %dms', Date.now() - startTime);

			// var nextStartTime = Date.now() + delay;
			// timerNextRun = setTimeout(run, nextStartTime - Date.now());
			// console.log('next update in %d minutes', Math.round(((nextStartTime - Date.now()) / 1000) / 60));
		});
	});
};

function isolateIDs (champs) {
	var result = [];
	for (var i in champs)
		result[i] = champs[i].id
	return result;
}

exports.start = function () { return run(); };
exports.stop  = function () { timerNextRun = clearTimeout(timerNextRun) || null; };
