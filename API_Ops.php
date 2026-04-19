// https://rapidapi.com/maruf111/api/weather-api167

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $city = trim($_POST['city']);

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


    // Now you can safely use it in API request

   $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://weather-api167.p.rapidapi.com/api/weather/forecast?place=$city%2CGB&cnt=3&units=standard&type=three_hour&mode=json&lang=en",
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
            "x-rapidapi-key: e118051ceemsh2cd558e05d6c14fp1a0b42jsn334814ffb68b"
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    //curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        echo $response;
    }

}
?>