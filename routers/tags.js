const express = require('express');
const app = express.Router();
const client = require('../db');

app.get('/', async (req, res, next) => {
	try {
		const response = await client.query(`
            SELECT * FROM tags
            ORDER BY name;
        `);

		const tags = response.rows;

		res.render('../views/tagsHome', { tags });
	} catch (err) {
		next(err);
	}
});

app.get('/:id', async (req, res, next) => {
	const { id } = req.params;

	try {
		const response = await client.query(
			`
			SELECT recipes.id AS recipe_id, recipes.name AS recipe, tags.name AS tag FROM recipe_tags
			JOIN tags ON recipe_tags.tag_id = tags.id
			JOIN recipes ON recipe_tags.recipe_id = recipes.id
			WHERE recipe_tags.tag_id = $1;
			`,
			[id]
		);

		const matchingRecipes = response.rows;

		res.render('../views/tagDetails', { matchingRecipes });
	} catch (err) {
		next(err);
	}
});

module.exports = app;
