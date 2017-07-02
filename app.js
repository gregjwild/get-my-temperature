const path = require('path'),
      express = require('express'),
      zipdb = require ('zippity-do-dah'),
      ForecastIo = require('forecastio'),
      logger = require('morgan');
      

let sensor = require('node-dht-sensor');
sensor.initialize(22, 12);

const app = express();
const weather = new ForecastIo('ed51156c2f19383821fa3638d9c536d7');

// Static files
app.use(express.static(path.resolve(__dirname, "public")));

//Middlewares
app.use(logger('short'));

// Views
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
// Route: Index
app.get('/', (req, res) => res.render('index'));
// Route: getStats
app.get('/getStats', (req, res, next) => {
	
	let temperature = sensor.read().temperature.toFixed(2);
	let humidity = sensor.read().humidity.toFixed(2);
	
	res.json({
		temperature,
		humidity
	});

});
// Route: Not Found
app.use((req, res) => res.status(404).render("404"));

app.listen(3000);
