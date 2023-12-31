const APIKey = "0dccb660b8ff3b1cd80b2c8036f3c8a3";
const cityFormEl = document.querySelector('#city-form');
const cityInputEl = document.querySelector('#city-input');
const cityEl= document.getElementById("city-input");
const dayForecastListEl = document.querySelectorAll(".day-forecast");
const searchedCitiesEl = document.getElementById("cities-container");
const messageToUserEl = document.getElementById("message-to-user");
const cityWeatherEl = document.getElementById("city-weather");

//this array will storage the cities searched by the user
let cities = [];

//It storage the city name, its latitud and longitud in the array cities
let buttonClickHandler = function (event) {
  let cityName = event.target.textContent;
  cityInputEl.value = cityName;
  let citySelected = cities.find((city) => city.name == cityName);
  requestForecast(citySelected.lat, citySelected.long);
}

function isSaved (cityName){
  return (cities.find((city) => city.name == cityName) != undefined);
}

//Save a city name, its latitude and longitude in the array cities and save the array to the local Storage
function saveCity(name, latitude, longitude){
  //Save a city. 
  let city = {name:name, lat: latitude, long: longitude};
  cities.push(city);
  localStorage.setItem("cities", JSON.stringify(cities));
}

//Append a new button to the list of seached city buttons
function appendNewCity(cityName){
  let cityBtn = document.createElement('button');
  cityBtn.setAttribute("class", "btn btn-secondary");
  cityBtn.textContent = cityName;
  cityBtn.addEventListener("click",buttonClickHandler);
  searchedCitiesEl.appendChild(cityBtn);
}

//Display the weather of the City in the current date and the 5-day followed.
function displayForecast(data){
  hideInitMessage();
  showCityWeather();
  let dayWeatherList = data.list;
  let dayWeatherIndex = 0;
  let hours =8;
  dayForecastListEl.forEach(element => {
    let dayWeather =  dayWeatherList[dayWeatherIndex];
    let dayForecastElements = element.children;
    //Get the date from the js library moment and displayed it in a the format "MM/DD/YYYY"
    let date = moment.unix(dayWeather.dt).format("MM/DD/YYYY");
    dayForecastElements[0].textContent = element.hasAttribute("id","today-weather") ? (data.city.name + " " + date) : date;
    //Add the Weather icon url to the image src
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

// Made a resquest of the weather of a city passing the latitude and longitude of that city
function requestForecast(cityLat, cityLong){
  var requestForecasttUrl ="https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon="+ cityLong + "&appid=" + APIKey;

  fetch(requestForecasttUrl)
    .then(function (response) {
      if (response.ok) {
          response.json().then(function (data) {
            displayForecast(data);
        });
      } else { alert('Error: ' + response.statusText);}
    });
}

// Made a resquest of the weather of a city passing the name of the city
let formSubmitHandler = function requestForecastByCity(event) {
  event.preventDefault();
  let cityName = cityEl.value.trim();

  if (cityName) {
    city = cities.find((city) => city.name == cityName);
    // If the city was already searched, it used the latitude and longitud storaged in the local storage
    if (city !== undefined){
      requestForecast(city.lat, city.long);
    }else{
    // Request City coodinates using Geocoding
      let requestCoodinatesUrl ="https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + APIKey;
      fetch(requestCoodinatesUrl)
        .then(function (response) {
          if (response.ok) {
              response.json().then(function (data) {
                requestForecast(data[0].lat, data[0].lon);
                if (!isSaved(cityName)){
                  saveCity(cityName,data[0].lat, data[0].lon);
                }
                appendNewCity(cityName);
                
            });
          } else { alert('Error: ' + response.statusText);}
        });
    }
  }else {
    alert('Please enter a city name');
  }
    
}

//Display the cities that already where searched as a list of buttons
function displaySearchedCities(){
  searchedCitiesEl.value ='';
  cities = JSON.parse(localStorage.getItem("cities"));
  if (cities !== null){
    for (i=0; i< cities.length; i++){
      appendNewCity(cities[i].name);
    }
  }else{
    cities = [];
  }
}

//Hide the html div that display the weather when the user first land on the page
function hideCityWeather(){
  cityWeatherEl.setAttribute("style","display:none");
}

//Show the html div that display the weather when the user first land on the page
function showCityWeather(){
  cityWeatherEl.setAttribute("style","display:block");
}
//Hide the html div that display the init message asking that the user enter a city name when the user first land on the page
function hideInitMessage(){
  messageToUserEl.setAttribute("style","display:none");
}

//Link the formSubmitHandler to the city form
cityFormEl.addEventListener('submit', formSubmitHandler);
displaySearchedCities();
hideCityWeather();