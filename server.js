const client = require('./db');
const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/recipes', require('./routers/recipes'));
app.use('/ingredients', require('./routers/ingredients'));
app.use('/tags', require('./routers/tags'));

app.get('/', (req, res) => {
	res.redirect('/recipes');
});

app.use((req, res, next) => {
	const err = new Error('Not found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500).send(`
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Cohen Cookbook</title>
			<link rel="stylesheet" href="../styles.css" />
		</head>
		<body>
			<header>
				<h1><a href="/recipes">Our Cookbook</a></h1>
				<nav>
					<a href="/recipes">Recipes</a>
					<a href="/ingredients">Ingredients</a>
					<a href="/tags">Tags</a>
				</nav>
			</header>
			<main class=error>
				<h2>Error! Tell Eli to fix something.</h2>
				<p>Error is: ${err} at ${req.path}</p>
			</main class=error>
			<footer>
				<div>made by <a href='https://github.com/elijahlc'>elijah</a> // august 2022</div>
			</footer>
		</body>
	</html>
	`);
});

const setup = () => {
	const port = process.env.PORT || 3000;

	app.listen(port, () => {
		console.log(`app listening on port ${port}`);
	});
};

setup();
