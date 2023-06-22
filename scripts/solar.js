var powerTextEl = document.getElementById("power-text")

var xhr = new XMLHttpRequest();

var solarTimerId

var solar = {
  printPower(power) {
    if (power > -1) {
      powerTextEl.textContent = Number.parseFloat(power).toFixed(2) + "kw"
    } else {
      powerTextEl.textContent = "no server"
    }
  }
}