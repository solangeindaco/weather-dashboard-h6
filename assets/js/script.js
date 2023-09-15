const APIKey = "0dccb660b8ff3b1cd80b2c8036f3c8a3";
const cityFormEl = document.querySelector('#city-form');
const cityInputEl = document.querySelector('#city-input');
const cityEl= document.getElementById("city-input");
const dayForecastListEl = document.querySelectorAll(".day-forecast");
const searchedCitiesEl = document.getElementById("cities-container");
const messageToUserEl = document.getElementById("message-to-user");
const cityWeatherEl = document.getElementById("city-weather");

let cities = [];

let buttonClickHandler = function (event) {
  let cityName = event.target.textContent;
  console.log(cityName);
  let cityLatLon = JSON.parse(localStorage.getItem(cityName));
  console.log(cityLatLon);
  requestForecast(cityLatLon[0], cityLatLon[1]);
}


function saveCity(cityName){
  cities.push(cityName);
  console.log(cities);
  localStorage.setItem("cities", JSON.stringify(cities));
}

function appendNewCity(cityName){
  let cityBtn = document.createElement('button');
  cityBtn.setAttribute("class", "btn btn-secondary");
  cityBtn.textContent = cityName;
  cityBtn.addEventListener("click",buttonClickHandler);
  searchedCitiesEl.appendChild(cityBtn);
}

function displayForecast(data){
  hideInitMessage();
  showCityWeather();
  let dayWeatherList = data.list;
  let dayWeatherIndex = 0;
  let hours =8;
  dayForecastListEl.forEach(element => {
    let dayWeather =  dayWeatherList[dayWeatherIndex];
    let dayForecastElements = element.children;
    //day
    let date = moment.unix(dayWeather.dt).format("MM/DD/YYYY");
    dayForecastElements[0].textContent = element.hasAttribute("id","today-weather") ? (data.city.name + " " + date) : date;
    //Weather icon
    let weatherIconURL = "https://openweathermap.org/img/wn/" + dayWeather.weather[0].icon + ".png";
    dayForecastElements[1].setAttribute("src", weatherIconURL);
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
  var requestForecasttUrl ="https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon="+ cityLong + "&appid=" + APIKey;

  fetch(requestForecasttUrl)
    .then(function (response) {
      if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            displayForecast(data);
        });
      } else { alert('Error: ' + response.statusText);}
    });
}

var formSubmitHandler = function requestForecastByCity(event) {
  event.preventDefault();
  let cityName = cityEl.value.trim();

  if (cityName) {
    cityLatLon = localStorage.getItem(cityName);

    if (cityLatLon !== null){
      requestForecast(cityLatLon[0], cityLatLon[1]);
    }else{
    // Request City coodinates using Geocoding
      let requestCoodinatesUrl ="http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + APIKey;
      fetch(requestCoodinatesUrl)
        .then(function (response) {
          if (response.ok) {
              response.json().then(function (data) {
                console.log(data);
                requestForecast(data[0].lat, data[0].lon);
                localStorage.setItem(cityName, JSON.stringify([data[0].lat,data[0].lon]));
                saveCity(cityName);
                appendNewCity(cityName);
                
            });
          } else { alert('Error: ' + response.statusText);}
        });
    }
  }else {
    alert('Please enter a city name');
  }
    
}

function displaySearchedCities(){
  cities = JSON.parse(localStorage.getItem("cities"));
  if (cities !== null){
    for (i=0; i< cities.length; i++){
      appendNewCity(cities[i]);
    }
  }else{
    cities = [];
  }
}

function hideCityWeather(){
  cityWeatherEl.setAttribute("style","display:none");
}

function showCityWeather(){
  cityWeatherEl.setAttribute("style","display:block");
}

function hideInitMessage(){
  messageToUserEl.setAttribute("style","display:none");
}


cityFormEl.addEventListener('submit', formSubmitHandler);
displaySearchedCities();
hideCityWeather();