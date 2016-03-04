// methods for interfacing with Riot REST API

var RestClient = require('node-rest-client').Client;
var client     = new RestClient();
var api_key    = process.env.RIOT_API_KEY;

var RESPONSE_CODES = require('./info.js').RESPONSE_CODES;
var urls = require('./info.js').urls;


// format a URL, inserting the given values where they are needed.
// includes the API key if one is not given in 'values'
var formatURL = exports.formatURL = function (url, values) {
	if (!values)
		throw 'formatURL requires values to be defined, even if empty';

	var result = url;

	// add the api key to the list of values if it doesn't already have it
	if (!values.api_key)
		values.api_key = api_key;

	// loop through each key in the associative array 'values', using RegExp to
	// replace any `${key}` with the associated `values[key]`
	for (var key in values) {
		var value = values[key];

		// replace ${key} with value
		var regex = new RegExp('\\\$\\\{' + key + '\\\}', 'ig');
		result = result.replace(regex, value);
	}

	return result;
};


// url:       the URL for the Riot REST call
//            !! WARNING: ASSUMES URL IS FORMATTED
// values:    the values to insert into the URL
// callback:  function (data, response) { ... }
var get = exports.get = function (url, callback) {
	client.get(url, function (data, response) {
		if (response.statusCode !== 200)
			throw RESPONSE_CODES[response.statusCode];

		return callback(data, response);
	});
};

// id:        the id of the champ to get info for
// callback:  function (data, response) { ... }
exports.getChampInfoByID = function (id, callback) {
	var url = formatURL(urls['champ-info'], { id: id });
	get(url, callback);
};

// callback:  function (data, response) { ... }
exports.getFreeChamps = function (callback) {
	var url = formatURL(urls['free-champs'], { /* just the api key */ });
	get(url, callback);
};

// callback: function (data, response) { ... }
exports.getAllChamps = function (callback) {
	var url = formatURL(urls['all-champs'], { /* just the api key */ });
	get(url, callback);
};

// callback: function (version) { ... }
exports.getDataDragonVersion = function (callback) {
	var url = formatURL(urls['dd-version'], { /* just the api key */ });
	get(url, function (data, response) {
		return callback(data[0]);
	});
}
