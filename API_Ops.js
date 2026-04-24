async function fetchHistory() {
  const res = await fetch("DB_Ops.php?action=GetSearchHistory");
  const history = await res.json();
  renderHistory(history);
}

async function deleteHistoryItem(id) {
  await fetch(`DB_Ops.php?action=DeleteHistoryItem&id=${id}`);
  fetchHistory();
}

function renderHistory(history) {
  const list = document.getElementById("historyList");
  if (!history || history.length === 0) {
    list.innerHTML =
      '<li class="small text-light-emphasis">No recent searches.</li>';
    return;
  }
  list.innerHTML = history
    .map(
      (item) => `
        <li class="d-flex justify-content-between align-items-center mb-2">
            <span class="cursor-pointer" style="cursor:pointer" onclick="getWeather('${item.City_Name}')">${item.City_Name}</span>
            <button class="btn-close btn-close-white" style="font-size: 0.6rem;" onclick="deleteHistoryItem(${item.ID})"></button>
        </li>
    `
    )
    .join("");
}

function getDailyForecast(forecastday) {
  if (!forecastday) return [];
  return forecastday.map((item) => ({
    date: item.date,
    min: item.day.mintemp_c,
    max: item.day.maxtemp_c,
  }));
}
function validateCityInput(city) {
    const trimmedCity = city.trim();
    
    if (trimmedCity === "") {
        alert("Please enter a city name.");
        return false;
    }

    if (trimmedCity.length > 100) {
        alert("City name is too long (Max 100 characters).");
        return false;
    }


    const cityRegex = /^[a-zA-Z0-9\s,\.-]+$/;
    if (!cityRegex.test(trimmedCity)) {
        alert("Invalid characters detected. Please use only letters and standard punctuation.");
        return false;
    }

    return true;
}
var getWeather = function (city) {
    city = city.replace("`","");
  if (!validateCityInput(city)) return;

  fetch(
    "DB_Ops.php?action=LogSearch&cityName=" + encodeURIComponent(city)
  ).catch(() => {});

  fetch("API_Ops.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "city_name=" + encodeURIComponent(city),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert("API Error: " + data.error.message);
        return;
      }

      const locationDisplay = data.location.region
        ? `${data.location.name}, ${data.location.region}`
        : data.location.name;
      document.getElementById("cityName").innerHTML = locationDisplay;
      document.getElementById("cityInput").value = locationDisplay;
      document.getElementById("dateText").innerHTML = data.location.localtime;
      document.getElementById("temperature").innerHTML =
        Math.round(data.current.temp_c) + "°C";
      document.getElementById("weatherDescription").innerHTML =
        data.current.condition.text;

      const cards = document.querySelectorAll(".weather-card__value");
      if (cards.length >= 4) {
        cards[0].textContent = data.current.humidity + "%";
        cards[1].textContent = data.current.wind_kph + " kph";
        cards[2].textContent = data.current.pressure_mb + " hPa";
        cards[3].textContent = data.current.vis_km + " km";
      }

      if (data.forecast && data.forecast.forecastday) {
        const dailyData = getDailyForecast(data.forecast.forecastday);
        const forecastList = document.querySelectorAll(".forecast-item");

        dailyData.forEach((day, index) => {
          if (forecastList[index]) {
            const dateObj = new Date(day.date);
            const dayName = dateObj.toLocaleDateString("en-US", {
              weekday: "short",
            });
            forecastList[index].innerHTML = `${dayName}<br>${Math.round(
              day.max
            )}° / ${Math.round(day.min)}°`;
          }
        });
      }
      fetchHistory();
    })
    .catch((error) => {
      console.error("Critical Error:", error);
      alert("Check console for the server error response.");
    });
};

document.addEventListener("DOMContentLoaded", function () {
  fetchHistory();
  const form = document.getElementById("searchForm");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      getWeather(form["city"].value);
    });
  }

  function loadCurrentLocationWeather() {
    if (navigator.geolocation) {
      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          console.log(`Sending Coordinates: Lat ${lat}, Lon ${lon}`);

          getWeather(`${lat},${lon}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        geoOptions
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  const locationBtn = document.getElementById("locationBtn");
  if (locationBtn) {
    locationBtn.addEventListener("click", loadCurrentLocationWeather);
  }

  loadCurrentLocationWeather();

  const savedList = document.getElementById("savedCitiesList");
  if (savedList) {
    savedList.addEventListener("click", function (e) {
      if (e.target.classList.contains("saved-city-name")) {
        getWeather(e.target.dataset.city);
      }
    });
  }
});
