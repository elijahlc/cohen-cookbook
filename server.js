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

const setup = () => {
	const port = process.env.PORT || 3000;

	app.listen(port, () => {
		console.log(`app listening on port ${port}`);
	});
};

setup();
