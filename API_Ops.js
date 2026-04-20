var getWeather = function(city) {
    fetch("DB_Ops.php?action=LogSearch&cityName=" + city, {
        method: "GET"
    })
    .then(res => res.json())
    .then(response => {
        console.log(response);
    })

    fetch("API_Ops.php", {
        method: "POST",
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded"
        },
        body: "city_name=" + encodeURIComponent(city)
    })
    .then(res => res.json())
    .then(response => {
        console.log(response.current_weather);
        console.log(response.forecast);

        document.getElementById("cityName").innerHTML = response.current_weather.name;
        document.getElementById("dateText").innerHTML = response.current_weather.dt_txt;
        document.getElementById("temperature").innerHTML = response.current_weather.main.temprature + response.current_weather.main.temprature_unit;
        document.getElementById("weatherDescription").innerHTML = response.current_weather.weather[0].description;

        const cards = document.querySelectorAll(".weather-card__value");

        cards[0].textContent = response.current_weather.main.humidity + response.current_weather.main.humidity_unit;
        cards[1].textContent = response.current_weather.wind.speed + " " + response.current_weather.wind.speed_unit;
        cards[2].textContent = response.current_weather.main.pressure + response.current_weather.main.humidity_unit;
        cards[3].textContent = response.current_weather.visibility_distance + " "  + response.current_weather.visibility_unit;
    })
}


var form = document.getElementById('searchForm');

form.addEventListener('submit', function (event){
    event.preventDefault();

    getWeather(form["city"].value);
});

savedCitiesList.addEventListener('click', function (e) {
    if (e.target.classList.contains('saved-city-name')) {
        const selectedCity = e.target.dataset.city;
        getWeather(selectedCity);
    }
});