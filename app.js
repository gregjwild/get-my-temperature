const path = require('path'),
      express = require('express'),
      zipdb = require ('zippity-do-dah'),
      ForecastIo = require('forecastio');

const app = express();
const weather = new ForecastIo('ed51156c2f19383821fa3638d9c536d7');

// Static files
app.use(express.static(path.resolve(__dirname, "public")));

// Views
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
// Route: Index
app.get('/', (req, res) => res.render('index'));
// Route: Zipcode
app.get(/^\/(\d{5})$/, (req, res, next) => {
    const zipcode = req.params[0];
    const location = zipdb.zipcode(zipcode);
    
    if (!location.zipcode) {
        next();
        return;
    }

    const latitude = location.latitude;
    const longitude = location.longitude;

    weather.forecast(latitude, longitude, (err, data) => {
        if (err) {
            next();
            return;
        }

        res.json({
            zipcode: zipcode,
            temperature: data.currently.temperature
        });
    });
});
// Route: Not Found
app.use((req, res) => res.status(404).render("404"));

app.listen(3000);