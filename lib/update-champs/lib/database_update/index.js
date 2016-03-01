var Promise  = require('promise');
var riot     = require('../../../riot');
var database = require('../../../database');

exports.begin = function (callback) {
	riot.getFreeChamps(function (data, response) {
		var champs = data.champions;

		var champsToCheck = champs.length;
		var calledBack    = false;

		// for each champ returned, create a check/insert promise
		champs.forEach(function (champ) {
			// create a promise that checks the database for a champ
			var champPromise = require('./promise/checkDatabaseForChamp.js').getPromise(champ.id);

			champPromise.done(function () {
				champsToCheck -= 1;
				if (champsToCheck === 0 && !calledBack) {
					calledBack = true;
					callback(champs);
				}
			});
		});
	});
};
