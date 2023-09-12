const APIKey = "0dccb660b8ff3b1cd80b2c8036f3c8a3";
const cityFormEl = document.querySelector('#city-form');
const cityEl= document.getElementById("city-input");
const dayForecastListEl = document.querySelectorAll(".day-forecast");

function displayForecast(data){
  let dayWeatherList = data.list;
  let dayWeatherIndex = 0;
  let hours =8;
  dayForecastListEl.forEach(element => {
    let dayWeather =  dayWeatherList[dayWeatherIndex];
    let dayForecastElements = element.children;
    //day
    dayForecastElements[0].textContent = dayWeather.main.dt;
    //Weather icon
    dayForecastElements[1].textContent = dayWeather.weather.icon;
    //Temperture
    dayForecastElements[2].firstElementChild.textContent = dayWeather.main.temp;
    //Wind
    dayForecastElements[3].firstElementChild.textContent = dayWeather.wind.speed;
    //Humidity
    dayForecastElements[4].firstElementChild.textContent = dayWeather.main.humidity;
    dayWeatherIndex += hours;
    if (dayWeatherIndex >= dayWeatherList.length){
      dayWeatherIndex = dayWeatherList.length -1; // last index
    }
  }); 
  
}


function requestForecast(cityLat, cityLong){
  var requestForecasttUrl ="http://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon="+ cityLong + "&appid=" + APIKey;
  console.log(requestForecasttUrl);

  fetch(requestForecasttUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayForecast(data);
    });
}

var formSubmitHandler = function requestForecastByCity(event) {
  event.preventDefault();
  let cityName = cityEl.value.trim();
  console.log("City: " + cityName);

  if (cityName) {
    // Request City coodinates using Geocoding
    let requestCoodinatesUrl ="http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + APIKey;
    fetch(requestCoodinatesUrl)
      .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
              requestForecast(data[0].lat, data[0].lon);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      });
        
  } else {
    alert('Please enter a city name');
  }

  

}

cityFormEl.addEventListener('submit', formSubmitHandler);