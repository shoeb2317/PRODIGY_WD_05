/**
 * SkyCast - Real-Time Weather Application Logic
 * Integrates Open-Meteo Forecast & Geocoding APIs, HTML5 Geolocation,
 * Interactive SVG Charts, Sun Arc Path, Dynamic Theming, and Unit Conversion.
 */

// ==========================================
// Weather Code Mappings & SVG Icon Generator
// ==========================================
const WEATHER_CODES = {
  0: { desc: 'Clear Sky', icon: 'sun', particle: 'clear-day', themeDay: 'weather-clear-day', themeNight: 'weather-clear-night' },
  1: { desc: 'Mainly Clear', icon: 'sun', particle: 'clear-day', themeDay: 'weather-clear-day', themeNight: 'weather-clear-night' },
  2: { desc: 'Partly Cloudy', icon: 'partly-cloudy', particle: 'clouds', themeDay: 'weather-cloudy-day', themeNight: 'weather-cloudy-night' },
  3: { desc: 'Overcast', icon: 'cloud', particle: 'clouds', themeDay: 'weather-cloudy-day', themeNight: 'weather-cloudy-night' },
  45: { desc: 'Foggy', icon: 'fog', particle: 'fog', themeDay: 'weather-fog', themeNight: 'weather-fog' },
  48: { desc: 'Depositing Rime Fog', icon: 'fog', particle: 'fog', themeDay: 'weather-fog', themeNight: 'weather-fog' },
  51: { desc: 'Light Drizzle', icon: 'rain-light', particle: 'rain', themeDay: 'weather-rain', themeNight: 'weather-rain' },
  53: { desc: 'Moderate Drizzle', icon: 'rain-light', particle: 'rain', themeDay: 'weather-rain', themeNight: 'weather-rain' },
  55: { desc: 'Dense Drizzle', icon: 'rain-light', particle: 'rain', themeDay: 'weather-rain', themeNight: 'weather-rain' },
  56: { desc: 'Freezing Drizzle', icon: 'snow', particle: 'snow', themeDay: 'weather-snow', themeNight: 'weather-snow' },
  57: { desc: 'Dense Freezing Drizzle', icon: 'snow', particle: 'snow', themeDay: 'weather-snow', themeNight: 'weather-snow' },
  61: { desc: 'Slight Rain', icon: 'rain-light', particle: 'rain', themeDay: 'weather-rain', themeNight: 'weather-rain' },
  63: { desc: 'Moderate Rain', icon: 'rain', particle: 'rain', themeDay: 'weather-rain', themeNight: 'weather-rain' },
  65: { desc: 'Heavy Rain', icon: 'rain-heavy', particle: 'rain', themeDay: 'weather-rain', themeNight: 'weather-rain' },
  66: { desc: 'Freezing Rain', icon: 'snow', particle: 'snow', themeDay: 'weather-snow', themeNight: 'weather-snow' },
  67: { desc: 'Heavy Freezing Rain', icon: 'snow', particle: 'snow', themeDay: 'weather-snow', themeNight: 'weather-snow' },
  71: { desc: 'Slight Snowfall', icon: 'snow', particle: 'snow', themeDay: 'weather-snow', themeNight: 'weather-snow' },
  73: { desc: 'Moderate Snowfall', icon: 'snow', particle: 'snow', themeDay: 'weather-snow', themeNight: 'weather-snow' },
  75: { desc: 'Heavy Snowfall', icon: 'snow-heavy', particle: 'snow', themeDay: 'weather-snow', themeNight: 'weather-snow' },
  77: { desc: 'Snow Grains', icon: 'snow', particle: 'snow', themeDay: 'weather-snow', themeNight: 'weather-snow' },
  80: { desc: 'Light Rain Showers', icon: 'rain-light', particle: 'rain', themeDay: 'weather-rain', themeNight: 'weather-rain' },
  81: { desc: 'Moderate Showers', icon: 'rain', particle: 'rain', themeDay: 'weather-rain', themeNight: 'weather-rain' },
  82: { desc: 'Violent Rain Showers', icon: 'rain-heavy', particle: 'rain', themeDay: 'weather-rain', themeNight: 'weather-rain' },
  85: { desc: 'Slight Snow Showers', icon: 'snow', particle: 'snow', themeDay: 'weather-snow', themeNight: 'weather-snow' },
  86: { desc: 'Heavy Snow Showers', icon: 'snow-heavy', particle: 'snow', themeDay: 'weather-snow', themeNight: 'weather-snow' },
  95: { desc: 'Thunderstorm', icon: 'thunder', particle: 'thunder', themeDay: 'weather-thunder', themeNight: 'weather-thunder' },
  96: { desc: 'Thunderstorm with Hail', icon: 'thunder', particle: 'thunder', themeDay: 'weather-thunder', themeNight: 'weather-thunder' },
  99: { desc: 'Severe Hail Thunderstorm', icon: 'thunder', particle: 'thunder', themeDay: 'weather-thunder', themeNight: 'weather-thunder' }
};

function getWeatherDetails(code, isDay = 1) {
  const meta = WEATHER_CODES[code] || {
    desc: 'Fair',
    icon: 'sun',
    particle: isDay ? 'clear-day' : 'clear-night',
    themeDay: 'weather-clear-day',
    themeNight: 'weather-clear-night'
  };

  const theme = isDay ? meta.themeDay : meta.themeNight;
  const particle = (meta.particle === 'clear-day' && !isDay) ? 'clear-night' : meta.particle;
  const icon = (meta.icon === 'sun' && !isDay) ? 'moon' : ((meta.icon === 'partly-cloudy' && !isDay) ? 'partly-cloudy-night' : meta.icon);

  return { desc: meta.desc, icon, particle, theme };
}

function getIconSvg(iconType) {
  switch (iconType) {
    case 'sun':
      return `
        <svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="14" fill="url(#sun-grad)" filter="drop-shadow(0 0 12px rgba(251, 191, 36, 0.7))"/>
          <g stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round">
            <line x1="32" y1="6" x2="32" y2="12" />
            <line x1="32" y1="52" x2="32" y2="58" />
            <line x1="6" y1="32" x2="12" y2="32" />
            <line x1="52" y1="32" x2="58" y2="32" />
            <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" />
            <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" />
            <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" />
            <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" />
          </g>
          <defs>
            <linearGradient id="sun-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fde047" />
              <stop offset="100%" stop-color="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>`;

    case 'moon':
      return `
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M44 38A20 20 0 1 1 26 12a16 16 0 0 0 18 26z" fill="url(#moon-grad)" filter="drop-shadow(0 0 10px rgba(165, 180, 252, 0.6))"/>
          <circle cx="48" cy="18" r="1.5" fill="#e0e7ff" />
          <circle cx="52" cy="30" r="1" fill="#e0e7ff" />
          <defs>
            <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e0e7ff" />
              <stop offset="100%" stop-color="#818cf8" />
            </linearGradient>
          </defs>
        </svg>`;

    case 'partly-cloudy':
      return `
        <svg viewBox="0 0 64 64" fill="none">
          <circle cx="26" cy="24" r="11" fill="#facc15" filter="drop-shadow(0 0 8px rgba(250, 204, 21, 0.6))"/>
          <path d="M22 48h24a10 10 0 0 0 2-19.8 13 13 0 0 0-25-3.2A10 10 0 0 0 22 48z" fill="url(#cloud-grad)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.25))"/>
          <defs>
            <linearGradient id="cloud-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#cbd5e1" />
            </linearGradient>
          </defs>
        </svg>`;

    case 'partly-cloudy-night':
      return `
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M34 26A12 12 0 1 1 22 10a10 10 0 0 0 12 16z" fill="#c7d2fe"/>
          <path d="M20 48h24a10 10 0 0 0 2-19.8 13 13 0 0 0-25-3.2A10 10 0 0 0 20 48z" fill="url(#cloud-grad-night)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.35))"/>
          <defs>
            <linearGradient id="cloud-grad-night" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#94a3b8" />
              <stop offset="100%" stop-color="#475569" />
            </linearGradient>
          </defs>
        </svg>`;

    case 'cloud':
    case 'fog':
      return `
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M18 44h28a11 11 0 0 0 2-21.8 14 14 0 0 0-27-3.2A11 11 0 0 0 18 44z" fill="url(#cloud-grad)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.2))"/>
          <defs>
            <linearGradient id="cloud-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
          </defs>
        </svg>`;

    case 'rain-light':
    case 'rain':
    case 'rain-heavy':
      return `
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M16 38h28a10 10 0 0 0 2-19.8 13 13 0 0 0-25-3.2A10 10 0 0 0 16 38z" fill="url(#rain-cloud)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"/>
          <g stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round">
            <line x1="20" y1="44" x2="17" y2="52" />
            <line x1="28" y1="44" x2="25" y2="52" />
            <line x1="36" y1="44" x2="33" y2="52" />
            <line x1="44" y1="44" x2="41" y2="52" />
          </g>
          <defs>
            <linearGradient id="rain-cloud" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#475569" />
            </linearGradient>
          </defs>
        </svg>`;

    case 'thunder':
      return `
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M16 34h28a10 10 0 0 0 2-19.8 13 13 0 0 0-25-3.2A10 10 0 0 0 16 34z" fill="url(#storm-cloud)"/>
          <polygon points="32,32 24,45 30,45 26,58 38,42 32,42" fill="#fbbf24" filter="drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))"/>
          <defs>
            <linearGradient id="storm-cloud" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#64748b" />
              <stop offset="100%" stop-color="#1e1b4b" />
            </linearGradient>
          </defs>
        </svg>`;

    case 'snow':
    case 'snow-heavy':
      return `
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M16 36h28a10 10 0 0 0 2-19.8 13 13 0 0 0-25-3.2A10 10 0 0 0 16 36z" fill="url(#snow-cloud)"/>
          <circle cx="22" cy="46" r="2.2" fill="#e0f2fe" filter="drop-shadow(0 0 3px #bae6fd)" />
          <circle cx="32" cy="50" r="2.4" fill="#e0f2fe" filter="drop-shadow(0 0 3px #bae6fd)" />
          <circle cx="42" cy="46" r="2.2" fill="#e0f2fe" filter="drop-shadow(0 0 3px #bae6fd)" />
          <defs>
            <linearGradient id="snow-cloud" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e2e8f0" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
          </defs>
        </svg>`;

    default:
      return `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"></circle></svg>`;
  }
}

// ==========================================
// App State
// ==========================================
const state = {
  unit: localStorage.getItem('skycast_unit') || 'c', // 'c' or 'f'
  location: null, // { name, country, lat, lon, timezone }
  weather: null,  // raw Open-Meteo payload
  favorites: JSON.parse(localStorage.getItem('skycast_favs') || '[]'),
  debounceTimer: null,
  activeSuggestionIndex: -1,
  suggestions: []
};

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  setupUnitToggle();
  setupSearchInput();
  setupActionButtons();
  setupQuickChips();
  renderFavoritesChips();

  // Try loading initial location:
  // 1. Last visited or saved location
  // 2. Geolocation if granted
  // 3. Fallback to Tokyo
  const lastLocation = localStorage.getItem('skycast_last_location');
  if (lastLocation) {
    try {
      const parsed = JSON.parse(lastLocation);
      loadWeather(parsed);
      return;
    } catch (e) {
      console.warn('Failed parsing last location', e);
    }
  }

  detectUserGeolocation();
});

// ==========================================
// Unit Toggle (°C / °F)
// ==========================================
function setupUnitToggle() {
  const btnC = document.getElementById('unit-c');
  const btnF = document.getElementById('unit-f');

  updateToggleUI();

  btnC.addEventListener('click', () => setUnit('c'));
  btnF.addEventListener('click', () => setUnit('f'));
}

function setUnit(unit) {
  if (state.unit === unit) return;
  state.unit = unit;
  localStorage.setItem('skycast_unit', unit);
  updateToggleUI();
  if (state.weather && state.location) {
    renderWeather(state.weather, state.location);
  }
}

function updateToggleUI() {
  const btnC = document.getElementById('unit-c');
  const btnF = document.getElementById('unit-f');
  if (state.unit === 'c') {
    btnC.classList.add('active');
    btnF.classList.remove('active');
  } else {
    btnF.classList.add('active');
    btnC.classList.remove('active');
  }
}

function formatTemp(celsiusVal) {
  if (celsiusVal === undefined || celsiusVal === null) return '--';
  if (state.unit === 'f') {
    return Math.round((celsiusVal * 9) / 5 + 32);
  }
  return Math.round(celsiusVal);
}

function formatWindSpeed(kmhVal) {
  if (kmhVal === undefined || kmhVal === null) return '--';
  if (state.unit === 'f') {
    return `${Math.round(kmhVal * 0.621371)} mph`;
  }
  return `${Math.round(kmhVal)} km/h`;
}

// ==========================================
// Geolocation & Fallback
// ==========================================
async function detectUserGeolocation(usePreciseGps = false) {
  if (usePreciseGps) {
    showToast('Requesting GPS location...', '📍');
    if (!navigator.geolocation) {
      showToast('Precise GPS not supported. Using network location.', 'ℹ️');
      return detectIpLocation();
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          const data = await res.json();
          const cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
          const country = data.countryName || '';
          const loc = { name: cityName, country, lat, lon, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto' };
          loadWeather(loc);
          showToast(`Located: ${cityName}, ${country}`, '✅');
        } catch (err) {
          loadWeather({ name: 'My Location', country: '', lat, lon, timezone: 'auto' });
        }
      },
      (err) => {
        console.warn('GPS location declined or failed:', err.message);
        showToast('GPS permission denied. Using network location.', 'ℹ️');
        detectIpLocation();
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
    return;
  }

  // Fast automatic IP detection on load
  await detectIpLocation();
}

async function detectIpLocation() {
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
    if (!res.ok) throw new Error('IP geolocation request failed');
    const data = await res.json();

    if (data.latitude && data.longitude) {
      const cityName = data.city || data.locality || data.principalSubdivision || 'Local Area';
      const country = data.countryName || '';
      const loc = {
        name: cityName,
        country: country,
        lat: data.latitude,
        lon: data.longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
      };
      loadWeather(loc);
      return;
    }
  } catch (err) {
    console.warn('IP detection failed, falling back to default:', err);
  }

  // Final fallback to iconic Tokyo
  fallbackToDefault('Loaded default location: Tokyo, Japan');
}

function fallbackToDefault(message) {
  if (message) showToast(message, 'ℹ️');
  // Default to Tokyo
  loadWeather({
    name: 'Tokyo',
    country: 'Japan',
    lat: 35.6895,
    lon: 139.69171,
    timezone: 'Asia/Tokyo'
  });
}

// ==========================================
// Weather Data Fetcher (Open-Meteo)
// ==========================================
async function loadWeather(location) {
  state.location = location;
  localStorage.setItem('skycast_last_location', JSON.stringify(location));
  updateFavoriteButtonState();

  const refreshBtn = document.getElementById('refresh-btn');
  const refreshIcon = refreshBtn ? refreshBtn.querySelector('.refresh-icon') : null;
  if (refreshIcon) refreshIcon.classList.add('spinning');

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather fetch error: ${response.status}`);
    const data = await response.json();
    state.weather = data;

    renderWeather(data, location);
  } catch (error) {
    console.error('Error fetching weather:', error);
    showToast('Failed to retrieve weather data. Please try again.', '⚠️');
  } finally {
    if (refreshIcon) {
      setTimeout(() => refreshIcon.classList.remove('spinning'), 600);
    }
  }
}

// ==========================================
// Render Weather Dashboard
// ==========================================
function renderWeather(data, location) {
  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;

  const weatherMeta = getWeatherDetails(current.weather_code, current.is_day);

  // 1. Update Body Theme Class & Canvas Particle Mode
  document.body.className = weatherMeta.theme;
  if (window.weatherCanvas) {
    window.weatherCanvas.setMode(weatherMeta.particle);
  }

  // 2. Hero Card Info
  document.getElementById('hero-city').textContent = location.name;
  document.getElementById('hero-country').textContent = location.country ? `${location.country}` : 'Global Coordinates';
  
  // Format local time from API or timezone
  updateHeroDateTime(data.timezone);

  document.getElementById('hero-condition-text').textContent = weatherMeta.desc;
  document.getElementById('hero-icon-container').innerHTML = getIconSvg(weatherMeta.icon);

  // Temps
  document.getElementById('hero-temp').textContent = formatTemp(current.temperature_2m);
  document.getElementById('hero-temp-unit').textContent = state.unit === 'f' ? '°F' : '°C';
  document.getElementById('hero-feels').textContent = `${formatTemp(current.apparent_temperature)}°`;
  
  if (daily && daily.temperature_2m_max && daily.temperature_2m_min) {
    document.getElementById('hero-max').textContent = `${formatTemp(daily.temperature_2m_max[0])}°`;
    document.getElementById('hero-min').textContent = `${formatTemp(daily.temperature_2m_min[0])}°`;
  }

  // Hero Ribbon
  document.getElementById('ribbon-wind').textContent = formatWindSpeed(current.wind_speed_10m);
  document.getElementById('ribbon-humidity').textContent = `${Math.round(current.relative_humidity_2m)}%`;
  const todayPop = (daily && daily.precipitation_probability_max) ? daily.precipitation_probability_max[0] : 0;
  document.getElementById('ribbon-rain-chance').textContent = `${todayPop}%`;
  const todayUv = (daily && daily.uv_index_max) ? daily.uv_index_max[0] : 0;
  document.getElementById('ribbon-uv').textContent = todayUv !== undefined ? todayUv.toFixed(1) : '--';

  // 3. Metrics Cards
  renderDetailedMetrics(current, daily);

  // 4. Hourly Forecast & Chart
  renderHourlyForecast(hourly, current.time);

  // 5. 7-Day Daily Forecast
  renderDailyForecast(daily);
}

function updateHeroDateTime(timezone) {
  const dateElem = document.getElementById('hero-datetime');
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone || undefined
    });
    dateElem.textContent = formatter.format(now);
  } catch (e) {
    dateElem.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit' });
  }
}

// ==========================================
// Render Detailed Metric Cards
// ==========================================
function renderDetailedMetrics(current, daily) {
  // Wind & Gusts
  document.getElementById('metric-wind-speed').innerHTML = `${formatWindSpeed(current.wind_speed_10m).split(' ')[0]} <span class="unit">${state.unit === 'f' ? 'mph' : 'km/h'}</span>`;
  document.getElementById('metric-wind-dir').textContent = `Direction: ${current.wind_direction_10m}° (${getWindCardinal(current.wind_direction_10m)})`;
  document.getElementById('metric-wind-gust').textContent = `Gusts: ${formatWindSpeed(current.wind_gusts_10m)}`;

  // Animate compass pointer
  const pointer = document.getElementById('compass-pointer');
  if (pointer) {
    pointer.style.transform = `rotate(${current.wind_direction_10m}deg)`;
  }

  // Humidity
  document.getElementById('metric-humidity').innerHTML = `${Math.round(current.relative_humidity_2m)}<span class="unit">%</span>`;
  const humidityFill = document.getElementById('humidity-fill');
  if (humidityFill) {
    humidityFill.style.width = `${Math.min(100, Math.max(0, current.relative_humidity_2m))}%`;
  }
  const humCaption = document.getElementById('humidity-caption');
  if (current.relative_humidity_2m < 35) {
    humCaption.textContent = 'Air feels dry. Stay hydrated.';
  } else if (current.relative_humidity_2m <= 65) {
    humCaption.textContent = 'Optimal comfort level.';
  } else {
    humCaption.textContent = 'High humidity. Air feels muggy.';
  }

  // UV Index
  const uvVal = (daily && daily.uv_index_max) ? daily.uv_index_max[0] : 0;
  document.getElementById('metric-uv').textContent = uvVal.toFixed(1);
  const uvIndicator = document.getElementById('uv-indicator');
  if (uvIndicator) {
    const uvPercent = Math.min(100, Math.max(0, (uvVal / 11) * 100));
    uvIndicator.style.left = `${uvPercent}%`;
  }
  const uvCaption = document.getElementById('metric-uv-caption');
  if (uvVal <= 2) {
    uvCaption.textContent = 'Low risk: No protection needed.';
  } else if (uvVal <= 5) {
    uvCaption.textContent = 'Moderate: Wear sunglasses & SPF.';
  } else if (uvVal <= 7) {
    uvCaption.textContent = 'High: Seek shade during midday.';
  } else if (uvVal <= 10) {
    uvCaption.textContent = 'Very High: Sun protection essential.';
  } else {
    uvCaption.textContent = 'Extreme: Avoid sun exposure.';
  }

  // Sun Cycle & Arc Path
  renderSunCycle(daily);

  // Pressure
  const pressure = current.pressure_msl ? Math.round(current.pressure_msl) : 1013;
  document.getElementById('metric-pressure').innerHTML = `${pressure} <span class="unit">hPa</span>`;
  const needle = document.getElementById('pressure-needle');
  if (needle) {
    // Normal range: 970 to 1050
    const pressPercent = Math.min(100, Math.max(0, ((pressure - 970) / (1050 - 970)) * 100));
    needle.style.left = `${pressPercent}%`;
  }
  const pressureCaption = document.getElementById('metric-pressure-caption');
  if (pressure > 1020) {
    pressureCaption.textContent = 'High pressure system (fair skies).';
  } else if (pressure < 1005) {
    pressureCaption.textContent = 'Low pressure system (stormy/cloudy).';
  } else {
    pressureCaption.textContent = 'Normal barometric pressure.';
  }

  // Cloud Cover & Precipitation
  document.getElementById('metric-cloud-cover').textContent = `${Math.round(current.cloud_cover)}%`;
  document.getElementById('metric-precip').textContent = `${(current.precipitation || 0).toFixed(1)} mm`;
  const precipCaption = document.getElementById('metric-precip-caption');
  if (current.precipitation > 0) {
    precipCaption.textContent = `Precipitation active (${current.precipitation} mm).`;
  } else {
    precipCaption.textContent = 'No current rainfall reported.';
  }
}

function getWindCardinal(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

// ==========================================
// Sun Cycle Arc Visualization
// ==========================================
function renderSunCycle(daily) {
  if (!daily || !daily.sunrise || !daily.sunset) return;

  const sunriseStr = daily.sunrise[0];
  const sunsetStr = daily.sunset[0];

  const sunriseDate = new Date(sunriseStr);
  const sunsetDate = new Date(sunsetStr);

  const formatOpts = { hour: 'numeric', minute: '2-digit', hour12: true };
  document.getElementById('metric-sunrise').textContent = sunriseDate.toLocaleTimeString([], formatOpts);
  document.getElementById('metric-sunset').textContent = sunsetDate.toLocaleTimeString([], formatOpts);

  // Calculate day progress (0 to 1)
  const now = new Date();
  const sunriseTime = sunriseDate.getTime();
  const sunsetTime = sunsetDate.getTime();
  const currentTime = now.getTime();

  let progress = 0;
  if (currentTime <= sunriseTime) {
    progress = 0;
  } else if (currentTime >= sunsetTime) {
    progress = 1;
  } else {
    progress = (currentTime - sunriseTime) / (sunsetTime - sunriseTime);
  }

  // Arc path: M 20 90 A 80 80 0 0 1 180 90
  // Arc center: (100, 90), Radius = 80
  // Angle goes from PI (180deg) to 0 (0deg)
  const angle = Math.PI - progress * Math.PI;
  const dotX = 100 + 80 * Math.cos(angle);
  const dotY = 90 - 80 * Math.sin(angle);

  const dot = document.getElementById('sun-arc-dot');
  if (dot) {
    dot.setAttribute('cx', dotX);
    dot.setAttribute('cy', dotY);
  }

  const arcProgress = document.getElementById('sun-arc-progress');
  if (arcProgress) {
    // Total arc length is ~ 251.3
    const totalLength = 251.3;
    const offset = totalLength * (1 - progress);
    arcProgress.style.strokeDashoffset = offset;
  }
}

// ==========================================
// Hourly Forecast & Curve Chart
// ==========================================
function renderHourlyForecast(hourly, currentTimeStr) {
  if (!hourly || !hourly.time) return;

  const strip = document.getElementById('hourly-strip');
  strip.innerHTML = '';

  // Find start index matching current time or next hour
  let startIndex = 0;
  if (currentTimeStr) {
    const currentPrefix = currentTimeStr.slice(0, 13); // 'YYYY-MM-DDTHH'
    const foundIdx = hourly.time.findIndex(t => t.startsWith(currentPrefix));
    if (foundIdx !== -1) startIndex = foundIdx;
  }

  // Take 24 hours
  const hoursCount = 24;
  const items = [];
  const chartTemps = [];

  for (let i = startIndex; i < startIndex + hoursCount && i < hourly.time.length; i++) {
    const timeIso = hourly.time[i];
    const tempC = hourly.temperature_2m[i];
    const code = hourly.weather_code[i];
    const pop = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;
    
    // Determine if day or night for that hour based on hour (roughly 6am to 8pm)
    const d = new Date(timeIso);
    const hourNum = d.getHours();
    const isDayHour = hourNum >= 6 && hourNum < 20 ? 1 : 0;
    const weatherMeta = getWeatherDetails(code, isDayHour);

    chartTemps.push(tempC);

    const timeLabel = i === startIndex ? 'Now' : d.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    items.push({
      timeLabel,
      temp: formatTemp(tempC),
      iconSvg: getIconSvg(weatherMeta.icon),
      pop
    });
  }

  // Draw SVG Temperature Line
  drawHourlySvgChart(chartTemps);

  // Render cards
  items.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = `hourly-item ${idx === 0 ? 'active' : ''}`;
    div.innerHTML = `
      <span class="hourly-time">${item.timeLabel}</span>
      <div class="hourly-icon">${item.iconSvg}</div>
      <span class="hourly-temp">${item.temp}°</span>
      <span class="hourly-pop">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="#38bdf8"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
        ${item.pop}%
      </span>
    `;
    strip.appendChild(div);
  });
}

function drawHourlySvgChart(tempList) {
  const svg = document.getElementById('hourly-chart-svg');
  if (!svg || tempList.length === 0) return;

  const width = svg.clientWidth || 600;
  const height = svg.clientHeight || 65;

  const minTemp = Math.min(...tempList);
  const maxTemp = Math.max(...tempList);
  const range = maxTemp - minTemp || 1;

  const paddingY = 12;
  const stepX = width / (tempList.length - 1);

  const points = tempList.map((t, idx) => {
    const x = idx * stepX;
    // higher temp = lower y
    const y = height - paddingY - ((t - minTemp) / range) * (height - paddingY * 2);
    return { x, y };
  });

  // Generate smooth SVG curve path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    pathD += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const fillD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.innerHTML = `
    <defs>
      <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <path d="${fillD}" fill="url(#chart-area-grad)" />
    <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  `;
}

// ==========================================
// 7-Day Extended Forecast
// ==========================================
function renderDailyForecast(daily) {
  if (!daily || !daily.time) return;

  const list = document.getElementById('forecast-daily-list');
  list.innerHTML = '';

  // Find min and max across whole week for relative progress bar
  const weekMin = Math.min(...daily.temperature_2m_min);
  const weekMax = Math.max(...daily.temperature_2m_max);
  const weekRange = weekMax - weekMin || 1;

  const daysCount = Math.min(7, daily.time.length);

  for (let i = 0; i < daysCount; i++) {
    const dateStr = daily.time[i];
    const code = daily.weather_code[i];
    const maxT = daily.temperature_2m_max[i];
    const minT = daily.temperature_2m_min[i];
    const pop = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;

    const weatherMeta = getWeatherDetails(code, 1);
    const dateObj = new Date(dateStr + 'T00:00:00');

    let dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString([], { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

    // Slider bar calculation relative to week
    const leftPercent = Math.max(0, ((minT - weekMin) / weekRange) * 100);
    const rightPercent = Math.min(100, ((maxT - weekMin) / weekRange) * 100);
    const widthPercent = Math.max(8, rightPercent - leftPercent);

    const row = document.createElement('div');
    row.className = `forecast-row ${i === 0 ? 'today' : ''}`;
    row.innerHTML = `
      <div class="forecast-day-info">
        <span class="forecast-day-name">${dayName}</span>
        <span class="forecast-date">${formattedDate}</span>
      </div>

      <div class="forecast-icon-wrap" title="${weatherMeta.desc}">
        ${getIconSvg(weatherMeta.icon)}
      </div>

      <div class="forecast-bar-wrap">
        <span class="forecast-min-text">${formatTemp(minT)}°</span>
        <div class="forecast-track">
          <div class="forecast-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
        </div>
        <span class="forecast-max-text">${formatTemp(maxT)}°</span>
      </div>

      <div class="forecast-rain-prob">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="#38bdf8"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
        ${pop}%
      </div>
    `;
    list.appendChild(row);
  }
}

// ==========================================
// Search & Autocomplete
// ==========================================
function setupSearchInput() {
  const input = document.getElementById('location-search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  const spinner = document.getElementById('search-spinner');
  const dropdown = document.getElementById('suggestions-dropdown');

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearBtn.style.display = query ? 'flex' : 'none';

    if (state.debounceTimer) clearTimeout(state.debounceTimer);

    if (query.length < 2) {
      dropdown.style.display = 'none';
      return;
    }

    spinner.style.display = 'block';
    state.debounceTimer = setTimeout(async () => {
      await fetchCitySuggestions(query);
      spinner.style.display = 'none';
    }, 280);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    dropdown.style.display = 'none';
    input.focus();
  });

  // Keyboard navigation for dropdown
  input.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.suggestion-item');
    if (!items.length || dropdown.style.display === 'none') {
      if (e.key === 'Enter' && input.value.trim()) {
        searchCityDirect(input.value.trim());
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.activeSuggestionIndex = (state.activeSuggestionIndex + 1) % items.length;
      updateSuggestionHighlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.activeSuggestionIndex = (state.activeSuggestionIndex - 1 + items.length) % items.length;
      updateSuggestionHighlight(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (state.activeSuggestionIndex >= 0 && state.activeSuggestionIndex < items.length) {
        items[state.activeSuggestionIndex].click();
      } else {
        searchCityDirect(input.value.trim());
      }
    } else if (e.key === 'Escape') {
      dropdown.style.display = 'none';
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      dropdown.style.display = 'none';
    }
  });
}

function updateSuggestionHighlight(items) {
  items.forEach((item, idx) => {
    if (idx === state.activeSuggestionIndex) {
      item.classList.add('focused');
      item.scrollIntoView({ block: 'nearest' });
    } else {
      item.classList.remove('focused');
    }
  });
}

async function fetchCitySuggestions(query) {
  const dropdown = document.getElementById('suggestions-dropdown');
  state.activeSuggestionIndex = -1;

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      dropdown.innerHTML = `<div class="suggestion-empty">No cities found for "${query}"</div>`;
      dropdown.style.display = 'block';
      return;
    }

    state.suggestions = data.results;
    dropdown.innerHTML = '';

    data.results.forEach((item, index) => {
      const country = item.country || '';
      const admin = item.admin1 ? `${item.admin1}, ` : '';
      const flag = getCountryFlag(item.country_code);

      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.setAttribute('data-index', index);
      div.innerHTML = `
        <span class="suggestion-flag">${flag}</span>
        <div class="suggestion-info">
          <span class="suggestion-name">${item.name}</span>
          <span class="suggestion-details">${admin}${country}</span>
        </div>
      `;

      div.addEventListener('click', () => {
        selectLocation({
          name: item.name,
          country: item.country || '',
          lat: item.latitude,
          lon: item.longitude,
          timezone: item.timezone || 'auto'
        });
        dropdown.style.display = 'none';
        document.getElementById('location-search-input').value = item.name;
      });

      dropdown.appendChild(div);
    });

    dropdown.style.display = 'block';
  } catch (err) {
    console.error('Autocomplete error:', err);
    dropdown.style.display = 'none';
  }
}

async function searchCityDirect(query) {
  const dropdown = document.getElementById('suggestions-dropdown');
  dropdown.style.display = 'none';

  try {
    showToast(`Searching for "${query}"...`, '🔍');
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const first = data.results[0];
      selectLocation({
        name: first.name,
        country: first.country || '',
        lat: first.latitude,
        lon: first.longitude,
        timezone: first.timezone || 'auto'
      });
      document.getElementById('location-search-input').value = first.name;
    } else {
      showToast(`City "${query}" not found. Please try another query.`, '⚠️');
    }
  } catch (err) {
    showToast('Failed to search location.', '⚠️');
  }
}

function selectLocation(loc) {
  loadWeather(loc);
}

function getCountryFlag(countryCode) {
  if (!countryCode) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

// ==========================================
// Action Buttons: Location, Refresh, Fav
// ==========================================
function setupActionButtons() {
  // My Location
  document.getElementById('current-location-btn').addEventListener('click', () => {
    detectUserGeolocation(true);
  });

  // Refresh
  document.getElementById('refresh-btn').addEventListener('click', () => {
    if (state.location) {
      showToast(`Refreshing weather for ${state.location.name}...`, '🔄');
      loadWeather(state.location);
    }
  });

  // Favorite button
  const favBtn = document.getElementById('fav-toggle-btn');
  favBtn.addEventListener('click', () => {
    toggleFavorite();
  });

  // Hourly strip scroll arrows
  const hourlyStrip = document.getElementById('hourly-strip');
  document.getElementById('hourly-scroll-left').addEventListener('click', () => {
    hourlyStrip.scrollBy({ left: -260, behavior: 'smooth' });
  });
  document.getElementById('hourly-scroll-right').addEventListener('click', () => {
    hourlyStrip.scrollBy({ left: 260, behavior: 'smooth' });
  });
}

// ==========================================
// Quick Chips & Favorites
// ==========================================
function setupQuickChips() {
  const chips = document.querySelectorAll('#quick-chips .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const city = chip.dataset.city;
      searchCityDirect(city);
    });
  });
}

function toggleFavorite() {
  if (!state.location) return;

  const index = state.favorites.findIndex(f => f.name.toLowerCase() === state.location.name.toLowerCase());
  if (index !== -1) {
    state.favorites.splice(index, 1);
    showToast(`Removed ${state.location.name} from favorites.`, '🗑️');
  } else {
    state.favorites.push({
      name: state.location.name,
      country: state.location.country,
      lat: state.location.lat,
      lon: state.location.lon,
      timezone: state.location.timezone
    });
    showToast(`Added ${state.location.name} to favorites!`, '⭐');
  }

  localStorage.setItem('skycast_favs', JSON.stringify(state.favorites));
  updateFavoriteButtonState();
  renderFavoritesChips();
}

function updateFavoriteButtonState() {
  const favBtn = document.getElementById('fav-toggle-btn');
  if (!favBtn || !state.location) return;

  const isFav = state.favorites.some(f => f.name.toLowerCase() === state.location.name.toLowerCase());
  if (isFav) {
    favBtn.classList.add('favorited');
    favBtn.setAttribute('title', 'Remove from favorites');
  } else {
    favBtn.classList.remove('favorited');
    favBtn.setAttribute('title', 'Save to favorites');
  }
}

function renderFavoritesChips() {
  const wrap = document.getElementById('favorites-wrap');
  wrap.innerHTML = '';

  state.favorites.forEach((fav) => {
    const chip = document.createElement('button');
    chip.className = 'chip fav-chip';
    chip.innerHTML = `
      <span>⭐ ${fav.name}</span>
      <span class="remove-fav" title="Remove">&times;</span>
    `;

    chip.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-fav')) {
        e.stopPropagation();
        state.favorites = state.favorites.filter(f => f.name !== fav.name);
        localStorage.setItem('skycast_favs', JSON.stringify(state.favorites));
        updateFavoriteButtonState();
        renderFavoritesChips();
      } else {
        selectLocation(fav);
      }
    });

    wrap.appendChild(chip);
  });
}

// ==========================================
// Toast Banner Notification
// ==========================================
let toastTimeout = null;
function showToast(message, icon = 'ℹ️') {
  const banner = document.getElementById('toast-banner');
  const iconElem = banner.querySelector('.toast-icon');
  const msgElem = document.getElementById('toast-message');

  iconElem.textContent = icon;
  msgElem.textContent = message;
  banner.style.display = 'flex';

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    banner.style.display = 'none';
  }, 4000);
}
