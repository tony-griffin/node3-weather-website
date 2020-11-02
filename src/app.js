const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const request = require("postman-request");
require("dotenv").config();
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine, views  and partials location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Set up static directory to serve assets
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App Root",
    name: "Tony Griffin"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "My About Page",
    name: "Guess About me...?"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page!",
    name: "Help me!",
    helpText: "This is some helpful text"
  });
});

// Don't actually use this as we us app.use() with our static function
// app.get("", (req, res) => {
//   res.send();
// });

// app.get("/help", (req, res) => {
//   res.send({
//     name: "Tony",
//     age: 38
//   });
// });

// app.get("/about", (req, res) => {
//   res.send("<h1>About Weather</h1>");
// });

// app.get("/weather", (req, res) => {
//   if (!req.query.address) {
//     return res.send({
//       error: "You must provide an addresss!"
//     });
//   }
//   res.send({
//     forecast: "Sunny",
//     location: "London",
//     address: req.query.address
//   });
// });

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!"
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error }); //variable shorthand, hence only one error needed
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address
        });

        console.log(`The location is: ${location}`);
        console.log(forecastData);
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }
  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 - Help",
    name: "T. Griffin",
    errorMessage: "The help article cannot be found :-("
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "T. Griffin",
    errorMessage: "ERROR - Page Not Found"
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
