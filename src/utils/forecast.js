require("dotenv").config;
const request = require("postman-request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_STACK_API}&query=${latitude},${longitude}=m`;

  // const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,hourly,daily&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`;

  https: console.log("COORDINATES", latitude, longitude);

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Error: Could not connect to weather services", undefined);
    } else if (body.error) {
      callback(
        "Error: Could not find coordinates for location, please try again",
        undefined
      );
    } else {
      callback(
        undefined,
        `${body.current.weather_descriptions[0]}: It is currently ${body.current.temperature} degrees in ${body.location.name}. It feels like ${body.current.feelslike} degrees out.`

        //OPENWEATHERMAP:
        // `${body.current.weather[0].description}: It is currently ${body.current.temp} degrees in ${body.timezone}. It feels like ${body.current.feels_like} degrees out.`

        // Currently will only return weather for Mumbai, have tried different coordiates on the query url already and a different api key with no change in response values. Also tried the OpenWeatherMap api and get results  back for India also.
      );
    }
  });
};

module.exports = forecast;
