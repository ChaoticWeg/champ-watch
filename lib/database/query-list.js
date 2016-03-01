/* TO BE IGNORED BY GIT. CONTAINS SENSITIVE QUERIES THAT SHOULD NOT BE
   PUBLISHED IF WE LIKE HAVING NICE THINGS. */


exports.QUERIES = {
	// champ handling
	insertChamp: 'INSERT INTO champs VALUES ($1::int, $2::text, $3::text, $4::boolean)',
	getChampByID: 'SELECT * FROM champs WHERE id=$1::int',
	setChampFreeStatusByID: 'UPDATE champs SET isfree=$1::boolean WHERE id=$2::int',
	getAllChamps: 'SELECT name, key FROM champs ORDER BY name ASC',
	getFreeChamps: 'SELECT * FROM champs WHERE isfree AND NOT name = ANY($1::text[]) ORDER BY name ASC',
	setExclusivelyFreeChamps_setNotFree: 'UPDATE champs SET isfree = false WHERE NOT id = ANY ($1::int[])',
	setExclusivelyFreeChamps_setFree: 'UPDATE champs SET isfree = true WHERE id = ANY ($1::int[])',

	// user handling
	createUser: 'INSERT INTO users (id, username) VALUES ($1::bigint, $2::text)',
	findUser: 'SELECT * FROM users WHERE id=$1::bigint',
	updateUserTrackedChamps: 'UPDATE users SET champs = $1::text[] WHERE id = $2::bigint'
};
