var apiKey = "55df0bfb703eebc6f491de4ed386bec6";
var today = moment().format("L");
// var searchHistoryList = [];

var dataFromLS = JSON.parse(localStorage.getItem("searchHistory"));

if (!dataFromLS) {
  localStorage.setItem(
    localStorage.getItem("searchHistory"),
    JSON.stringify([])
  );
}

function currentCondition(city) {
  var queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  fetch(queryURL)
    .then(function (Response) {
      return Response.json();
    })
    .then(function (data) {
      oneCallApi(data[0].lat, data[0].lon, data[0].name);
    });
}
function oneCallApi(lat, lon, city) {
  var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&units=metric&appid=${apiKey}`;

  fetch(oneCallUrl)
    .then(function (Response) {
      return Response.json();
    })
    .then(function (data) {
      console.log(data);
      $("#weatherContent").css("display", "block");
      $("#currentTemp").text("Temperature: " + data.current.temp + " F");
      $("#humidity").text("Humidity: " + data.current.humidity + " %");
      $("#uvindex").text("UV index: " + data.current.uvi);
      $("#windspeed").text("Wind Speed: " + data.current.wind_speed);
      buildFiveDayForecast(data.daily);
    });
}

function buildFiveDayForecast(array) {
  for (let index = 1; index < 6; index++) {
    var day = array[index];
    console.log(day);
    var dateDisplay = moment.unix(day.dt).format("ddd");
    console.log(dateDisplay);
    var col = $("<div>").addClass("col-2");
    var card = $("<div>").addClass("card");
    var title = $("<h3>").addClass("card-title").text(dateDisplay);
    var image = $("<img>").attr(
      "src",
      "http://openweathermap.org/img/wn/" + day.weather[0].icon + ".png"
    );

    $("#fiveDay").append(
      col.append(card.append(title.append(image, day.temp.day)))
    );
  }
}

$("#searchBtn").on("click", function () {
  var city = $("#enterCity").val().trim();

  var cityHistory = JSON.parse(localStorage.getItem("searchHistory"));

  cityHistory.push(city);

  localStorage.setItem("searchHistory", JSON.stringify(cityHistory));

  buildMenu(cityHistory);

  // if (searchHistoryList.indexOf(city) === -1) {
  //   searchHistoryList.push(city);
  //   localStorage.setItem("searchHistory", JSON.stringify(searchHistoryList));
  // }

  currentCondition(city);
});

function buildMenu(searchHistoryList) {
  searchHistoryList.forEach(function (city) {
    var button = $("<button>")
      .text(city)
      .val(city)
      .on("click", function () {
        currentCondition(city);
      });
    $("#searchHistory").append(button);
  });
}
