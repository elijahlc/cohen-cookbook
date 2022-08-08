CREATE TABLE recipes(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    servings INT
);

CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE ingredients(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE recipe_ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id),
    ingredient_id INT REFERENCES ingredients(id)
);

CREATE TABLE recipe_tags(
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id),
    tag_id INT REFERENCES tags(id)
);

INSERT INTO recipe_ingredients(recipe_id, ingredient_id)
VALUES (3, 3);

INSERT INTO recipe_ingredients(recipe_id, ingredient_id)
VALUES (2, 3);

INSERT INTO recipe_ingredients(recipe_id, ingredient_id)
VALUES (1, 4);

INSERT INTO recipe_ingredients(recipe_id, ingredient_id)
VALUES (3, 5);

INSERT INTO recipe_ingredients(recipe_id, ingredient_id)
VALUES (2, 2);

SELECT recipes.* , tags.name AS tag FROM recipe_tags
JOIN tags ON recipe_tags.tag_id = tags.id
JOIN recipes ON recipe_tags.recipe_id = recipes.id
WHERE recipe_tags.tag_id = 2;