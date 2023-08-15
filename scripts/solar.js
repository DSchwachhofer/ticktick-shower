var powerTextEl = document.getElementById("power-text");

var xhr = new XMLHttpRequest();

var solarTimerId;

var solar = {
  printPower(power) {
    powerTextEl.classList.add("green");
    powerTextEl.classList.remove("red");
    if (power > -100) {
      if (power < 0) {
        powerTextEl.classList.add("red");
        powerTextEl.classList.remove("green");
      }
      powerTextEl.textContent = Number.parseFloat(power).toFixed(2) + "kw";
    } else {
      powerTextEl.textContent = "no server";
    }
  },
};
