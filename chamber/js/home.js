// Home page specific functionality for weather and spotlights

// Enugu City coordinates (approximate)
const ENUGU_LAT = 6.4969;
const ENUGU_LON = 7.5519;
const OPENWEATHER_API_KEY = '734911fad67e1dbe86b8e5843c9c60a9';
const MEMBERS_DATA_URL = 'data/members.json';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadWeather();
  loadSpotlights();
  updateLastModified();
});

// ========== WEATHER SECTION ==========
async function loadWeather() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${ENUGU_LAT}&lon=${ENUGU_LON}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    document.getElementById('weather-card').innerHTML = '<p>Unable to load weather data. Please try again later.</p>';
  }
}

function displayWeather(data) {
  const current = data.list[0]; // First entry is the current weather
  const weatherCard = document.getElementById('weather-card');

  // Get temperature, description, and 3-day forecast
  const temp = Math.round(current.main.temp);
  const description = current.weather[0].description;
  const icon = current.weather[0].icon;

  // Collect forecast for next 3 days (pick one forecast per day at noon)
  const forecastMap = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    // Take data around noon if available
    if (!forecastMap[day] || date.getHours() === 12) {
      forecastMap[day] = item;
    }
  });

  const forecastDays = Object.entries(forecastMap).slice(0, 3); // Get first 3 unique days

  let html = `
    <div class="weather-current">
      <div class="weather-description">
        <h3>Current Conditions</h3>
        <p><strong>Temperature:</strong> ${temp}°C</p>
        <p><strong>Condition:</strong> ${description.charAt(0).toUpperCase() + description.slice(1)}</p>
      </div>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="weather-icon">
    </div>

    <div class="forecast">
      <h3>3-Day Forecast</h3>
      <div class="forecast-grid">
  `;

  forecastDays.forEach(([day, forecast]) => {
    const temp = Math.round(forecast.main.temp);
    const desc = forecast.weather[0].main;
    const icon = forecast.weather[0].icon;

    html += `
      <div class="forecast-day">
        <p class="forecast-date">${day}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" class="forecast-icon">
        <p class="forecast-temp">${temp}°C</p>
        <p class="forecast-desc">${desc}</p>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  weatherCard.innerHTML = html;
}

// ========== SPOTLIGHTS SECTION ==========
async function loadSpotlights() {
  try {
    const response = await fetch(MEMBERS_DATA_URL);
    const members = await response.json();

    // Filter to only Gold (level 3) and Silver (level 2) members
    const eligibleMembers = members.filter(m => m.level === 3 || m.level === 2);

    if (eligibleMembers.length === 0) {
      displaySpotlightsError('No eligible businesses found');
      return;
    }

    // Randomly select 2-3 members
    const spotlightCount = Math.min(3, Math.max(2, eligibleMembers.length));
    const selectedMembers = getRandomMembers(eligibleMembers, spotlightCount);

    displaySpotlights(selectedMembers);
  } catch (error) {
    console.error('Failed to load spotlights:', error);
    displaySpotlightsError('Unable to load featured businesses');
  }
}

function getRandomMembers(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function displaySpotlights(members) {
  const container = document.getElementById('spotlight-cards');
  container.innerHTML = '';

  members.forEach(member => {
    const card = createSpotlightCard(member);
    container.appendChild(card);
  });
}

function createSpotlightCard(member) {
  const article = document.createElement('article');
  article.className = 'card spotlight-card';

  const levelName = member.level === 3 ? 'Gold' : member.level === 2 ? 'Silver' : 'Member';
  const imageSrc = member.image ? `images/${member.image}` : 'images/business1.svg';

  article.innerHTML = `
    <img src="${imageSrc}" alt="${member.name} logo" class="business-logo">
    <h3>${member.name}</h3>
    <p class="business-address">${member.address}</p>
    <p class="business-phone"><a href="tel:${member.phone}">${member.phone}</a></p>
    <p class="business-website"><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
    <p class="membership-level">Membership Level: <strong>${levelName}</strong></p>
  `;

  return article;
}

function displaySpotlightsError(message) {
  const container = document.getElementById('spotlight-cards');
  container.innerHTML = `<p>${message}</p>`;
}

// ========== UTILITY FUNCTIONS ==========
function updateLastModified() {
  const lastModifiedSpan = document.getElementById('lastModified');
  const date = new Date(document.lastModified);
  lastModifiedSpan.textContent = date.toLocaleString();
}
