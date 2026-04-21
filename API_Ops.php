
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $city = trim($_POST['city_name']);

    // Check if empty
    if (empty($city)) {
        die("City name is required.");
    }

    // Allow only letters and spaces
    if (!preg_match("/^[a-zA-Z\s]+$/", $city)) {
        die("Invalid city name. Only letters and spaces allowed.");
    }

    // Optional: limit length
    if (strlen($city) > 50) {
        die("City name is too long.");
    }

    // Sanitize input
    $city = htmlspecialchars($city);

    $responses = [];

    // ---------- FIRST REQUEST ----------    
    $curl = curl_init();

    curl_setopt_array($curl, [
	CURLOPT_URL => "https://weather-api167.p.rapidapi.com/api/weather/current?place=$city&units=metric&lang=en&mode=json",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"Accept: application/json",
		"Content-Type: application/json",
		"x-rapidapi-host: weather-api167.p.rapidapi.com",
		"x-rapidapi-key: 78cb941f06msh2a9c65dcce5b7a2p1d2bd8jsn696443305b3a"
	],
]);

    $response1 = curl_exec($curl);
    $err1 = curl_error($curl);
    curl_close($curl);

    if ($err1) {
        die("Error in request 1: " . $err1);
    }

    $data1 = json_decode($response1, true);

    // ---------- SECOND REQUEST ----------
    $curl = curl_init();

    curl_setopt_array($curl, [
	CURLOPT_URL => "https://weather-api167.p.rapidapi.com/api/weather/forecast?place=$city&cnt=40&units=metric&type=three_hour&mode=json&lang=en",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"Accept: application/json",
		"Content-Type: application/json",
		"x-rapidapi-host: weather-api167.p.rapidapi.com",
		"x-rapidapi-key: 78cb941f06msh2a9c65dcce5b7a2p1d2bd8jsn696443305b3a"
	],
]);

    $response2 = curl_exec($curl);
    $err2 = curl_error($curl);
    curl_close($curl);

    if ($err2) {
        die("Error in request 2: " . $err2);
    }

    $data2 = json_decode($response2, true);


    $final = [
        "current_weather" => $data1,
        "forecast" => $data2
    ];

    header('Content-Type: application/json');
    echo json_encode($final);
}
?>