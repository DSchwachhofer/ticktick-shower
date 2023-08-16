var bodyEl = document.querySelector("body");

var xhr = new XMLHttpRequest();

var allData = {
  temp: 0,
  weather_icon: "01n",
  power: -100,
  task_list: [],
  weekly_tasks: [],
  task_type: "habits",
  habits: "",
};

function updateAll(data) {
  weather.printWeather(data["temp"], data["weather_icon"]);
  solar.printPower(data["power"]);
  if (data["task_type"] === "habits") {
    habits.printHabitList(data["habits"]);
  } else {
    tick.printTaskList(
      data["task_list"],
      data["weekly_tasks"],
      data["task_type"]
    );
  }

  //
  // );
  // }

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
setInterval(getUpdate, 60000);
