const pg = require('pg');

const client = new pg.Client({
	connectionString:
		process.env.DATABASE_URL || 'postgres://localhost/cohen_cookbook',
	ssl: {
		rejectUnauthorized: false,
	},
});

client.connect();

module.exports = client;
