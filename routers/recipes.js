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

app.post('/', async (req, res, next) => {
	const { name, location, servings } = req.body;

	try {
		const newRecipe = await client.query(
			`
			INSERT INTO recipes(name, location, servings)
			VALUES($1, $2, $3)
			RETURNING id;
			`,
			[name, location, servings * 1]
		);

		res.redirect(`/recipes/${newRecipe.rows[0].id}`);
	} catch (err) {
		next(err);
	}
});

app.get('/:id', async (req, res, next) => {
	const { id } = req.params;

	try {
		const responseRecipe = await client.query(
			`
			SELECT name, location, servings, id FROM recipes
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

		const allTags = await client.query(
			`
			SELECT * FROM tags
			ORDER BY name;
			`
		);

		const allIngredients = await client.query(
			`
			SELECT * FROM ingredients
			ORDER BY name;
			`
		);

		const recipe = responseRecipe.rows[0];
		const ingredients = responseIngredients.rows;
		const tags = recipeTags.rows;
		const availableTags = allTags.rows;
		const availableIngredients = allIngredients.rows;

		let locationDetails;

		res.render('../views/recipeDetails', {
			recipe,
			ingredients,
			tags,
			locationDetails,
			availableTags,
			availableIngredients,
		});
	} catch (err) {
		next(err);
	}
});

app.post('/:id/tags', async (req, res, next) => {
	const { tagId } = req.body;
	const { id } = req.params;

	try {
		await client.query(
			`
			INSERT INTO recipe_tags(recipe_id, tag_id)
			VALUES($1, $2)
			`,
			[id * 1, tagId * 1]
		);

		res.redirect(`/recipes/${id}`);
	} catch (err) {
		next(err);
	}
});

app.post('/:id/ingredients', async (req, res, next) => {
	const { ingredientId } = req.body;
	const { id } = req.params;

	try {
		await client.query(
			`
			INSERT INTO recipe_ingredients(recipe_id, ingredient_id)
			VALUES($1, $2)
			`,
			[id * 1, ingredientId * 1]
		);

		res.redirect(`/recipes/${id}`);
	} catch (err) {
		next(err);
	}
});

module.exports = app;
