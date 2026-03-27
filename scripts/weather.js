// Weather Widget using Open-Meteo API (Free, No API Key Required)
// This script fetches weather data based on user's geolocation

const weatherContainer = document.getElementById('weatherContainer');
const weatherStatus = document.getElementById('weatherStatus');
const weatherData = document.getElementById('weatherData');

// Weather data elements
const weatherLocation = document.getElementById('weatherLocation');
const weatherTemp = document.getElementById('weatherTemp');
const weatherCondition = document.getElementById('weatherCondition');
const weatherHumidity = document.getElementById('weatherHumidity');
const weatherWind = document.getElementById('weatherWind');

// WMO Weather interpretation codes
const weatherCodes = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

// Function to get weather by coordinates
async function fetchWeatherByCoordinates(latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,humidity,wind_speed_10m&temperature_unit=celsius`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

// Function to get location name from coordinates (reverse geocoding)
async function getLocationName(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.address.city || data.address.town || data.address.county || 'Unknown Location';
    }
  } catch (error) {
    console.error('Error getting location name:', error);
  }
  return 'Your Location';
}

// Function to display weather
async function displayWeather(latitude, longitude) {
  const weatherInfo = await fetchWeatherByCoordinates(latitude, longitude);

  if (weatherInfo && weatherInfo.current) {
    const current = weatherInfo.current;
    const locationName = await getLocationName(latitude, longitude);

    // Update weather data
    weatherLocation.textContent = locationName;
    weatherTemp.textContent = Math.round(current.temperature_2m);
    weatherCondition.textContent = weatherCodes[current.weather_code] || 'Unknown';
    weatherHumidity.textContent = current.humidity;
    weatherWind.textContent = current.wind_speed_10m;

    // Show the weather data and hide the loading message
    weatherData.style.display = 'block';
    weatherStatus.style.display = 'none';
  } else {
    weatherStatus.textContent = 'Unable to fetch weather data. Please try again later.';
  }
}

// Function to handle geolocation success
function handleGeolocationSuccess(position) {
  const { latitude, longitude } = position.coords;
  displayWeather(latitude, longitude);
}

// Function to handle geolocation error
function handleGeolocationError(error) {
  console.warn('Geolocation error:', error);
  // Use default location (Abuja, Nigeria as per your profile)
  displayWeather(9.0765, 7.3986);
}

// Initialize weather when page loads
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    handleGeolocationSuccess,
    handleGeolocationError,
    {
      timeout: 10000,
      timeout: 10000,
      maximumAge: 3600000 // Cache location for 1 hour
    }
  );
} else {
  // Fallback to default location
  displayWeather(9.0765, 7.3986); // Abuja, Nigeria coordinates
}
