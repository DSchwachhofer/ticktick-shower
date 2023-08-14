var bodyEl = document.querySelector("body");

var xhr = new XMLHttpRequest();

var allData = {
  temp: 0,
  weather_icon: "01n",
  power: -100,
  task_list: [],
  weekly_tasks: [],
  task_type: "daily",
  habits: "",
};

function updateAll(data) {
  if (
    data["temp"] !== allData["temp"] ||
    data["weather_icon"] !== allData["weather_icon"]
  ) {
    weather.printWeather(data["temp"], data["weather_icon"]);
  }
  if (data["power"] !== allData["power"]) {
    solar.printPower(data["power"]);
  }

  // if (
  //   JSON.stringify(data["task_list"]) !==
  //     JSON.stringify(allData["task_list"]) ||
  //   JSON.stringify(data["weekly_tasks"]) !==
  //     JSON.stringify(allData["weekly_tasks"]) ||
  //   JSON.stringify(data["task_type"]) !== JSON.stringify(allData["task_type"])
  // ) {
  // tick.printTaskList(
  //   data["task_list"],
  //   data["weekly_tasks"],
  //   data["task_type"]
  // );
  // }
  habits.printHabitList(data["habits"]);

  allData = data;
}

// start clock
clock.startClock();

setStartTime();

var count = 0;

function getUpdate() {
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      count = 0;
      updateAll(JSON.parse(xhr.responseText));
    } else {
      count = count + 1;
      noData = {
        temp: "--",
        power: -100,
        task_list: [{ task_name: "SERVER NOT RUNNING" }],
      };
      if (count === 5) {
        updateAll(noData);
      }
    }
  };
  xhr.open("GET", "http://" + ip_address + ":7000/update");
  xhr.send();
}

getUpdate();
setInterval(getUpdate, 5000);
