// object to map API weather observations to the respective icon
const weatherIcons = {
  "Clear sky": "images/Clearsky.svg",
  "Partly cloudy": "images/Partlycloudy.svg",
  "Cloudy": "images/Cloudy.svg",
  "Overcast": "images/Overcast.svg",
  "Light rain": "images/Lightrain.svg",
  "Rain": "images/Rain.svg",
  "Light sleet": "images/Lightsleet.svg",
  "Sleet": "images/Sleet.svg",
  "Light snow": "images/Lightsnow.svg",
  "Snow": "images/Snow.svg",
  "Rain showers": "images/Rainshowers.svg",
  "Sleet showers": "images/Sleetshowers.svg",
  "Snow showers": "images/Snowshowers.svg",
  "Dust devil": "images/Dustdevil.svg",
  "Dust storm": "images/Duststorm.svg",
  "Blowing snow": "images/Blowingsnow.svg",
  "Fog": "images/Fog.svg",
  "Light drizzle": "images/Lightdrizzle.svg",
  "Drizzle": "images/Drizzle.svg",
  "Freezing rain": "images/Freezingrain.svg",
  "Hail": "images/Hail.svg",
  "Light thunder": "images/Lightthunder.svg",
  "Thunder": "images/Thunder.svg",
};

// pure function that takes a comma-separated value string (CSV) as a parameter and returns an array of objects that represent the data
const parseCsv = (csv) => {
  // split on newline characters and remove empty lines with filter
  const lines = csv.split('\n').filter((line) => line);

  // split first line on comma to get CSV headers
  const headers = lines[0].split(',');

   // loop through rest of lines
  const result = lines.slice(1).map((line) => {
    const obj = {};

    // set headers as object keys
    headers.forEach((header) => { obj[header] = null; });

    // split line on commas
    line.split(',').forEach((data, i) => {
      obj[Object.keys(obj)[i]] = data;
    });

    return obj;
  });

  return result;
};

// async function that uses fetch to get observation data from weather API
const getWeatherObservation = async () => { // my boyfriend made me a CORS proxy, how cute!
  // here I use await on the fetch promise to wait for the API response
  let response = await fetch('https://vedurproxy.hallur.io/?op_w=xml&type=obs&lang=en&view=csv&ids=1&time=3h'); // returns promise

  // get the response body from the API
  const text = await response.text();

  // parse CSV response to JavaScript object
  const data = parseCsv(text);

  return data;
};

// async function that uses fetch to get forecast data from weather API
const getWeatherForecast = async () => {
  let response = await fetch('https://vedurproxy.hallur.io/?op_w=xml&type=forec&lang=en&view=csv&ids=1&anytime=1');

  const text = await response.text();
  const data = parseCsv(text);

  return data;
};

// function that updates the clock timer for you
const updateClock = () => {
  const time = new Date().toLocaleTimeString("en-GB", { timeZone: "UTC" });
  document.querySelector("#clock").innerText = time;
};

// get the current weekday and show it in the page
const weekday = new Date().toLocaleString("default", { weekday: "long" });
document.querySelector("#weekday").innerText = weekday;

// update the clock timer when the page is loaded and also every 1 seconds
updateClock();
setInterval(updateClock, 1000);

// get weather observation data from API using "then", "catch" and "finally" on the async function
let observationData;
getWeatherObservation()
  .then((result) => { observationData = result[0]; }) // "then" is executed if the getWeatherObservation function was successful
  .catch(() => { observationData = {}; }) // "catch" is executed if the getWeatherObservation function threw an error
  .finally(() => { // "finally" is always executed after "then" or "catch"
    // hide loader
    document.querySelector("#observation-loader").classList.add("hide-loader");

    // update weather observation elements with observation data from API
    document.querySelector("#weather-icon").src = weatherIcons[observationData.Weather];
    document.querySelector("#main-weather-description").innerText = observationData.Weather;
    document.querySelector("#temperature").innerText =  Math.round(observationData["Temperature (°C)"]) + "°c";
    document.querySelector("#wind").innerText = "Wind " + observationData["Wind speed (m/s)"] + " m/s";
    document.querySelector("#visibility").innerText = "Visibility " + observationData["Visibility (km)"] + " km";
    document.querySelector("#wind-direction").innerText = "Wind direction " + observationData["Wind direction"];
    document.querySelector("#precipitation").innerText = "Precipitation " + observationData["Precipitation during last hour (mm / 1 h)"] + " mm/h";
  });


// get weather forecast data from API
let forecastData;
getWeatherForecast()
  .then((result) => { forecastData = result; })
  .catch(() => { forecastData = 'Error'; })
  .finally(() => {
    // loop exactly 4 times
    for (let i = 1; i <= 4; i++) {
      // get current date and add "i" days to it
      const d = new Date();
      const dayOfMonth = d.getDate();
      d.setDate(dayOfMonth + i);

      // get current date string in the format "YYYY-MM-DD HH:mm:ss"
      const dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} 12:00:00`;

      // find the forecast data for the respective day at twelve o'clock
      const data = forecastData.find((item) => item["Forecast time"] === dateStr);

      // update the forecast panel with forecast data from the API
      const panel = document.querySelector(`.forecast-container .forecast:nth-child(${i})`);
      panel.querySelector(".loader").classList.add("hide-loader");
      panel.querySelector(".weekday").innerText = d.toLocaleString("en-GB", { weekday: "long" });
      panel.querySelector(".weather-icon").src = weatherIcons[data.Weather];
      panel.querySelector(".temperature").innerText = data["Temperature (°C)"] + "°c";
      panel.querySelector(".weather-description").innerText = data.Weather;
    }
  });
