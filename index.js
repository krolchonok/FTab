data = ["https://chatgpt.com", "https://youtube.com", "https://vk.com"];

searchProvider = {
  yandex: "https://yandex.ru/search/?text=",
  google: "https://www.google.com/search?q=",
};

shortcuts = document.getElementById("shortcuts");

for (let i = 0; i < data.length; i++) {
  let link = document.createElement("img");
  if (data[i] === "https://youtube.com") {
    link.src =
      "https://www.youtube.com/s/desktop/26a583e4/img/logos/favicon_144x144.png";
  } else {
    link.src = data[i] + "/favicon.ico";
  }
  link.style.marginBottom = "10px";
  link.addEventListener("mousedown", function (event) {
    console.log(event.button);
    if (event.button === 0) {
      window.location.href = data[i];
    } else if (event.button === 1) {
      window.open(data[i], "_blank");
    }
  });
  shortcuts.appendChild(link);
}

selectedSearcher = "google";

document.body.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    let query = document.getElementById("search").value;
    if (query) {
      query = query.replace(/ /g, "+"); // Заменяем все пробелы на плюсы
      const url = `${searchProvider[selectedSearcher]}${query}`;
      window.location.href = url; // Открывает ссылку в той же вкладке
    }
  }
});

window.addEventListener("load", function () {
  document.getElementById("search").value = "";
});

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeString = `${hours} : ${minutes} : ${seconds}`;
  document.getElementById("time").textContent = timeString;
}

function updateDate() {
  const now = new Date();
  const daysOfWeek = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const dayOfWeek = daysOfWeek[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const dateString = `${dayOfWeek} ${day} ${month} ${year}`;
  document.getElementById("date").textContent = dateString;
}

setInterval(updateTime, 1000);
setInterval(updateDate, 1000);

updateTime();
updateDate();
