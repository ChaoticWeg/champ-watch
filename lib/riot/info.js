// possible response codes
exports.RESPONSE_CODES = {
	// 2xx (good)
	200: 'OK',

	// 4xx (bad, our fault)
	400: 'bad request',
	401: 'unauthorized',
	404: 'champ not found',
	429: 'rate limit exceeded',

	// 5xx (bad, not our fault)
	500: 'internal server error',
	503: 'service unavailable'
};

// useful URLs for API calls
exports.urls = {
	'free-champs' : 'https://na.api.pvp.net/api/lol/na/v1.2/champion?freeToPlay=true&api_key=${api_key}',
	'all-champs'  : 'https://na.api.pvp.net/api/lol/na/v1.2/champion?api_key=${api_key}',
	'champ-info'  : 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/${id}?api_key=${api_key}'
};
