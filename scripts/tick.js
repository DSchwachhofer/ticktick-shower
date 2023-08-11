var taskContainer = document.querySelector(".task-container");

var xhr = new XMLHttpRequest();

var tickTimerId;

var tasklistBackup = [];
var weeklyTasksBackup = [];

var tick = {
  printTaskList(tasklist, weeklyTasks, taskType) {
    taskContainer.innerHTML = "";
    tasklistBackup = tasklist;
    weeklyTasksBackup = weeklyTasks;
    if (taskType === "daily") {
      if (tasklist.length === 0) {
        var taskEL = document.createElement("p");
        taskEL.setAttribute("class", "task");
        taskEL.innerText = "you have finished all tasks for today";
        taskContainer.appendChild(taskEL);
      } else {
        var headerEL = document.createElement("p");
        headerEL.setAttribute("class", "task");
        headerEL.innerText = "Daily Tasks:";
        taskContainer.appendChild(headerEL);
        for (var i = 0; i < tasklist.length; i++) {
          // console.log(tasklist)
          var taskEL = document.createElement("p");
          taskEL.setAttribute("class", "task button");
          taskEL.innerText = "□ " + tasklist[i]["task_name"];
          taskContainer.appendChild(taskEL);
          taskEL.addEventListener("click", function () {
            this.style.textDecoration = "line-through";
          });
          taskEL.addEventListener(
            "click",
            this.completeTask.bind(
              this,
              tasklist[i]["id"],
              tasklist[i]["project_id"],
              taskEL
            )
          );
        }
      }
    } else {
      if (weeklyTasks.length === 0) {
        var taskEL = document.createElement("p");
        taskEL.setAttribute("class", "task");
        taskEL.innerText = "you have finished all tasks for this week";
        taskContainer.appendChild(taskEL);
      } else {
        var headerEL = document.createElement("p");
        headerEL.setAttribute("class", "task");
        headerEL.innerText = "Weekly Tasks:";
        taskContainer.appendChild(headerEL);
        for (var i = 0; i < weeklyTasks.length; i++) {
          // console.log(weeklyTasks)
          var taskEL = document.createElement("p");
          taskEL.setAttribute("class", "task button");
          taskEL.innerText = "□ " + weeklyTasks[i]["task_name"];
          taskContainer.appendChild(taskEL);
          taskEL.addEventListener("click", function () {
            this.style.textDecoration = "line-through";
          });
          taskEL.addEventListener(
            "click",
            this.completeTask.bind(
              this,
              weeklyTasks[i]["id"],
              weeklyTasks[i]["project_id"],
              taskEL
            )
          );
        }
      }
    }
  },
  completeTask(id, projectId, taskEL) {
    // console.log("completing task with ID" + id)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Remove Task from Screen
        console.log("Task successfully removed");
      }
    };
    xhr.open(
      "GET",
      "http://" +
        ip_address +
        ":7000/completetask?id=" +
        id +
        "&projectid=" +
        projectId
    );
    xhr.send();
  },

  switchTaskType(type) {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Remove Task from Screen
        console.log("Switching Task Type");
      }
    };
    xhr.open(
      "GET",
      "http://" + ip_address + ":7000/switchtasktype?type=" + type
    );
    xhr.send();
  },

  updateTasks() {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Remove Task from Screen
        console.log("Updating Tasks");
      }
    };
    xhr.open("GET", "http://" + ip_address + ":7000/update");
    xhr.send();
  },
};
