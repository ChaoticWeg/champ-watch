// TODO use promises instead

var pg    = require('pg');
var url   = process.env.DATABASE_URL;

// create a PreparedStatement to be used with query()
// who knows if this is really necessary, but it helps readability elsewhere.
var prepareStatement = exports.prepareStatement = function (name, text, values) {
	console.log('{ name:"%s", text:"%s", values:"%s" }', name, text, JSON.stringify(values));

	if (!name || !text || !values)
		throw 'must have name, text, AND values';

	return {
		name   : name,
		text   : text,
		values : values
	};
};

// query the database. to be used by all functions that make database calls.
// statement: prepared statement. use prepareStatement() for consistency.
// callback:  function (err, data) { ... }
var query = exports.query = function (statement, callback) {
	pg.connect(url, function (err, client, done) {
		if (err) { done(); return callback(err, null); }

		client.query(statement, function (err, data) {
			done();

			return callback(err, err ? null : data);
		});
	});
};

// you can't have my QUERIES
exports.QUERIES = require('./query-list.js').QUERIES; 
