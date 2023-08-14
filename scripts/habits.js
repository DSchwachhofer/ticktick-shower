var habitsContainer = document.querySelector(".task-container");

var habitColors = ["#00FFFF", "#FFFF00", "#FF00FF", "#0000FF", "#800080"];

var repetitionOptions = [1, 2, 3, 4, 5, 6];

var durationOptions = ["Day", "Week", "Month", " Year"];

var habitGreenColor = "#39ff14";
var habitRedColor = "#C63300";

var showModal = false;

var habitData = [
  {
    habit: "Zähneputzen",
    percentage: 1,
    color: habitColors[Math.floor(Math.random() * habitColors.length)],
    repetition: 1,
    duration: "Day",
    id: 1,
  },
  {
    habit: "Nasenspray Morgens",
    percentage: 0.1,
    color: habitColors[Math.floor(Math.random() * habitColors.length)],
    repetition: 1,
    duration: "Day",
    id: 2,
  },
  {
    habit: "Rasieren",
    percentage: 0.5,
    color: habitColors[Math.floor(Math.random() * habitColors.length)],
    repetition: 2,
    duration: "Week",
    id: 3,
  },
  {
    habit: "Auto Waschen",
    percentage: 0.9,
    color: habitColors[Math.floor(Math.random() * habitColors.length)],
    repetition: 6,
    duration: "Year",
    id: 4,
  },
  {
    habit: "Freunde Treffen",
    percentage: 1.2,
    color: habitColors[Math.floor(Math.random() * habitColors.length)],
    repetition: 1,
    duration: "Month",
    id: 5,
  },
];

function sortListOfHabits(habitList) {
  var sortedList = [...habitList];
  sortedList.sort(function (a, b) {
    return b.percentage - a.percentage;
  });
  return sortedList;
}

// function to handle switch button logic
function switchBtn(options, currentVal) {
  // get index of current value.
  var currentIndex = options.findIndex(function (el) {
    return el === currentVal;
  });
  // check if is last index of array.
  if (currentIndex === options.length - 1) {
    //  return value of first index.
    return options[0];
  }
  // return value of next index.
  return options[currentIndex + 1];
}

function repetitionBtnHandler(habit, btnEl) {
  var nextValue = switchBtn(repetitionOptions, habit.repetition);
  btnEl.innerText = nextValue;
  habit.repetition = nextValue;
}

function durationBtnHandler(habit, btnEl) {
  var nextValue = switchBtn(durationOptions, habit.duration);
  btnEl.innerText = nextValue;
  habit.duration = nextValue;
}

function colorBtnHandler(habit, btnEl) {
  var nextValue = switchBtn(habitColors, habit.color);
  btnEl.style.backgroundColor = nextValue;
  habit.color = nextValue;
}

var habits = {
  // function to show UI to create/edit habits
  createEditHabit(data) {
    showModal = true;
    var repetitionBtnText = repetitionOptions[0];
    var durationBtnText = durationOptions[0];
    var colorBtnColor =
      habitColors[Math.floor(Math.random() * habitColors.length)];
    var newHabit = {
      habit: "",
      percentage: 0,
      color: "",
      repetition: 1,
      duration: "Day",
      id: Math.random(),
    };
    if (data.type === "edit") {
      repetitionBtnText = data.habitData.repetition;
      durationBtnText = data.habitData.duration;
      colorBtnColor = data.habitData.color;
      newHabit = Object.assign({}, data.habitData);
    }

    // console.log(newHabit);

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
      "habit-ui-color-div habit-ui-inner-div button"
    );
    colorDiv.style.backgroundColor = colorBtnColor;

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
    if (data.type === "edit") {
      habitInput.setAttribute("value", data.habitData.habit);
    }

    // create duration ui
    var repetitionButton = document.createElement("div");
    repetitionButton.setAttribute(
      "class",
      "habit-rep-button habit-ui-div-style button"
    );
    repetitionButton.innerText = repetitionBtnText;

    var repetitionText = document.createElement("div");
    repetitionText.setAttribute("class", "habit-rep-text-div");
    repetitionText.innerText = "per";

    var durationButton = document.createElement("div");
    durationButton.setAttribute(
      "class",
      "habit-rep-button habit-ui-div-style button"
    );
    durationButton.innerText = durationBtnText;

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

    // event listeners for buttons:
    repetitionButton.addEventListener(
      "click",
      repetitionBtnHandler.bind(this, newHabit, repetitionButton)
    );

    durationButton.addEventListener(
      "click",
      durationBtnHandler.bind(this, newHabit, durationButton)
    );
    colorDiv.addEventListener(
      "click",
      colorBtnHandler.bind(this, newHabit, colorDiv)
    );

    cancelBtn.addEventListener("click", function () {
      showModal = false;
      habits.printHabitList();
    });

    okBtn.addEventListener("click", function () {
      newHabit.habit = habitInput.value;
      // update habits list
      console.log(newHabit);
      showModal = false;
      habits.printHabitList();
    });
  },

  printHabitList() {
    if (showModal) {
      return;
    }
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
      this.showHabit(habit);
    }

    headerAdd.addEventListener("click", this.createNewHabitHandler);
  },

  showHabit(habit) {
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
    if (habit.percentage > 1) {
      habitEL.style.color = habitRedColor;
    }
    // habitEL.style.color = habit.color;
    habitEL.innerText = "□ " + habit.habit;
    innerDiv.appendChild(habitEL);

    // create gear symbol.
    habitGearEl = document.createElement("p");
    habitGearEl.setAttribute("class", "habit-p button");
    if (habit.percentage > 1) {
      habitGearEl.style.color = habitRedColor;
    }
    habitGearEl.innerHTML = "✎";
    innerDiv.appendChild(habitGearEl);

    // create chart bar
    var habitBar = document.createElement("div");
    habitBar.setAttribute("class", "habit-bar");
    habitBar.style.width = habit.percentage * 100 + "%";
    if (habit.percentage >= 0.9 && habit.percentage <= 1) {
      habitBar.style.backgroundColor = habitGreenColor;
    } else if (habit.percentage > 1) {
      habitBar.style.backgroundColor = habitRedColor;
      habitBar.style.width = "100%";
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
    habits.createEditHabit({ type: "create" });
  },

  editHabitHandler(habit) {
    habits.createEditHabit({ type: "edit", habitData: habit });
  },
  completeHabitHandler(habit) {
    console.log("completing " + habit.habit);
  },
};