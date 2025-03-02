let timerType = "Pomodoro";
let timerDuration;
let timer;
let isRunning = false;
let themes = [];
let shortBreaksCompleted = 0;
let shortBreaksBeforeLong = 4;

window.onload = function() {
    loadThemes();
    loadSettings();
  };

  function loadSettings() {
    const pomodoroTime = localStorage.getItem("pomodoroTime") || 25;  // Default to 25 if not set
    const shortBreakTime = localStorage.getItem("shortBreakTime") || 5;  // Default to 5 if not set
    const longBreakTime = localStorage.getItem("longBreakTime") || 15;  // Default to 15 if not set
    const savedTimerType = localStorage.getItem("timerType") || "Pomodoro";
    const shortBreaksBeforeLong = localStorage.getItem("shortBreaksBeforeLong") || 4;
    const selectedTheme = localStorage.getItem("selectedTheme");

    // Set values in the input fields
    document.getElementById("pomodoroTime").value = pomodoroTime;
    document.getElementById("shortBreakTime").value = shortBreakTime;
    document.getElementById("longBreakTime").value = longBreakTime;
    document.getElementById("shortBreaksBeforeLong").value = shortBreaksBeforeLong;

    // Set the timer type and duration based on saved settings
    timerType = savedTimerType;
    if (timerType === "Pomodoro") {
        timerDuration = parseInt(pomodoroTime) * 60;
    } else if (timerType === "Short Break") {
        timerDuration = parseInt(shortBreakTime) * 60;
    } else if (timerType === "Long Break") {
        timerDuration = parseInt(longBreakTime) * 60;
    }

    // Apply the saved theme, if any
    if (selectedTheme) {
        document.body.style.backgroundImage = selectedTheme;
        document.documentElement.style.backgroundImage = selectedTheme;
    }

    // Update the display with the correctly initialized duration
    updateDisplay();
}
  

function loadThemes() {
    const themeOptionsContainer = document.getElementById("themeOptions");
    const themeFolder = './themes/';
    const maxImages = 100; 
    let themes = [];
  
    for (let i = 1; i <= maxImages; i++) {
      const imgSrc = `${themeFolder}${i}.jpg`;
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        themes.push(imgSrc);
        updateThemeOptions();
      };
      img.onerror = () => {
        if (i === 1) {
          themeOptionsContainer.innerHTML = '<p>No se han encontrado imágenes disponibles.</p>';
        }
      };
    }
  
    function updateThemeOptions() {
      themeOptionsContainer.innerHTML = themes.map((src, index) => `
        <img src="${src}" class="theme-option" onclick="selectTheme('${src}')" id="theme${index}">
      `).join('');
    }
  
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      document.body.style.backgroundImage = savedTheme;
      document.documentElement.style.backgroundImage = savedTheme;
    }
  }
  

function selectTheme(themeSrc) {
    document.documentElement.style.backgroundImage = '';
    document.body.style.backgroundImage = '';
    
    document.documentElement.style.backgroundImage = `url('${themeSrc}')`;
    document.body.style.backgroundImage = `url('${themeSrc}')`;
    
    document.documentElement.style.backgroundSize = 'cover';
    document.body.style.backgroundSize = 'cover';
    
    document.documentElement.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundAttachment = 'fixed';
    
    document.documentElement.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundRepeat = 'no-repeat';
    
    document.documentElement.style.backgroundPosition = 'center';
    document.body.style.backgroundPosition = 'center';
  
    document.querySelectorAll(".theme-option").forEach(img => img.classList.remove("selected"));
    document.getElementById(`theme${themes.indexOf(themeSrc)}`).classList.add("selected");
  }
  
function toggleOptionsMenu() {
  const optionsMenu = document.getElementById("optionsMenu");
  const currentDisplay = optionsMenu.style.display;

  optionsMenu.style.display = currentDisplay === "none" || currentDisplay === "" ? "block" : "none";
}

function saveSettings() {
    const pomodoroTime = parseInt(document.getElementById("pomodoroTime").value) || 25;
    const shortBreakTime = parseInt(document.getElementById("shortBreakTime").value) || 5;
    const longBreakTime = parseInt(document.getElementById("longBreakTime").value) || 15;
    shortBreaksBeforeLong = parseInt(document.getElementById("shortBreaksBeforeLong").value) || 4;
  
    if (timerType === "Pomodoro") timerDuration = pomodoroTime * 60;
    else if (timerType === "Short Break") timerDuration = shortBreakTime * 60;
    else if (timerType === "Long Break") timerDuration = longBreakTime * 60;
  
    toggleOptionsMenu();
    resetTimer();
  }

  function setTimerType(type) {
    timerType = type;
    if (type === "Pomodoro") timerDuration = parseInt(document.getElementById("pomodoroTime").value) * 60;
    else if (type === "Short Break") timerDuration = parseInt(document.getElementById("shortBreakTime").value) * 60;
    else if (type === "Long Break") timerDuration = parseInt(document.getElementById("longBreakTime").value) * 60;
  
    resetTimer();
  }
  

  function toggleTimer() {
    const startStopButton = document.querySelector('.controls button');
  
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
      startStopButton.textContent = "Start";
    } else {
      isRunning = true;
      timer = setInterval(() => {
        timerDuration--;
        updateDisplay();
  
        if (timerDuration <= 0) {
          clearInterval(timer);
          isRunning = false;
  
          document.getElementById("timerEndSound").play();
  
          switch (timerType) {
            case "Pomodoro":
              setTimerType("Short Break");
              break;
            case "Short Break":
              shortBreaksCompleted++;
              if (shortBreaksCompleted >= shortBreaksBeforeLong) {
                setTimerType("Long Break");
                shortBreaksCompleted = 0;
              } else {
                setTimerType("Pomodoro");
              }
              break;
            case "Long Break":
              setTimerType("Pomodoro");
              break;
          }
  
          startStopButton.textContent = "Start";
        }
      }, 1000);
      startStopButton.textContent = "Stop";
    }
  }
  

function resetTimer() {
  isRunning = false;
  clearInterval(timer);

  if (timerType === "Pomodoro") timerDuration = parseInt(document.getElementById("pomodoroTime").value) * 60;
  else if (timerType === "Short Break") timerDuration = parseInt(document.getElementById("shortBreakTime").value) * 60;
  else if (timerType === "Long Break") timerDuration = parseInt(document.getElementById("longBreakTime").value) * 60;

  updateDisplay();
}

function updateDisplay() {
  const minutes = Math.floor(timerDuration / 60).toString().padStart(2, '0');
  const seconds = (timerDuration % 60).toString().padStart(2, '0');
  document.querySelector('.timer-display').textContent = `${minutes}:${seconds}`;
}

loadThemes();
resetTimer();

function saveSettings() {
    const pomodoroTime = parseInt(document.getElementById("pomodoroTime").value) || 25;
    const shortBreakTime = parseInt(document.getElementById("shortBreakTime").value) || 5;
    const longBreakTime = parseInt(document.getElementById("longBreakTime").value) || 15;
    shortBreaksBeforeLong = parseInt(document.getElementById("shortBreaksBeforeLong").value) || 4;
  
    localStorage.setItem("pomodoroTime", pomodoroTime);
    localStorage.setItem("shortBreakTime", shortBreakTime);
    localStorage.setItem("longBreakTime", longBreakTime);
    localStorage.setItem("shortBreaksBeforeLong", shortBreaksBeforeLong);
    localStorage.setItem("timerType", timerType);
    localStorage.setItem("selectedTheme", document.body.style.backgroundImage);
    
    if (timerType === "Pomodoro") timerDuration = pomodoroTime * 60;
    else if (timerType === "Short Break") timerDuration = shortBreakTime * 60;
    else if (timerType === "Long Break") timerDuration = longBreakTime * 60;
  
    toggleOptionsMenu();
    resetTimer();
  }
  
  function loadAudioOptions() {
    const audioOptionsContainer = document.getElementById("audioOptions");
    const audioFolder = './sounds/';
    const maxAudios = 100;
    let audios = [];
  
    for (let i = 1; i <= maxAudios; i++) {
      const audioSrc = `${audioFolder}${i}.mp3`;
      const audio = new Audio();
      audio.src = audioSrc;
  
      audio.oncanplaythrough = () => {
        audios.push(audioSrc);
        updateAudioOptions();
      };
  
      audio.onerror = () => {
        if (i === 1) {
          audioOptionsContainer.innerHTML = '<p>No se han encontrado audios disponibles.</p>';
        }
        return;
      };
    }
  
    function updateAudioOptions() {
      audioOptionsContainer.innerHTML = audios.map((src, index) => `
        <div class="audio-option" id="audio${index}">
          <button onclick="playAudio('${src}')">▶️</button>
          <button onclick="setDefaultAudio('${src}')" data-audio="${src}">Audio ${index + 1}</button>
        </div>
      `).join('');
  
      const savedAudio = getCookie('defaultAudio') || `${audioFolder}1.mp3`;
      document.getElementById('timerEndSound').src = savedAudio;
  
      highlightSelectedAudio(savedAudio);
    }
  }
  
  function playAudio(audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play();
    highlightSelectedAudio(audioSrc);
  }
  
  function setDefaultAudio(audioPath) {
    const timerEndSound = document.getElementById('timerEndSound');
    timerEndSound.src = audioPath;
    document.cookie = `defaultAudio=${audioPath}; path=/`;
  
    highlightSelectedAudio(audioPath);
  }
  
  function highlightSelectedAudio(audioPath) {
    const audioOptions = document.querySelectorAll('.audio-option');
    audioOptions.forEach(option => {
      const button = option.querySelector('button[data-audio]');
      if (button && button.getAttribute('data-audio') === audioPath) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
  }
  
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  document.addEventListener('DOMContentLoaded', loadAudioOptions);
  