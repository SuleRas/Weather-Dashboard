var apiKey = "55df0bfb703eebc6f491de4ed386bec6";
var today = moment().format("L");
// var searchHistoryList = [];

buildMenu();

// checking if there's a place in local storage for search hsitory
var dataFromLS = JSON.parse(localStorage.getItem("searchHistory"));
if (!dataFromLS) {
  localStorage.setItem("searchHistory", JSON.stringify([]));
}

// getting current weather data
function currentCondition(city) {
  var queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  fetch(queryURL)
    .then(function (Response) {
      return Response.json();
    })
    .then(function (data) {
      // getting the location data by its coordinates
      oneCallApi(data[0].lat, data[0].lon, data[0].name);
    });
}

// getting the forecast
function oneCallApi(lat, lon, city) {
  var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&units=metric&appid=${apiKey}`;

  fetch(oneCallUrl)
    .then(function (Response) {
      return Response.json();
    })
    .then(function (data) {
      $("#weatherContent").css("display", "block");
      $("#currentTemp").text("Temperature: " + data.current.temp + " F");
      $("#humidity").text("Humidity: " + data.current.humidity + " %");
      $("#uvindex").text("UV index: " + data.current.uvi);
      $("#windspeed").text("Wind Speed: " + data.current.wind_speed);
      $("#fiveDay").empty();

      buildFiveDayForecast(data.daily);
    });
}

// building the 5 day forecast cards
function buildFiveDayForecast(array) {
  for (let index = 1; index < 6; index++) {
    var day = array[index];
    var dateDisplay = moment.unix(day.dt).format("ddd");
    var col = $("<div>").addClass("col-2");
    var card = $("<div>").addClass("card");
    var title = $("<h3>")
      .addClass("card-title")
      .text("Date: " + dateDisplay);
    var image = $("<img>").attr(
      "src",
      "http://openweathermap.org/img/wn/" + day.weather[0].icon + ".png"
    );

    $("#fiveDay").append(
      col.append(card.append(title.append(image, day.temp.day)))
    );
  }
}

// stroign the search hitory in local storage
$("#searchBtn").on("click", function () {
  var city = $("#enterCity").val().trim();

  var cityHistory = JSON.parse(localStorage.getItem("searchHistory"));

  var isCityInHistory = cityHistory.includes(city);

  if (!isCityInHistory) {
    cityHistory.push(city);
  }

  localStorage.setItem("searchHistory", JSON.stringify(cityHistory));

  buildMenu();

  currentCondition(city);
});

// displaying search history
function buildMenu(searchHistoryList) {
  $("#searchHistory").empty();

  var searchHistoryList = JSON.parse(localStorage.getItem("searchHistory"));

  if (!searchHistoryList) return;

  searchHistoryList.map(function (city) {
    var button = $("<button>")
      .text(city)
      .val(city)
      .on("click", function () {
        currentCondition(city);
      });
    $("#searchHistory").append(button);
  });
}
