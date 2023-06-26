var dateTimeEl = document.getElementById("date-time")

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

    var dateTime = day + "." + month + "." + year + " " + hours + ":" + minutes

    dateTimeEl.innerText = dateTime
  },

  startClock() {
    setInterval(clock.getDateTime, 1000)
  }
}

