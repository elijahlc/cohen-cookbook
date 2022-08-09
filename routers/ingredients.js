const express = require('express');
const app = express.Router();
const client = require('../db');

app.get('/', async (req, res, next) => {
	try {
		const response = await client.query(`
            SELECT * FROM ingredients
            ORDER BY name;
        `);

		const ingredients = response.rows;

		res.render('../views/ingredientsHome', { ingredients });
	} catch (err) {
		next(err);
	}
});

app.post('/', async (req, res, next) => {
	const { name } = req.body;

	try {
		await client.query(
			`
			INSERT INTO ingredients(name)
			VALUES($1)
			`,
			[name]
		);

		res.redirect('/ingredients');
	} catch (err) {
		next(err);
	}
});

app.get('/:id', async (req, res, next) => {
	const { id } = req.params;

	try {
		const response = await client.query(
			`
			SELECT recipes.id AS recipe_id, recipes.name AS recipe, ingredients.name AS ingredient FROM recipe_ingredients
			JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
			JOIN recipes ON recipe_ingredients.recipe_id = recipes.id
			WHERE recipe_ingredients.ingredient_id = $1;
		`,
			[id]
		);

		const matchingRecipes = response.rows;

		res.render('../views/ingredientDetails', { matchingRecipes });
	} catch (err) {
		next(err);
	}
});

module.exports = app;
