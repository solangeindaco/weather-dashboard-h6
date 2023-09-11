var APIKey = "0dccb660b8ff3b1cd80b2c8036f3c8a3";
var cityFormEl = document.querySelector('#city-form');
var cityEl= document.getElementById("city-input");


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
      let cityLat = data[0].lat;
      let cityLong = data[0].lon;
      console.log(`Latitud: ${cityLat} Longitud ${cityLong}`);
      requestForecast(cityLat, cityLong);
    });

}

cityFormEl.addEventListener('submit', formSubmitHandler);