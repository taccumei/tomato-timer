document.addEventListener('DOMContentLoaded', () => {
  switchMode('pomodoro');
})

const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 10,
  longBreakInterval: 4,
  session: 0,
}

let interval;

const mainButton = document.getElementById('btn');
mainButton.addEventListener('click', () => {
  const { action } = mainButton.dataset;
  console.log(action);
  if (action === 'start') {
    startTimer();
  } else {
    stopTimer();
  }
})
const modeButtons = document.querySelector('#mode-btns');
modeButtons.addEventListener('click', handleMode);

function handleMode(event) {
  const { mode } = event.target.dataset;
  console.log(mode);
  if (!mode) return;

  switchMode(mode);
  stopTimer();
}

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;
  console.log(Date.parse(new Date()));

  if (timer.mode === 'pomodoro') timer.session++;

  mainButton.dataset.action = 'stop';
  mainButton.textContent = 'stop';
  mainButton.classList.add('active');

  interval = setInterval(() => {
    timer.remainingTime = getRemainingTime(endTime);
    updateTimer();
    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);
      alert("Time's up!");

      switch (timer.mode) {
        case 'pomodoro':
          if (timer.session % timer.longBreakInterval === 0) {
            switchMode('longBreak');
          } else {
            switchMode('shortBreak');
          }
          break;
        default:
          switchMode('pomodoro');
      }
      startTimer();
    };

  }, 1000);
}

function stopTimer() {
  clearInterval(interval);  
  mainButton.dataset.action = 'start';
  mainButton.textContent = 'start';
  mainButton.classList.remove('active');
  
}

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return { total, minutes, seconds };
}

function updateTimer() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, '0');
  const seconds = `${remainingTime.seconds}`.padStart(2, '0');

  const min = document.getElementById('minutes');
  const sec = document.getElementById('seconds');
  min.textContent = minutes;
  sec.textContent = seconds;
}

function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds:0,
  };

  document.querySelectorAll('button[data-mode]').forEach(e => e.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  document.body.style.backgroundColor = `var(--${mode})`;
  document.querySelector(`.main-button`).style.color = `var(--${mode})`;

  updateTimer();
}


function resetTimer() {
  clearInterval(interval);
  timeLeft = 1500;
  updateTimer();
}