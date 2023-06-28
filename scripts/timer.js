var countdownEL = document.getElementById("countdown")
var timerStartBtn = document.getElementById("timer-start-btn")
var timerStartText = document.querySelector("#timer-start-btn p")
var timerCancelBtn = document.getElementById("timer-cancel-btn")
var timerCancelText = document.querySelector("#timer-cancel-btn p")
var shouldWorkEl = document.getElementById("should-work")
var pomAmountEl = document.getElementById("pom-amount")

// CONSTANTS:
var WORKTIME = 10 //* 60
var SHORT_BREAK = 5 //* 60
var LONG_BREAK = 15 //* 60
var breaksCounter = 0
var currentTimerIsWork = true

var timerId

var timerIsRunning = false
var timerCountDown = 0

var audio = new Audio()


//function to play audio files.
function playAudio(file) {
  var filePath = "./assets/" + file + ".mp3"
  audio.src = filePath
  // audio = new Audio(filePath);
  audio.play();
}

function setStartTime() {
  timerCountDown = WORKTIME
  displayTimeLeft()
}

function displayTimeLeft() {
  var minutes = Math.floor(timerCountDown / 60)
  var seconds = clock.formatTime(timerCountDown % 60)
  countdownEL.innerText = minutes + ":" + seconds
}

function displayPomAmount() {
  var pomAmount = breaksCounter % 4
  if (pomAmount === 0) {
    pomAmountEl.innerText = "-"
  } else {
    var text = " "
    for (var i = 0; i < pomAmount; i++) {
      text = text + "√ "
    }
    pomAmountEl.innerText = text
  }
}

function runTimer() {
  timerCountDown -= 1
  if (timerCountDown === 0) {
    playAudio("c")
    clearInterval(timerId)
    timerStartText.innerText = "start"
    timerCancelText.innerText = "reset"
    timerIsRunning = false
    currentTimerIsWork = !currentTimerIsWork
    if (currentTimerIsWork) {
      timerCountDown = WORKTIME
      shouldWorkEl.innerText = "start work"
    } else {
      breaksCounter += 1
      displayPomAmount()
      shouldWorkEl.innerText = "start break"
      if (breaksCounter % 4 === 0) {
        timerCountDown = LONG_BREAK
      } else {
        timerCountDown = SHORT_BREAK
      }
    }
  }
  displayTimeLeft()
}

function continueTimer() {
  displayPomAmount()
  playAudio("silence")
  timerCancelBtn.style.display = "flex"
  timerCancelText.innerText = "cancel"
  timerStartText.innerText = "pause"
  if (currentTimerIsWork) {
    shouldWorkEl.innerText = "work"
  } else {
    shouldWorkEl.innerText = "don't work"
  }
  timerId = setInterval(runTimer, 1000)
}

function pauseTimer() {
  timerStartText.innerText = "continue"
  shouldWorkEl.innerText = "paused"
  clearInterval(timerId)
}

function cancelTimer() {
  if (timerCancelText.innerText === "reset") {
    breaksCounter = 0
    displayPomAmount()
    timerCancelBtn.style.display = "none"
  }
  shouldWorkEl.innerText = "start work"
  timerCancelText.innerText = "reset"
  clearInterval(timerId)
  timerStartText.innerText = "start"
  timerCountDown = WORKTIME
  timerIsRunning = false
  currentTimerIsWork = true
  displayTimeLeft()
}


function startStopHandler() {
  if (!timerIsRunning) {
    continueTimer()
  } else {
    pauseTimer()
  }
  timerIsRunning = !timerIsRunning
}

function cancelHandler() {
  cancelTimer()
}



timerStartBtn.addEventListener("click", startStopHandler)
timerCancelBtn.addEventListener("click", cancelHandler)