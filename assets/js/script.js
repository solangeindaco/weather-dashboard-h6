var APIKey = "0dccb660b8ff3b1cd80b2c8036f3c8a3";
var city= document.getElementById("city-input");
var searchBtn = document.getElementById("search-btn");


function getApi() {
  // fetch request gets a list of all the repos for the node.js organization
  let city = "San Francisco"
  var requesForecasttUrl ="http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
  console.log(requesForecasttUrl);

  fetch(requesForecasttUrl)
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

//searchBtn.addEventListener('click', getApi);
getApi();