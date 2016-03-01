var Strategy = require('passport-twitter').Strategy;

var database = require('../../../database');

exports = module.exports = new Strategy(
	{
		consumerKey    : process.env.TWITTER_CONSUMER_KEY,
		consumerSecret : process.env.TWITTER_CONSUMER_SECRET,
		callbackURL    : process.env.TWITTER_CALLBACK_URL
	},

	function (token, tokenSecret, profile, callback) {
		var data = { id: profile.id, username: profile.username };
		database.findOrCreateUser(data, function (err, user) {
			// on err: abort and pass error up the chain
			if (err) return callback(err, null);

			// no error: continue
			return callback(null, user);
		});
	}
);
