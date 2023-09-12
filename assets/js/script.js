var APIKey = "0dccb660b8ff3b1cd80b2c8036f3c8a3";
var cityFormEl = document.querySelector('#city-form');
var cityEl= document.getElementById("city-input");

var dateEl = document.getElementById("date");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidityEl = document.getElementById("humidity");
var iconEl = document.getElementById("weather-icon");


function requestForecast(cityLat, cityLong){
  var requestForecasttUrl ="http://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon="+ cityLong + "&appid=" + APIKey;
  console.log(requestForecasttUrl);

  fetch(requestForecasttUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      //Loop over the data to generate a table, each table row will have a link to the repo url
      let dayWeatherList = data.list;
      let dayWeather =  dayWeatherList[0];
      dateEl.textContent = dayWeather.main.dt;
      tempEl.textContent = dayWeather.main.temp;
      windEl.textContent = dayWeather.wind.speed;
      humidityEl.textContent = dayWeather.main.humidity;
      iconEl.textContent = dayWeather.weather.icon;
      for (var i = 0; i < data.length; i++) {
      }
    });
}

var formSubmitHandler = function requestForecastByCity(event) {
  event.preventDefault();
  let cityName = cityEl.value.trim();
  console.log("City: " + cityName);

  // Request City coodinates using Geocoding
  let requestCoodinatesUrl ="http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + APIKey;
  fetch(requestCoodinatesUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      requestForecast(data[0].lat, data[0].lon);
    });

}

cityFormEl.addEventListener('submit', formSubmitHandler);