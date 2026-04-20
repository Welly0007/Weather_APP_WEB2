// function current weather
//  - add the city to log history
//  - call API
//  - return the response using DOM
// listener to Get Weather button
// listener to click on the city name at saved cities
// then call the function current weather

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
        console.log(response);
        console.log(response[0].name);

        //document.getElementById("cityName").innerHTML = response[0].name;
    })
}





var form = document.getElementById('searchForm');


form.addEventListener('submit', function (event){
    event.preventDefault();

    getWeather(form["city"].value);
});