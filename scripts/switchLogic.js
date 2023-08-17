var switchTaskBtn = document.getElementById("switch-task-btn");
var switchTaskEl = document.getElementById("switch-task-p");
var switchBtnText = "show weekly";
switchTaskEl.innerText = switchBtnText;

function switchTaskType(type) {
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Remove Task from Screen
      // console.log("Switching Task Type");
      getUpdate();
    }
  };
  xhr.open("GET", "http://" + ip_address + ":7000/switchtasktype?type=" + type);
  xhr.send();
}

switchTaskBtn.addEventListener("click", function () {
  if (switchBtnText === "show weekly") {
    // show weekly tasks
    switchBtnText = "show habits";
    tick.printTaskList(tasklistBackup, weeklyTasksBackup, "weekly");
    switchTaskType("weekly");
  } else {
    //  show habits
    switchBtnText = "show weekly";
    switchTaskType("habits");
  }
  switchTaskEl.innerText = switchBtnText;
});
