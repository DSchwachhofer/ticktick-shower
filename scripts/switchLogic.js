var switchTaskBtn = document.getElementById("switch-task-btn");
var switchTaskEl = document.getElementById("switch-task-p");
var switchBtnText = "show weekly";
switchTaskEl.innerText = switchBtnText;

switchTaskBtn.addEventListener("click", function () {
  if (switchBtnText === "show weekly") {
    switchBtnText = "show habits";
    console.log("SHOWING WEEKLY");
    tick.printTaskList(tasklistBackup, weeklyTasksBackup, "weekly");
    tick.switchTaskType("weekly");
  } else {
    switchBtnText = "show weekly";
    console.log("SHOWING HABITS");
    // tick.printTaskList(tasklistBackup, weeklyTasksBackup, "daily");
    // tick.switchTaskType("daily");
    habits.printHabitList();
  }
  console.log(switchBtnText);
  switchTaskEl.innerText = switchBtnText;
});
