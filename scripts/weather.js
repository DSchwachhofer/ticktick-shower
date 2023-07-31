var weatherEl = document.getElementById("weather-text")
var weatherIconEl = document.getElementById("weather-icon")
var bigWeatherEl = document.getElementById("big-weather")
var bigWeatherIconEl = document.getElementById("big-weather-icon")

var xhr = new XMLHttpRequest();

var weatherTimerID

var weather = {
  printWeather(temp, icon) {
    if (temp === "--") {
      weatherEl.innerHTML = "no server"
      weatherEl.style.left = 0
      weatherIconEl.classList.add("none")
      bigWeatherEl.innerHTML = "-"
    } else {
      weatherIconEl.classList.remove("none")
      weatherEl.style.left = "5%"
      weatherEl.innerHTML = Math.round(temp) + "°C"
      weatherIconEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
      bigWeatherEl.innerText = temp + "°C"
      bigWeatherIconEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    }
  }
}