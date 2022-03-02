let totalTimeElapsed = 0;
let isTimerOn = false;
let timerId = false;
let prevLapTime = 0;
let lapCount = 0;

const stopwatch = document.getElementById("stopwatch");
const startBtn = document.getElementById("startBtn");
const lapBtn = document.getElementById("lapBtn");
const lapsContainer = document.getElementById("lapsContainer");

startBtn.addEventListener("click", function (event) {
  if (isTimerOn) {
    //> turn timer off

    clearInterval(timerId);
    timerId = null;
    if (totalTimeElapsed != 0) {
      startBtn.innerHTML = "Resume";
      startBtn.style.backgroundColor = "orange";

      lapBtn.innerHTML = "Reset";
      lapBtn.style.backgroundColor = "red";
    }
    isTimerOn = false;
  } else {
    //> turn timer on

    timerId = setInterval(function () {
      totalTimeElapsed++;

      stopwatch.innerHTML = toHHMMSS(totalTimeElapsed);

      if (isTimerOn != 0) {
        lapBtn.disabled = false;
        lapBtn.innerHTML = "Lap";
        lapBtn.style.backgroundColor = "skyblue";

        startBtn.innerHTML = "Stop";
        startBtn.style.backgroundColor = "crimson";
      }

      isTimerOn = true;
    }, 1000);
  }
});

lapBtn.addEventListener("click", function (event) {
  if (isTimerOn) {
    let lapTime = toHHMMSS(totalTimeElapsed - prevLapTime);

    let overallTime = toHHMMSS(totalTimeElapsed);

    prevLapTime = totalTimeElapsed;

    lapCount++;

    if (lapCount < 10 || lapCount == 0) {
      lapCount = "0" + lapCount;
    }

    const lapDiv = document.createElement("div");
    const lapCountDiv = document.createElement("div");
    const lapTimeDiv = document.createElement("div");
    const overallTimeDiv = document.createElement("div");

    lapDiv.appendChild(lapCountDiv);
    lapDiv.appendChild(lapTimeDiv);
    lapDiv.appendChild(overallTimeDiv);
    lapsContainer.appendChild(lapDiv);

    lapDiv.setAttribute("class", "lapDiv");

    lapCountDiv.innerHTML = lapCount;
    lapTimeDiv.innerHTML = lapTime;
    overallTimeDiv.innerHTML = overallTime;
  } else {
    clearInterval(timerId);
    timerId = null;

    startBtn.innerHTML = "Start";
    startBtn.style.backgroundColor = "lightgreen";

    lapBtn.innerHTML = "Lap";
    lapBtn.disabled = true;
    lapBtn.style.backgroundColor = "#cccccc";

    totalTimeElapsed = 0;
    stopwatch.innerHTML = toHHMMSS(totalTimeElapsed);

    lapsContainer.innerHTML = "";
    prevLapTime = 0;
    lapCount = 0;
    isTimerOn = false;
  }
});

function toHHMMSS(time) {
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time - hours * 3600) / 60);
  let seconds = time - hours * 3600 - minutes * 60;

  if (seconds < 10 || seconds == 0) {
    seconds = "0" + seconds;
  }
  if (minutes < 10 || minutes == 0) {
    minutes = "0" + minutes;
  }
  if (hours < 10 || hours == 0) {
    hours = "0" + hours;
  }

  return hours + ":" + minutes + ":" + seconds;
}
