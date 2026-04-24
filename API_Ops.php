<?php

error_reporting(0);
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $city = trim(htmlspecialchars($_POST['city_name'], ENT_QUOTES | ENT_HTML5, 'UTF-8'));

    // Validation
    if (empty($city)) {
        die(json_encode(["error" => ["message" => "City name is required."]]));
    }

    if (!preg_match("/^[a-zA-Z0-9\s,\.-]+$/", $city)) {
        die(json_encode(["error" => ["message" => "Invalid city name or coordinates format."]]));
    }

    $apiKey = "8a617e38eabb4190999130404262304";
    $days = 3;
    $url = "https://api.weatherapi.com/v1/forecast.json?key=$apiKey&q=" . urlencode($city) . "&days=3&aqi=no&alerts=no";

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CUSTOMREQUEST => "GET",
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    header('Content-Type: application/json');
    if ($err) {
        echo json_encode(["error" => ["message" => "cURL Error: " . $err]]);
    } else {
        echo $response;
    }
}
?>