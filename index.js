var webapp  = require('./lib/webserver');
var updater = require('./lib/update-champs');

webapp.listen(webapp.get('port'), function () {
	console.log('listening on port %d', webapp.get('port'));
	console.log('starting updater...');
	updater.start();
});
