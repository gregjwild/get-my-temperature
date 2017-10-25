const path = require('path'),
      express = require('express'),
      sensor = require('node-dht-sensor');

sensor.initialize(22, 12);

const app = express();

// Static files
app.use(express.static(path.resolve(__dirname, "public")));

// Routes
// Route: Index
app.get('/', (req, res) => res.sendFile('index'));

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
app.use((req, res) => res.status(404).sendFile(`${__dirname}/public/404.html`));

app.listen(3000);
