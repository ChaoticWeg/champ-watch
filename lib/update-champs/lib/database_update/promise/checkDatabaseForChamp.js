// checkDatabaseForChamp.js
//
// create a new promise that checks the database and makes sure the
// free-to-play status of the champ is correct.
//
// if the champ is not in the database, starts a new addChampToDatabase
// promise and calls this promise's done whenever that promise is done.


// global requires
var Promise  = require('promise');
var riot     = require('../../../../riot');
var database = require('../../../../database');


// promise
var addChampToDatabase = require('./addChampToDatabase.js');


// function resolver (id)
// decides whether to resolve or reject the promise. returns the actual
// resolver that the Promise needs.
function resolver (id) {
	return function (resolve, reject) {
		// check the database for a champ with this info

		database.getChampByID(id, function (err, data) {
			if (err) throw err;

			if (!data.rows || data.rows.length < 1) {
				return addChampToDatabase.getPromise(id).done(resolve());
			}

			var champ = data.rows[0];
			resolve(champ);
		});
	} // function (resolve, reject)
}; // resolver (id)


// function getInstance ()
exports.getPromise = function (id) {
	var checkDatabaseForChamp = new Promise(resolver(id));
	return checkDatabaseForChamp;
};
