var weatherEl = document.getElementById("weather-text")

var xhr = new XMLHttpRequest();

var weatherTimerID

var weather = {
  printWeather(temp) {
    if (temp === "--") {
      weatherEl.innerText = "no server"
    } else {
      weatherEl.innerText = temp + "°C"
    }
  }
}