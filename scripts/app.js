var bodyEl = document.querySelector("body")

var xhr = new XMLHttpRequest();

var allData = {
  "temp": 0,
  "power": 0,
  "task_list": [],
  "dark_mode": "dark"
}

function updateAll(data) {
  if (data["temp"] !== allData["temp"]) {
    weather.printWeather(data["temp"])
  }
  if (data["power"] !== allData["power"]) {
    solar.printPower(data["power"])
  }
  if (JSON.stringify(data["task_list"]) !== JSON.stringify(allData["task_list"])) {
    tick.printTaskList(data["task_list"])
  }
  if (data["dark_mode"] === "dark") {
    bodyEl.style.backgroundColor = "black"
    bodyEl.style.color = "#14ff39"
  } else {
    bodyEl.style.backgroundColor = "#dcdcdc"
    bodyEl.style.color = "#141414"
  }


  allData = data
}

// start clock
clock.startClock()

setStartTime()

var count = 0

function getUpdate() {

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      count = 0
      updateAll(JSON.parse(xhr.responseText))
    } else {
      count = count + 1
      noData = {
        "temp": "--",
        "power": -1,
        "task_list": [{ task_name: "SERVER NOT RUNNING" }],
        "dark_mode": "dark"
      }
      if (count === 5) {
        updateAll(noData)
      }


    }
  };
  xhr.open("GET", "http://" + ip_address + ":7000/update")
  xhr.send();
}

getUpdate()
setInterval(getUpdate, 5000)