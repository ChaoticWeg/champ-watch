var query   = require('./queries.js').query;
var QUERIES = require('./queries.js').QUERIES;
var prepareStatement = require('./queries.js').prepareStatement;



/**** CHAMP HANDLING ****/

// insert champ into the database
var insertChamp = exports.insertChamp = function (champ, callback) {
	// if champ.isFree isn't defined, assume it to be false
	if (!champ.isFree && champ.isFree !== false)
		champ.isFree = false;

	var statement = prepareStatement(
		'database#insertChamp',
		QUERIES.insertChamp,
		[ champ.id, champ.name, champ.key, champ.isFree ]
	);

	query(statement, callback);
};


// return champ info from the database, selected by id
var getChampByID = exports.getChampByID = function (id, callback) {
	var statement = prepareStatement(
		'database#getChampByID',
		QUERIES.getChampByID,
		[ id ]
	);

	query(statement, callback);
};


// set the isfree status of a champ, selected by id
var setChampFreeStatusByID = exports.setChampFreeStatusByID = function (id, isFree, callback) {
	var statement = prepareStatement(
		'database#setChampFreeStatusByID',
		QUERIES.setChampFreeStatusByID,
		[ isFree, id ]
	);

	query(statement, callback);
};


// get the free champs from database
var getFreeChamps = exports.getFreeChamps = function (callback) {
	var statement = prepareStatement(
		'database#getFreeChamps',
		QUERIES.getFreeChamps,
		[ ['Ashe', 'Garen'] ] // ignore these champs. they are always free.
	);

	query(statement, function (err, data) {
		// return nothing and error if there are no champs or if there is an error
		if (err || !data.rows || data.rows.length < 1)
			return callback(err, null);

		return callback(null, data.rows);
	});
};

// get all champs from database (just name and key. this is for account)
var getAllChamps = exports.getAllChamps = function (callback) {
	var statement = prepareStatement(
		'database#getAllChamps',
		QUERIES.getAllChamps,
		[]
	);

	query(statement, function (err, data) {
		if (err || !data.rows || data.rows.length < 1)
			return callback(err, null);

		return callback(null, data.rows);
	})
};


// set which champs are FREE. all others are NOT and will be updated
// accordingly.
var setExclusivelyFreeChamps = exports.setExclusivelyFreeChamps = function (ids, callback) {
	var setNotFree = prepareStatement(
		'database#setExclusivelyFreeChamps_setNotFree',
		QUERIES.setExclusivelyFreeChamps_setNotFree,
		[ ids ]
	);

	query(setNotFree, function (err, data) {
		if (err) callback(err, null);

		var setFree = prepareStatement(
			'database#setExclusivelyFreeChamps_setFree',
			QUERIES.setExclusivelyFreeChamps_setFree,
			[ ids ]
		);

		query(setFree, callback);
	})
};




/**** USER HANDLING ****/

var createUser = function (user, callback) {
	var statement = prepareStatement(
		'database#createUser',
		QUERIES.createUser,
		[ user.id, user.username ]
	);

	query(statement, function (err, data) {
		if (err)
			return callback(err, null);

		return callback(null, data);
	});
};

var findUser = exports.findUser = function (id, callback) {
	var statement = prepareStatement(
		'database#findUser',
		QUERIES.findUser,
		[ id ]
	);

	query(statement, function (err, data) {
		if (err)
			return callback(err, null);

		if (!data.rows || data.rows.length < 1)
			return callback(null, null);

		return callback(null, data.rows[0]);
	});
};

// TODO use a promise instead. helps readability.
var findOrCreateUser = exports.findOrCreateUser = function (user, callback) {
	// attempt to find user
	findUser(user.id, function (err, userdata) {
		// on err: abort and pass error up the chain
		if (err) return callback(err, null);

		// on data (not null): abort and return the user info retrieved from database
		if (userdata) return callback(null, userdata);

		// no error and no data so champ does not exist
		// add the user to the database using what was passed to the function
		createUser(user, function (err, data) {
			// on err: abort and pass error up the chain
			if (err) return callback(err, null);

			// no error: user should have been create successfully
			// return the user data passed to the function
			return callback(null, user);
		});
	})
};

var updateUserTrackedChamps = exports.updateUserTrackedChamps = function (user, callback) {
	var statement = prepareStatement(
		'database#updateUserTrackedChamps',
		QUERIES.updateUserTrackedChamps,
		[ user.champs, user.id ]
	);

	query(statement, function (err, data) {
		if (err) return callback(err, null);
		return callback(null, data);
	});
}
