let totalTimeElapsed = 00;
let isTimerOn = false;
let timerId = false;

const startBtn = document.getElementById("startBtn");
const lapBtn = document.getElementById("lapBtn");

const hourDiv = document.getElementById("hour");
const hourRightDiv = document.getElementById("hourRight");

const minDiv = document.getElementById("minute");
const minRightDiv = document.getElementById("minuteRight");

const secDiv = document.getElementById("second");
const secRightDiv = document.getElementById("secondRight");

startBtn.addEventListener("click", function (event) {
  if (isTimerOn) {
    //> turn timer off

    clearInterval(timerId);
    startBtn.innerHTML = "Start";
    isTimerOn = false;
  } else {
    //> turn timer on

    timerId = setInterval(function () {
      totalTimeElapsed++;

      let hour = parseInt(totalTimeElapsed / 3600);
      let min = parseInt(totalTimeElapsed / 60);
      let sec = totalTimeElapsed % 60;

      if (hour < 10) {
        hourRightDiv.innerHTML = hour;
      } else {
        hourDiv.innerHTML = hour;
      }

      if (min < 10) {
        minRightDiv.innerHTML = min;
      } else {
        minDiv.innerHTML = min;
      }

      if (sec < 10) {
        secRightDiv.innerHTML = sec;
      } else {
        secDiv.innerHTML = sec;
      }

      startBtn.innerHTML = "Stop";
      isTimerOn = true;
    }, 1000);
  }
});
