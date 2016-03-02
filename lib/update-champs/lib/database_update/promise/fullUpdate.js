var riot    = require('riot');
var Promise = require('promise');

var checkDatabaseForChamp = require('./checkDatabaseForChamp.js');

// get all champs from riot, check that each is in the database, react accordingly.
var updateAllChamps = function (accept, reject) {
	riot.getAllChamps(function (data) {
		var champs = data.champions;

		champs.forEach(function (champ) {
			// check for champ. implicitly attempts to adds champ to database if not
			// found. accept promise on success, reject on failure.
			checkDatabaseForChamp.getPromise(champ.id).catch(reject()).done(accept());
		});
	});
};

exports.getPromise = function (success, failure) {
	return new Promise(updateAllChamps).catch(failure).done(success);
};
