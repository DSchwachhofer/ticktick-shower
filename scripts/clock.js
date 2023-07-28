var dateTimeEl = document.getElementById("date-time")
var smallTimeEl = document.getElementById("small-time-container")
var clockPageEl = document.getElementById("clock-page")
var bigClockEl = document.getElementById("big-clock")

var clock = {
  formatTime(time) {
    if (time < 10) {
      return "0" + time
    }
    return time
  },

  getDateTime() {

    var t = new Date()
    var hours = clock.formatTime(t.getHours())
    var minutes = clock.formatTime(t.getMinutes())
    var day = clock.formatTime(t.getDate())
    var month = clock.formatTime(t.getMonth() + 1)
    var year = clock.formatTime(t.getFullYear())

    // var dateTime = day + "." + month + "." + year + " " + hours + ":" + minutes
    var dateTime = hours + ":" + minutes

    dateTimeEl.innerText = dateTime
    bigClockEl.innerText = dateTime
  },

  startClock() {
    setInterval(clock.getDateTime, 1000)
  }
}

smallTimeEl.addEventListener("click", function () {
  clockPageEl.style.display = "flex"
})

clockPageEl.addEventListener("click", function () {
  clockPageEl.style.display = "none"
})