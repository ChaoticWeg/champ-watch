var riot     = require('riot');
var Promise  = require('promise');
var database = require('database');

var checkDatabaseForChamp = require('./checkDatabaseForChamp.js');

// get all champs from riot, check that each is in the database, react accordingly.
var updateAllChamps = function (accept, reject) {
	riot.getAllChamps(function (data) {
		var champs = data.champions;

		// check that we have the same number of champs as riot.
		// if we do, we don't need to update. (champ info doesn't change often, if at all.)
		// if we don't, do a full update
		database.getAllChamps(function (err, db_champs) {

			if (db_champs.length === champs.length) {

				console.log('we have the same number of champs as Riot does');
				console.log('no checks to be made');

				return accept();

			} else {

				champs.forEach(function (champ) {
					// check for champ. implicitly attempts to adds champ to database if not
					// found. accept promise on success, reject on failure.
					checkDatabaseForChamp.getPromise(champ.id).catch(reject()).done(accept());
				});

			}
		});
	});
};

exports.getPromise = function (success, failure) {
	return new Promise(updateAllChamps).catch(failure).done(success);
};
