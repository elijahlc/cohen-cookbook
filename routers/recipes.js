const express = require('express');
const app = express.Router();
const client = require('../db');

app.get('/', async (req, res, next) => {
	try {
		const response = await client.query(`
            SELECT * FROM recipes
            ORDER BY name;
        `);

		const recipes = response.rows;

		res.render('../views/recipesHome', { recipes });
	} catch (err) {
		next(err);
	}
});

app.get('/:id', async (req, res, next) => {
	const { id } = req.params;

	try {
		const responseRecipe = await client.query(
			`
			SELECT name, location, servings FROM recipes
			WHERE id=$1
			`,
			[id]
		);

		const responseIngredients = await client.query(
			`
			SELECT name FROM ingredients
			JOIN recipe_ingredients ON ingredients.id = recipe_ingredients.ingredient_id
			WHERE recipe_ingredients.recipe_id=$1;
			`,
			[id]
		);

		const recipeTags = await client.query(
			`
			SELECT name FROM tags
			JOIN recipe_tags ON tags.id = recipe_tags.tag_id
			WHERE recipe_tags.recipe_id=$1;
			`,
			[id]
		);

		const recipe = responseRecipe.rows[0];
		const ingredients = responseIngredients.rows;
		const tags = recipeTags.rows;

		let locationDetails;

		res.render('../views/recipeDetails', {
			recipe,
			ingredients,
			tags,
			locationDetails,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = app;
