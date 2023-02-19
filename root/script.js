const mainSearch = document.getElementById("main-search");
const search = document.getElementById("search-btn");
const time = document.getElementById("curr-time");
const date = document.getElementById("curr-date");
const city = document.getElementById("city");
const currentWeather = document.getElementById("current-weather-items");
const forecast = document.getElementById("forecast");
const currentTemp = document.getElementById("curr-temp");
const temp = document.getElementById("temp");
const forecastContainer = document.getElementById("forecast-container");

const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const session = document.getElementById("session");

let searchHistory = [];

const weatherAPI_KEY = "97f5a4d9f513a2319060a51d80b941e9";
const weatherApiRoot = "https://api.openweathermap.org";

search.addEventListener("click", showAll);

function showAll () {
  forecastContainer.classList.remove("hide");
  forecast.classList.remove("hide");
}

function displayTime() {
  const dateTime = new Date();
  const hrs = dateTime.getHours();
  const min = dateTime.getMinutes();
  const sec = dateTime.getUTCSeconds();

  if (hrs >= 12) {
    session.innerHTML = "PM";
  } else {
    session.innerHTML = "AM";
  }

  hours.innerHTML = hrs;
  minutes.innerHTML = min;
  seconds.innerHTML = sec;
}

setInterval(displayTime, 10);

mainSearch.addEventListener("submit", (event) => {
  event.preventDefault();

  var cityInput = document.getElementById("city-search").value;
  console.log(`City: ${cityInput}`);

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${weatherAPI_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      var latitude = data.city.coord.lat;
      var longitude = data.city.coord.lon;
      console.log(latitude, longitude);

      fetch(
        `${weatherApiRoot}/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly&appid=${weatherAPI_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          displayWeatherData(data);
        });
    })
    .catch((error) => console.log(error));
});

function displayWeatherData(data) {
  let { temp, humidity, wind_speed } = data.current;

  

  let fiveDayForecast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTemp.innerHTML = `
        <div class="current-day" id="current-temperature">
        <h3>Today's Weather</h3>
        <div class="day">${window.moment(day.dt * 1000).format("dddd")}</div>
        <img src="http://openweathermap.org/img/wn/${
          day.weather[0].icon
        }@2x.png" alt="weather-icon" class="weather-picture">
        <div class="temp">${day.temp.day}F</div>
        <div class="humidity">Humidity: ${day.humidity}%</div>
        <div class="wind-speed">Wind: ${day.wind_speed}Mph</div>
      </div>
        `;
    } else if (idx >= 1 && idx <= 4) {
      fiveDayForecast += `
          <div class="weather-item">
          <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
          <img src="http://openweathermap.org/img/wn/${
            day.weather[0].icon
          }@2x.png" alt="weather-icon" class="weather-picture">
          <div class="temp">${day.temp.day}F</div>
          <div class="humidity">Humidity: ${day.humidity}%</div>
          <div class="wind-speed">Wind: ${day.wind_speed}Mph</div>
          </div>`;
    }
  });
  forecast.innerHTML = fiveDayForecast;
}
