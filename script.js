let timerType = "Pomodoro";
let timerDuration = 25 * 60; // Default to 25 minutes
let timer;
let isRunning = false;
let themes = []; // Array to store theme image paths
let shortBreaksCompleted = 0;  // Para contar los descansos cortos completados
let shortBreaksBeforeLong = 4;


function saveSettings() {
    const pomodoroTime = parseInt(document.getElementById("pomodoroTime").value) || 25;
    const shortBreakTime = parseInt(document.getElementById("shortBreakTime").value) || 5;
    const longBreakTime = parseInt(document.getElementById("longBreakTime").value) || 15;
    shortBreaksBeforeLong = parseInt(document.getElementById("shortBreaksBeforeLong").value) || 4;

    if (timerType === "Pomodoro") timerDuration = pomodoroTime * 60;
    else if (timerType === "Short Break") timerDuration = shortBreakTime * 60;
    else if (timerType === "Long Break") timerDuration = longBreakTime * 60;

    // Guardar las configuraciones en las cookies
    document.cookie = `pomodoroTime=${pomodoroTime}; path=/;`;
    document.cookie = `shortBreakTime=${shortBreakTime}; path=/;`;
    document.cookie = `longBreakTime=${longBreakTime}; path=/;`;
    document.cookie = `shortBreaksBeforeLong=${shortBreaksBeforeLong}; path=/;`;
    document.cookie = `timerType=${timerType}; path=/;`;
    document.cookie = `theme=${document.body.style.backgroundImage}; path=/;`;

    toggleOptionsMenu();
    resetTimer();
}
function loadSettings() {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        acc[name] = value;
        return acc;
    }, {});

    if (cookies.pomodoroTime) {
        document.getElementById("pomodoroTime").value = cookies.pomodoroTime;
        timerDuration = parseInt(cookies.pomodoroTime) * 60;
    }
    if (cookies.shortBreakTime) {
        document.getElementById("shortBreakTime").value = cookies.shortBreakTime;
    }
    if (cookies.longBreakTime) {
        document.getElementById("longBreakTime").value = cookies.longBreakTime;
    }
    if (cookies.shortBreaksBeforeLong) {
        document.getElementById("shortBreaksBeforeLong").value = cookies.shortBreaksBeforeLong;
    }
    if (cookies.timerType) {
        timerType = cookies.timerType;
    }
    if (cookies.theme) {
        document.body.style.backgroundImage = cookies.theme;
    }

    resetTimer();
}

// Function to initialize theme options
function loadThemes() {
  const themeOptionsContainer = document.getElementById("themeOptions");
  const themeFolder = './themes/'; // Carpeta de las imágenes
  const maxImages = 100; // Número máximo de imágenes que esperas, ajusta según lo necesario
  let themes = [];

  // Intenta cargar imágenes numeradas del 1 al maxImages
  for (let i = 1; i <= maxImages; i++) {
    const imgSrc = `${themeFolder}${i}.jpg`; // Asume que las imágenes están numeradas como 1.jpg, 2.jpg, 3.jpg, etc.
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      // Si la imagen carga correctamente, la agregamos al array
      themes.push(imgSrc);
      updateThemeOptions();
    };
    img.onerror = () => {
      // Si la imagen no se encuentra, dejamos de intentar cargar más
      if (i === 1) {
        // Si la primera imagen tampoco carga, podemos mostrar un mensaje de error
        themeOptionsContainer.innerHTML = '<p>No se han encontrado imágenes disponibles.</p>';
      }
    };
  }

  // Función para actualizar el contenedor de opciones de tema
  function updateThemeOptions() {
    themeOptionsContainer.innerHTML = themes.map((src, index) => `
      <img src="${src}" class="theme-option" onclick="selectTheme('${src}')" id="theme${index}">
    `).join('');
  }
}

// Select a theme and update background
function selectTheme(themeSrc) {
    // Limpia la imagen de fondo en el html y el body
    document.documentElement.style.backgroundImage = ''; // Limpia el fondo del html
    document.body.style.backgroundImage = ''; // Limpia el fondo del body
    
    // Ahora establece la nueva imagen de fondo en ambos elementos
    document.documentElement.style.backgroundImage = `url('${themeSrc}')`;
    document.body.style.backgroundImage = `url('${themeSrc}')`;
    
    // Aplicar el mismo ajuste a ambos
    document.documentElement.style.backgroundSize = 'cover'; // Asegura que cubra toda la pantalla
    document.body.style.backgroundSize = 'cover';
    
    document.documentElement.style.backgroundAttachment = 'fixed'; // Fija el fondo
    document.body.style.backgroundAttachment = 'fixed';
    
    document.documentElement.style.backgroundRepeat = 'no-repeat'; // No repetir la imagen
    document.body.style.backgroundRepeat = 'no-repeat';
    
    document.documentElement.style.backgroundPosition = 'center'; // Centra la imagen
    document.body.style.backgroundPosition = 'center';
  
    // Actualiza la selección visual del tema
    document.querySelectorAll(".theme-option").forEach(img => img.classList.remove("selected"));
    document.getElementById(`theme${themes.indexOf(themeSrc)}`).classList.add("selected");
  }
  
  
  

// Toggle the options menu
function toggleOptionsMenu() {
  const optionsMenu = document.getElementById("optionsMenu");
  const currentDisplay = optionsMenu.style.display;

  // Show or hide the menu
  optionsMenu.style.display = currentDisplay === "none" || currentDisplay === "" ? "block" : "none";
}

function saveSettings() {
    const pomodoroTime = parseInt(document.getElementById("pomodoroTime").value) || 25;
    const shortBreakTime = parseInt(document.getElementById("shortBreakTime").value) || 5;
    const longBreakTime = parseInt(document.getElementById("longBreakTime").value) || 15;
    shortBreaksBeforeLong = parseInt(document.getElementById("shortBreaksBeforeLong").value) || 4;  // Obtener el valor
  
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
      // Stop the timer
      clearInterval(timer);
      isRunning = false;
      startStopButton.textContent = "Start";
    } else {
      // Start the timer
      isRunning = true;
      timer = setInterval(() => {
        timerDuration--;
        updateDisplay();
  
        if (timerDuration <= 0) {
          clearInterval(timer);
          isRunning = false;
  
          // Reproducir sonido cuando el temporizador termine
          document.getElementById("timerEndSound").play();
  
          // Change to the next timer type
          switch (timerType) {
            case "Pomodoro":
              setTimerType("Short Break");
              break;
            case "Short Break":
              shortBreaksCompleted++;  // Incrementar los descansos cortos
              if (shortBreaksCompleted >= shortBreaksBeforeLong) {
                setTimerType("Long Break");
                shortBreaksCompleted = 0;  // Restablecer el contador de descansos cortos
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
  

// Reset the timer
function resetTimer() {
  isRunning = false;
  clearInterval(timer);

  if (timerType === "Pomodoro") timerDuration = parseInt(document.getElementById("pomodoroTime").value) * 60;
  else if (timerType === "Short Break") timerDuration = parseInt(document.getElementById("shortBreakTime").value) * 60;
  else if (timerType === "Long Break") timerDuration = parseInt(document.getElementById("longBreakTime").value) * 60;

  updateDisplay();
}

// Update the display
function updateDisplay() {
  const minutes = Math.floor(timerDuration / 60).toString().padStart(2, '0');
  const seconds = (timerDuration % 60).toString().padStart(2, '0');
  document.querySelector('.timer-display').textContent = `${minutes}:${seconds}`;
}

// Load themes on page load
loadThemes();
resetTimer();

window.onload = () => {
    loadThemes();
    loadSettings();
};