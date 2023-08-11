var habitsContainer = document.querySelector(".task-container");

var habitColors = [
  "#39ff14",
  "#00FFFF",
  "#FFFF00",
  "#FF00FF",
  "#0000FF",
  "#800080",
];

var repetitionOptions = [1, 2, 3, 4, 5, 6];

var durationOptions = ["Day", "Week", "Month", " Year"];

var habitRedColor = "#C63300";

var habitData = [
  {
    habit: "Zähneputzen",
    percentage: 1,
    color: habitColors[Math.floor(Math.random() * habitColors.length)],
    id: 1,
  },
  {
    habit: "Nasenspray Morgens",
    percentage: 0.1,
    color: habitColors[Math.floor(Math.random() * habitColors.length)],
    id: 2,
  },
  {
    habit: "Rasieren",
    percentage: 0.5,
    color: habitColors[Math.floor(Math.random() * habitColors.length)],
    id: 3,
  },
];

function sortListOfHabits(habitList) {
  var sortedList = [...habitList];
  sortedList.sort(function (a, b) {
    return b.percentage - a.percentage;
  });
  console.log(habitData);
  console.log(sortedList);
  return sortedList;
}

var habits = {
  // function to show UI to create/edit habits
  createEditHabit(data) {
    habitsContainer.innerHTML = "";
    // create Header:
    var headerText = "";
    if (data.type === "edit") {
      headerText = 'Edit "' + data.habitData.habit + '":';
    } else {
      headerText = "Create New Habit:";
    }

    var header = document.createElement("p");
    header.setAttribute("class", "task");
    header.innerText = headerText;
    habitsContainer.appendChild(header);

    var uiContainer = document.createElement("div");
    uiContainer.setAttribute("class", "habit-ui-container");
    habitsContainer.appendChild(uiContainer);

    var habitInputDiv = document.createElement("div");
    habitInputDiv.setAttribute(
      "class",
      "habit-ui-div-style habit-ui-inner-div habit-input-div"
    );

    var durationDiv = document.createElement("div");
    durationDiv.setAttribute(
      "class",
      "habit-ui-button-container habit-ui-inner-div"
    );

    var colorDiv = document.createElement("div");
    colorDiv.setAttribute(
      "class",
      "habit-ui-div-style habit-ui-inner-div button"
    );
    colorDiv.style.backgroundColor = habitColors[0];

    var buttonDiv = document.createElement("div");
    buttonDiv.setAttribute(
      "class",
      "habit-ui-inner-div habit-ui-button-container"
    );

    uiContainer.appendChild(habitInputDiv);
    uiContainer.appendChild(durationDiv);
    uiContainer.appendChild(colorDiv);
    uiContainer.appendChild(buttonDiv);

    // create input to define habit name
    var habitInput = document.createElement("input");
    habitInput.setAttribute("class", "habit-input");
    habitInput.setAttribute("placeholder", "type name");

    // create duration ui
    var repetitionButton = document.createElement("div");
    repetitionButton.setAttribute(
      "class",
      "habit-rep-button habit-ui-div-style button"
    );
    repetitionButton.innerText = repetitionOptions[0];

    var repetitionText = document.createElement("div");
    repetitionText.setAttribute("class", "habit-rep-text-div");
    repetitionText.innerText = "per";

    var durationButton = document.createElement("div");
    durationButton.setAttribute(
      "class",
      "habit-rep-button habit-ui-div-style button"
    );
    durationButton.innerText = durationOptions[0];

    // create ok and cancel Buttons
    var cancelBtn = document.createElement("div");
    cancelBtn.setAttribute(
      "class",
      "habit-ui-button habit-ui-div-style button"
    );
    cancelBtn.innerText = "Cancel";
    var okBtn = document.createElement("div");
    okBtn.setAttribute("class", "habit-ui-button habit-ui-div-style button");
    okBtn.innerText = "Ok";

    habitInputDiv.appendChild(habitInput);
    durationDiv.appendChild(repetitionButton);
    durationDiv.appendChild(repetitionText);
    durationDiv.appendChild(durationButton);
    buttonDiv.appendChild(cancelBtn);
    buttonDiv.appendChild(okBtn);
  },

  printHabitList() {
    habitsContainer.innerHTML = "";

    var headerEL = document.createElement("div");
    headerEL.setAttribute("class", "habit-inner-div");
    habitsContainer.appendChild(headerEL);

    //create header
    var header = document.createElement("p");
    header.setAttribute("class", "task");
    header.innerText = "Habits:";
    headerEL.appendChild(header);

    //create add symbol
    var headerAdd = document.createElement("p");
    headerAdd.setAttribute("class", "task button");
    headerAdd.innerText = "+";
    headerEL.appendChild(headerAdd);

    var sortedHabits = sortListOfHabits(habitData);

    for (var habit of sortedHabits) {
      this.createHabit(habit);
    }

    headerAdd.addEventListener("click", this.createNewHabitHandler);
  },

  createHabit(habit) {
    // create div for habbit.
    var habitDiv = document.createElement("div");
    habitsContainer.appendChild(habitDiv);

    // create inner div to style text and gear symbol
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class", "habit-inner-div");
    habitDiv.appendChild(innerDiv);

    // create p element inside
    var habitEL = document.createElement("p");
    habitEL.setAttribute("class", "habit-p button");
    if (habit.percentage === 1) {
      habitEL.style.color = habitRedColor;
    }
    // habitEL.style.color = habit.color;
    habitEL.innerText = "□ " + habit.habit;
    innerDiv.appendChild(habitEL);

    // create gear symbol.
    habitGearEl = document.createElement("p");
    habitGearEl.setAttribute("class", "habit-p button");
    if (habit.percentage === 1) {
      habitGearEl.style.color = habitRedColor;
    }
    habitGearEl.innerHTML = "✎";
    innerDiv.appendChild(habitGearEl);

    // create chart bar
    var habitBar = document.createElement("div");
    habitBar.setAttribute("class", "habit-bar");
    habitBar.style.width = habit.percentage * 100 + "%";
    if (habit.percentage === 1) {
      habitBar.style.backgroundColor = habitRedColor;
    } else {
      habitBar.style.backgroundColor = habit.color;
    }
    habitDiv.appendChild(habitBar);

    habitEL.addEventListener(
      "click",
      this.completeHabitHandler.bind(this, habit)
    );

    habitGearEl.addEventListener(
      "click",
      this.editHabitHandler.bind(this, habit)
    );
  },

  createNewHabitHandler() {
    console.log("creating new habit ...");
    habits.createEditHabit({ type: "create" });
  },

  editHabitHandler(habit) {
    console.log("editing " + habit.habit);
    habits.createEditHabit({ type: "edit", habitData: habit });
  },
  completeHabitHandler(habit) {
    console.log("completing " + habit.habit);
  },
};
