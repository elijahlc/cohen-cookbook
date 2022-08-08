const pg = require('pg');

const client = new pg.Client(
	process.env.DATABASE_URL || 'postgres://localhost/cohen_cookbook'
);

client.connect();

module.exports = client;