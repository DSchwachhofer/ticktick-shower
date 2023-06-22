var taskContainer = document.querySelector(".task-container")

var xhr = new XMLHttpRequest();

var tickTimerId

var tick = {
  printTaskList(tasklist) {
    taskContainer.innerHTML = ""
    if (tasklist.length === 0) {
      var taskEL = document.createElement("p")
      taskEL.setAttribute("class", "task")
      taskEL.innerText = "you have finished all tasks for today"
    }
    else {
      for (var i = 0; i < tasklist.length; i++) {
        console.log(tasklist)
        var taskEL = document.createElement("p")
        taskEL.setAttribute("class", "task")
        taskEL.innerText = "□ " + tasklist[i]["task_name"]
        taskContainer.appendChild(taskEL)
        taskEL.addEventListener("touchstart", function () {
          this.style.textDecoration = "line-through"
        })
        taskEL.addEventListener("click", this.completeTask.bind(this, tasklist[i]["id"], tasklist[i]["project_id"], taskEL))
      }
    }
  },
  completeTask(id, projectId, taskEL) {
    console.log("completing task with ID" + id)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Remove Task from Screen
        console.log("Taks successfully removed")
      }
    }
    xhr.open("GET", "http://" + ip_address + ":7000/completetask?id=" + id + "&projectid=" + projectId)
    xhr.send();
  }
}





