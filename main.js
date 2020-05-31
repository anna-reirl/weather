const api = {
  key: "c71e63fa8ac486fa77c2e6c20cc82798",
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);
const openCageKey = '8a7a2ff77a5e44ff90e54d20d9b1dc56';
const googleMapsKey = 'AIzaSyBWWZnqHV3asW7DM3yCQ0dxSHjj_J9LkwE';

const search = document.getElementById('search');
const iframe = document.getElementById('iframe');

async function go() {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${search.value}&key=${openCageKey}&pretty=1&no_annotations=1`;
  const response = await fetch(url);
  const data = await response.json();
  if (data && data.results) {
    const geo = data.results[0].geometry;
    const gmUrl = `https://www.google.com/maps/embed/v1/view?center=${geo.lat},${geo.lng}&zoom=10&key=${googleMapsKey}&language=en`;
    iframe.setAttribute('src', gmUrl);
  }
}

search.addEventListener('keyup', (e) => { if (e.code === 'Enter') go(); });

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults (query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json();
    }).then(displayResults);
}

function displayResults (weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder (d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

