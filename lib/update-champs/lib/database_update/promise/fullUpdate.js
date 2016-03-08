var riot     = require('riot');
var Promise  = require('promise');
var database = require('database');
var _        = require('underscore');

var addChampToDatabase    = require('./addChampToDatabase.js').getPromise;

var getIDs = function (arr) {
	var result = _.pluck(arr, 'id').sort(function (a, b) { return a-b; });

	return result;
};

// get all champs from riot, check that each is in the database, react accordingly.
var updateAllChamps = function (accept, reject) {
	riot.getAllChamps(function (data) {
		var champs_Riot = data.champions;

		// check that we have the same number of champs as riot.
		// if we do, we don't need to update. (champ info doesn't change often, if at all.)
		// if we don't, do a full update
		database.getAllChamps(function (err, champs_DB) {

			console.log('riot has %d champs; we have %d', champs_Riot.length, champs_DB.length);

			// isolate champ IDs
			var ids_Riot    = getIDs(champs_Riot);
			var ids_DB      = getIDs(champs_DB);

			var ids_NotInDB = _.difference(ids_Riot, ids_DB);
			console.log('ids not in database: %s', ids_NotInDB.join(', '));

			if (ids_NotInDB.length === 0) {

				console.log('we have the same champs as riot; no checks to be made');
				return accept();

			} else {

				var doneCount = 0;

				// TODO need to actually update champs

				return accept();
			}
		});
	});
};

exports.getPromise = function (success, failure) {
	return new Promise(updateAllChamps).catch(failure).done(success);
};
