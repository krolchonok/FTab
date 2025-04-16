// Сохранение данных
let data = JSON.parse(localStorage.getItem("data")) || [
  "https://chatgpt.com",
  "https://youtube.com",
  "https://vk.com",
];

// Настройки поисковых систем
const searchProvider = {
  "Yandex": "https://yandex.ru/search/?text=",
  "Google": "https://www.google.com/search?q=",
  "Bing": "https://www.bing.com/search?q=",
  "DuckDuckGo": "https://duckduckgo.com/?q="
};

// Начальные настройки
let settings = JSON.parse(localStorage.getItem("settings")) || {
  searchProvider: "Yandex",
  theme: "dark",
  showWeather: true,
  showGreeting: true,
  timeFormat: "24",
  customColors: {
    bgColor: "#000000",
    textColor: "#FFFFFF",
    accentColor: "#4285F4"
  }
};

// DOM элементы
const shortcuts = document.getElementById("shortcuts");
const searchInput = document.getElementById("search");
const searchClear = document.getElementById("search-clear");
const settingsButton = document.getElementById("set_but");
const settingsMenu = document.getElementById("settings_menu");
const closeSettings = document.getElementById("close-settings");
const optionsSearch = document.getElementById("options_search");
const themeSelect = document.getElementById("theme-select");
const showWeatherCheckbox = document.getElementById("show-weather");
const showGreetingCheckbox = document.getElementById("show-greeting");
const timeFormatSelect = document.getElementById("time-format");
const bgColorInput = document.getElementById("bg-color");
const textColorInput = document.getElementById("text-color");
const accentColorInput = document.getElementById("accent-color");
const customThemeSettings = document.getElementById("custom-theme-settings");
const saveSettingsButton = document.getElementById("save-settings");
const resetSettingsButton = document.getElementById("reset-settings");
const weatherWidget = document.getElementById("weather-widget");
const greetingElement = document.getElementById("greeting");
const quickAppsContainer = document.getElementById("quick-apps");

// Инициализация страницы
function initPage() {
  loadSettings();
  renderShortcuts();
  renderQuickApps();
  updateGreeting();
  
  if (!settings.showGreeting) {
    greetingElement.style.display = "none";
  }
  
  applyTheme();
}

// Загрузка настроек
function loadSettings() {
  // Установка значений в форме настроек
  optionsSearch.value = settings.searchProvider.toLowerCase();
  themeSelect.value = settings.theme;
  showWeatherCheckbox.checked = settings.showWeather;
  showGreetingCheckbox.checked = settings.showGreeting;
  timeFormatSelect.value = settings.timeFormat;
  
  // Цветовые настройки
  bgColorInput.value = settings.customColors.bgColor;
  textColorInput.value = settings.customColors.textColor;
  accentColorInput.value = settings.customColors.accentColor;
  
  // Показать/скрыть настройки пользовательской темы
  if (settings.theme === "custom") {
    customThemeSettings.style.display = "block";
  } else {
    customThemeSettings.style.display = "none";
  }
}

// Сохранение настроек
function saveSettings() {
  settings.searchProvider = optionsSearch.options[optionsSearch.selectedIndex].text;
  settings.theme = themeSelect.value;
  settings.showWeather = showWeatherCheckbox.checked;
  settings.showGreeting = showGreetingCheckbox.checked;
  settings.timeFormat = timeFormatSelect.value;
  
  settings.customColors = {
    bgColor: bgColorInput.value,
    textColor: textColorInput.value,
    accentColor: accentColorInput.value
  };
  
  localStorage.setItem("settings", JSON.stringify(settings));
  
  applyTheme();
  
  if (settings.showGreeting) {
    greetingElement.style.display = "block";
    updateGreeting();
  } else {
    greetingElement.style.display = "none";
  }
  
  showToast("Настройки сохранены", "success");
}

// Сброс настроек
function resetSettings() {
  settings = {
    searchProvider: "Yandex",
    theme: "dark",
    showWeather: true,
    showGreeting: true,
    timeFormat: "24",
    customColors: {
      bgColor: "#000000",
      textColor: "#FFFFFF",
      accentColor: "#4285F4"
    }
  };
  
  localStorage.setItem("settings", JSON.stringify(settings));
  loadSettings();
  applyTheme();

  
  if (settings.showGreeting) {
    greetingElement.style.display = "block";
    updateGreeting();
  }
  
  showToast("Настройки сброшены", "success");
}

// Применение темы
function applyTheme() {
  const root = document.documentElement;
  
  if (settings.theme === "light") {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
  } else if (settings.theme === "dark") {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
  } else if (settings.theme === "custom") {
    document.body.classList.remove("light-theme");
    document.body.classList.remove("dark-theme");
    
    root.style.setProperty('--bg-color', settings.customColors.bgColor);
    root.style.setProperty('--text-color', settings.customColors.textColor);
    root.style.setProperty('--accent-color', settings.customColors.accentColor);
  }
}

// Сохранение данных о ярлыках
function saveDataToLocalStorage() {
  localStorage.setItem("data", JSON.stringify(data));
}

// Рендер ярлыков слева
function renderShortcuts() {
  shortcuts.innerHTML = "";
  
  for (let i = 0; i < data.length && i < 8; i++) {
    const url = data[i];
    const domain = new URL(ensureHttps(url)).hostname;
    
    let link = document.createElement("img");
    link.className = "leftIcons";
    link.title = domain;
    
    // Попытка получить фавикон
    if (domain === "youtube.com" || domain === "www.youtube.com") {
      link.src = "https://www.youtube.com/s/desktop/26a583e4/img/logos/favicon_144x144.png";
    } else {
      link.src = getFaviconUrl(url) || generateLetterAvatar(url);
      
      // Обработка ошибки загрузки иконки
      link.onerror = function() {
        // Использование первой буквы домена в качестве запасного варианта
        this.onerror = null;
        this.src = generateLetterAvatar(domain.charAt(0).toUpperCase());
      };
    }
    
    link.addEventListener("mousedown", function(event) {
      if (event.button === 0) {
        window.location.href = ensureHttps(url);
      } else if (event.button === 1) {
        window.open(ensureHttps(url), "_blank");
      }
    });
    
    shortcuts.appendChild(link);
  }
}

// Создание быстрых приложений
function renderQuickApps() {
  quickAppsContainer.innerHTML = "";
  
  for (let i = 0; i < Math.min(data.length, 8); i++) {
    const url = data[i];
    const domain = new URL(ensureHttps(url)).hostname;
    const name = getDomainName(domain);
    
    const appElement = document.createElement("div");
    appElement.className = "quick-app";
    appElement.title = domain;
    
    const iconContainer = document.createElement("div");
    iconContainer.className = "quick-app-icon";
    
    const icon = document.createElement("img");
    if (domain === "youtube.com" || domain === "www.youtube.com") {
      icon.src = "https://www.youtube.com/s/desktop/26a583e4/img/logos/favicon_144x144.png";
    } else {
      icon.src = getFaviconUrl(url) || generateLetterAvatar(url);
      icon.onerror = function() {
        this.onerror = null;
        this.src = generateLetterAvatar(domain.charAt(0).toUpperCase());
      };
    }
    
    const label = document.createElement("span");
    label.textContent = name;
    
    iconContainer.appendChild(icon);
    appElement.appendChild(iconContainer);
    appElement.appendChild(label);
    
    appElement.addEventListener("click", function() {
      window.location.href = ensureHttps(url);
    });
    
    quickAppsContainer.appendChild(appElement);
  }
}
function getFaviconUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.origin}/favicon.ico`;
  } catch (error) {
    console.error("Invalid URL:", url);
    return null;
  }
}

// Получение имени домена без www и .com/.ru и т.д.
function getDomainName(domain) {
  return domain.replace("www.", "").split(".")[0].charAt(0).toUpperCase() + domain.replace("www.", "").split(".")[0].slice(1);
}

// Создание аватара из буквы (для отсутствующих иконок)
function generateLetterAvatar(letter) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  
  // Фон
  context.fillStyle = settings.customColors.accentColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Текст
  context.fillStyle = '#fff';
  context.font = '32px Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(letter, canvas.width / 2, canvas.height / 2);
  
  return canvas.toDataURL('image/png');
}

// Убедиться, что URL начинается с http:// или https://
function ensureHttps(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}

// Функция для добавления нового ярлыка
function addShortcut(url, name) {
  url = url.trim();
  if (!url) return false;
  
  // Проверка URL
  try {
    // Добавляем https:// если протокол не указан
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Проверка валидности URL
    new URL(url);
    
    if (!data.includes(url)) {
      data.push(url);
      saveDataToLocalStorage();
      renderShortcuts();
      renderQuickApps();
      return true;
    } else {
      showToast("Эта ссылка уже добавлена", "error");
      return false;
    }
  } catch (e) {
    showToast("Некорректный URL", "error");
    return false;
  }
}

// Функция для удаления ярлыка
function removeShortcut(url) {
  data = data.filter(item => item !== url);
  saveDataToLocalStorage();
  renderShortcuts();
  renderQuickApps();
  showToast("Ссылка удалена", "success");
}

// Обновление времени
function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let timeString;
  
  // Форматирование времени в зависимости от настроек
  if (settings.timeFormat === "12") {
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 часов = 12 в 12-часовом формате
    timeString = `${hours} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")} ${period}`;
  } else {
    timeString = `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
  }
  
  document.getElementById("time").textContent = timeString;
}

// Обновление даты
function updateDate() {
  const now = new Date();
  const daysOfWeek = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  
  const dayOfWeek = daysOfWeek[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  
  const dateString = `${dayOfWeek} ${day} ${month} ${year}`;
  document.getElementById("date").textContent = dateString;
}

// Обновление приветствия
function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;
  
  if (hour >= 5 && hour < 12) {
    greeting = "Доброе утро";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Добрый день";
  } else if (hour >= 18 && hour < 23) {
    greeting = "Добрый вечер";
  } else {
    greeting = "Доброй ночи";
  }
  
  document.getElementById("greeting").textContent = greeting;
}



// Показ уведомления
function showToast(message, type = "") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast visible";
  
  if (type) {
    toast.classList.add(type);
  }
  
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => {
      toast.className = "toast";
    }, 300);
  }, 3000);
}

// Отображение списка ярлыков в настройках
function renderLinks() {
  const linksList = document.getElementById("links_list");
  linksList.innerHTML = "";
  
  data.forEach((url, index) => {
    try {
      const domain = new URL(ensureHttps(url)).hostname;
      const listItem = document.createElement("li");
      
      // Информация о ссылке
      const linkInfo = document.createElement("span");
      linkInfo.textContent = domain;
      listItem.appendChild(linkInfo);
      
      // Кнопка удаления
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Удалить";
      deleteButton.addEventListener("click", function() {
        removeShortcut(url);
      });
      
      listItem.appendChild(deleteButton);
      linksList.appendChild(listItem);
    } catch (e) {
      console.error("Ошибка при отображении ссылки:", e);
    }
  });
}

// Обработчики событий
document.addEventListener("DOMContentLoaded", function() {
  // Инициализация страницы
  initPage();
  renderLinks();
  
  // Регулярное обновление времени и даты
  setInterval(updateTime, 1000);
  setInterval(updateDate, 60000); // Дата обновляется реже
  
  // Обработчик для поискового запроса
  searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
        const encodedQuery = encodeURIComponent(query);
        const url = `${searchProvider[settings.searchProvider]}${encodedQuery}`;
        window.location.href = url;
      }
    }
  });
  
  // Отображение/скрытие кнопки очистки поиска
  searchInput.addEventListener("input", function() {
    if (this.value.length > 0) {
      searchClear.classList.add("visible");
    } else {
      searchClear.classList.remove("visible");
    }
  });
  
  // Очистка поискового запроса
  searchClear.addEventListener("click", function() {
    searchInput.value = "";
    searchInput.focus();
    this.classList.remove("visible");
  });
  
  // Обработчик для кнопки добавления ссылки
  document.getElementById("add_link").addEventListener("click", function() {
    const linkInput = document.getElementById("link_input");
    const linkName = document.getElementById("link_name");
    
    if (addShortcut(linkInput.value, linkName.value)) {
      linkInput.value = "";
      linkName.value = "";
      renderLinks();
    }
  });
  
  // Обработчик для кнопки настроек
  settingsButton.addEventListener("click", function() {
    if (settingsMenu.style.display === "none" || !settingsMenu.style.display) {
      settingsMenu.style.display = "block";
    } else {
      settingsMenu.style.display = "none";
    }
  });
  
  // Закрытие меню настроек
  closeSettings.addEventListener("click", function() {
    settingsMenu.style.display = "none";
  });
  
  // Обработчик изменения темы
  themeSelect.addEventListener("change", function() {
    if (this.value === "custom") {
      customThemeSettings.style.display = "block";
    } else {
      customThemeSettings.style.display = "none";
    }
  });
  
  // Сохранение настроек
  saveSettingsButton.addEventListener("click", function() {
    saveSettings();
  });
  
  // Сброс настроек
  resetSettingsButton.addEventListener("click", function() {
    if (confirm("Вы уверены, что хотите сбросить все настройки?")) {
      resetSettings();
      renderLinks();
    }
  });
  
  // Очистка поиска при загрузке страницы
  window.addEventListener("load", function() {
    searchInput.value = "";
  });
  
  // Закрытие настроек при клике вне меню
  document.addEventListener("click", function(event) {
    if (!settingsMenu.contains(event.target) && event.target !== settingsButton && !settingsButton.contains(event.target) && settingsMenu.style.display === "block") {
      settingsMenu.style.display = "none";
    }
  });
});