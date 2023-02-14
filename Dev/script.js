const mainSearch = document.getElementById("main-search");
const time = document.getElementById("curr-time");
const date = document.getElementById("curr-date");
const city = document.getElementById("city");
const currentWeather = document.getElementById("current-weather-items");
const forecast = document.getElementById("forecast");
const currentTemp = document.getElementById("curr-temp");
const temp = document.getElementById("temp");
const recentSearches = document.getElementById("prev-searches");

let searchHistory = [];

const weatherAPI_KEY = "97f5a4d9f513a2319060a51d80b941e9";
const weatherApiRoot = "https://api.openweathermap.org";

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

  while (recentSearches.hasChildNodes()) {
    recentSearches.removeChild(recentSearches.firstChild);
  }
});

function displayWeatherData(data) {
  let { temp, humidity, wind_speed } = data.current;
  console.log(temp, humidity, wind_speed);

  currentWeather.innerHTML = `<div class="weater-item">
       <div>Current Temperature</div>
       <div>${temp}F</div>
      </div>
    <div class="weater-item">
      <div>Current Humidity</div>
      <div>${humidity}%</div>
    </div>
     <div class="weater-item">
      <div>Wind Speed</div>
      <div>${wind_speed}</div>
    </div>`;

  let fiveDayForecast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTemp.innerHTML = `
        <div class="current-day" id="current-temperature">
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
