var weatherEl = document.getElementById("weather-text")
var bigWeatherEl = document.getElementById("big-weather")

var xhr = new XMLHttpRequest();

var weatherTimerID

var weather = {
  printWeather(temp) {
    if (temp === "--") {
      weatherEl.innerText = "no server"
      bigWeatherEl.innerText = "-"
    } else {
      weatherEl.innerText = temp + "°C"
      bigWeatherEl.innerText = temp + "°C"
    }
  }
}