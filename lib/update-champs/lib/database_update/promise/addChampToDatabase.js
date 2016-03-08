// addChampToDatabase.js
//
// create a new promise that retrieves champ data by id from riot and
// adds that champ to the database.


// global requires
var Promise  = require('promise');
var riot     = require('riot');
var database = require('database');


// function resolver (id)
// decides whether to resolve or reject the promise. returns the actual
// resolver that the Promise needs.
function resolver (id) {
	// attempt to retrieve champ info from riot, then add it to the database
	return function (resolve, reject) {
		// get champ info from riot
		riot.getChampInfoByID(id, function (data, response) {
			database.insertChamp(data, function (err, result) {
				if (err) throw err;

				resolve(data);
			});
		});

	}; // function (resolve, reject)
}; // resolver


// function getInstance ()
// creates and returns a new instance of the Promise
exports.getPromise = function (id) {
	var addChampToDatabase = new Promise(resolver(id));
	return addChampToDatabase;
};
