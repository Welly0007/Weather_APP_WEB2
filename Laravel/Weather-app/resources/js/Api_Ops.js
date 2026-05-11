
var form = document.getElementById("searchForm");
form.addEventListener( 'submit', function(event){
    event.preventDefault();
    
    fetch("/api/Weather", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "city=" + encodeURIComponent(form["city"].value)
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
        console.log("Critical Error:", error);
        alert("Check console for the server error response.");
        });
});
