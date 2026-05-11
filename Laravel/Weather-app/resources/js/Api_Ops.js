const form = document.getElementById("searchForm");
const locationBtn = document.getElementById("locationBtn");

function getDailyForecast(forecastday) {
    if (!forecastday) return [];
    return forecastday.map((item) => ({
        date: item.date,
        min: item.day.mintemp_c,
        max: item.day.maxtemp_c,
    }));
}

// async function fetchHistory() {
//     const res = await fetch("DB_Ops.php?action=GetSearchHistory");
//     const history = await res.json();
//     renderHistory(history);
// }

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

function getWeather(city) {
    city = city.replace("`","");
    if (!validateCityInput(city)) return;

    // fetch(
    //     "DB_Ops.php?action=LogSearch&cityName=" + encodeURIComponent(city)
    // ).catch(() => {});

    fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "city=" + encodeURIComponent(city)
    })
    .then((res) => res.json())
    .then((data) => {

        if (data.error) {
            alert("API Error: " + data.error.message);
            return;
        }

        const weather = data.data;

        const locationDisplay = weather.location.region
            ? `${weather.location.name}, ${weather.location.region}`
            : weather.location.name;

        document.getElementById("cityName").innerHTML = locationDisplay;
        document.getElementById("cityInput").value = locationDisplay;
        document.getElementById("dateText").innerHTML = weather.location.localtime;

        document.getElementById("temperature").innerHTML = Math.round(weather.current.temp_c) + "°C";

        document.getElementById("weatherDescription").innerHTML = weather.current.condition.text;

        const cards = document.querySelectorAll(".weather-card__value");

        if (cards.length >= 4) {
            cards[0].textContent = weather.current.humidity + "%";
            cards[1].textContent = weather.current.wind_kph + " kph";
            cards[2].textContent = weather.current.pressure_mb + " hPa";
            cards[3].textContent = weather.current.vis_km + " km";
        }

        if (weather.forecast && weather.forecast.forecastday) {
            const dailyData = getDailyForecast(weather.forecast.forecastday);
            const forecastList = document.querySelectorAll(".forecast-item");

            dailyData.forEach((day, index) => {
                if (forecastList[index]) {
                    const dateObj = new Date(day.date);

                    const dayName = dateObj.toLocaleDateString("en-US", {
                        weekday: "short",
                    });

                    forecastList[index].innerHTML =
                        `${dayName}<br>${Math.round(day.max)}° / ${Math.round(day.min)}°`;
                }
            });
        }

        //fetchHistory();
    })
    .catch((error) => {
        console.log("Critical Error:", error);
        alert("Check console for the server error response.");
    });
}

function loadCurrentLocationWeather() {
    if (navigator.geolocation) {
        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 15000,
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

if (locationBtn) {
    locationBtn.addEventListener("click", loadCurrentLocationWeather);
}

form.addEventListener( 'submit', function(event){
    event.preventDefault();
    
    getWeather(form["city"].value)
});
