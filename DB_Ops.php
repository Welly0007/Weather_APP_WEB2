<?php
error_reporting(0);
$host = "localhost";
$username = "root";
$password = "";
$dbname = "WeatherDB";

$conn = new mysqli($host, $username, $password, $dbname) or die("Connection failed: " . $conn->connect_error);

header("Content-Type: application/json");

function SaveCity($cityName, $CountryCode)
{

    $NewCityName = htmlspecialchars(trim($cityName), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $NewCountryCode = htmlspecialchars(trim($CountryCode), ENT_QUOTES | ENT_HTML5, 'UTF-8');

    if (empty($NewCityName) || empty($NewCountryCode)) {
        return [
            "status" => "error",
            "message" => "City name And country code cannot be empty."
        ];
    } else if (strlen($NewCityName) > 100 || strlen($NewCountryCode) > 10) {
        return [
            "status" => "error",
            "message" => "City name cannot exceed 100 characters and country code cannot exceed 10 characters."
        ];
    }

    global $conn;
    $sql = "INSERT INTO saved_cities(City_Name, Country_Code) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $NewCityName, $NewCountryCode);
    $Result = $stmt->execute();
    $stmt->close();

    if ($Result === false) {
        return [
            "status" => "error",
            "message" => "Failed to save city. Please try again."
        ];
    } else {
        return [
            "status" => "success",
            "message" => "City saved successfully."
        ];
    }
}

function GetSavedCities()
{
    global $conn;
    $sql = "SELECT ID,City_Name, Country_Code FROM saved_cities";
    $result = $conn->query($sql);
    $cities = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $cities[] = $row;
        }
    }
    return json_encode($cities);
}

function GetSavedCity($ID)
{
    $NewID = intval($ID);

    if ($NewID <= 0) {
        return [
            "status" => "error",
            "message" => "Invalid city ID."
        ];
    }

    global $conn;
    $sql = "SELECT ID, City_Name, Country_Code FROM saved_cities WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $NewID);
    $stmt->execute();
    $result = $stmt->get_result();
    $city = null;
    if ($result->num_rows > 0) {
        $city = $result->fetch_assoc();
    }
    $stmt->close();

    if ($city === null) {
        return [
            "status" => "error",
            "message" => "City not found."
        ];
    } else {
        return json_encode($city);
    }
}

function DeleteCity($ID)
{

    $NewID = intval($ID);

    if ($NewID <= 0) {
        return [
            "status" => "error",
            "message" => "Invalid city ID."
        ];
    }

    global $conn;

    $sql = "DELETE FROM saved_cities WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $NewID);
    $Result = $stmt->execute();
    $stmt->close();

    if ($Result === false) {
        return [
            "status" => "error",
            "message" => "Failed to delete city. Please try again."
        ];
    } else {
        return [
            "status" => "success",
            "message" => "City deleted successfully."
        ];
    }
}

function UpdateCityName($ID, $NewCityName)
{
    $NewID = intval($ID);
    $TrimmedCityName = htmlspecialchars(trim($NewCityName), ENT_QUOTES | ENT_HTML5, 'UTF-8');

    if ($NewID <= 0) {
        return [
            "status" => "error",
            "message" => "Invalid city ID."
        ];
    } else if (empty($TrimmedCityName)) {
        return [
            "status" => "error",
            "message" => "City name cannot be empty."
        ];
    } else if (strlen($TrimmedCityName) > 100) {
        return [
            "status" => "error",
            "message" => "City name cannot exceed 100 characters."
        ];
    }

    global $conn;
    $sql = "UPDATE saved_cities SET City_Name = ? WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $TrimmedCityName, $NewID);
    $Result = $stmt->execute();
    $stmt->close();

    if ($Result === false) {
        return [
            "status" => "error",
            "message" => "Failed to update city name. Please try again."
        ];
    } else {
        return [
            "status" => "success",
            "message" => "City name updated successfully."
        ];
    }

}


function LogSearch($CityName)
{
    $TrimmedCityName = htmlspecialchars(trim($CityName), ENT_QUOTES | ENT_HTML5, 'UTF-8');

    if (empty($TrimmedCityName)) {
        return [
            "status" => "error",
            "message" => "City name cannot be empty."
        ];
    } else if (strlen($TrimmedCityName) > 100) {
        return [
            "status" => "error",
            "message" => "City name cannot exceed 100 characters."
        ];
    }

    global $conn;
    $sql = "INSERT INTO search_history(City_Name) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $TrimmedCityName);
    $Result = $stmt->execute();
    $stmt->close();

    if ($Result === false) {
        return [
            "status" => "error",
            "message" => "Failed to log search. Please try again."
        ];
    } else {
        return [
            "status" => "success",
            "message" => "Search logged successfully."
        ];
    }
}

function GetSearchHistory()
{
    global $conn;
    $sql = "SELECT * FROM search_history ORDER BY Searched_at DESC";
    $result = $conn->query($sql);
    $history = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $history[] = $row;
        }
    }
    return json_encode($history);
}

function ClearSearchHistory()
{
    global $conn;
    $sql = "DELETE FROM search_history";
    $Result = $conn->query($sql);

    if ($Result === false) {
        return [
            "status" => "error",
            "message" => "Failed to clear search history. Please try again."
        ];
    } else {
        return [
            "status" => "success",
            "message" => "Search history cleared successfully."
        ];
    }
}
function DeleteHistoryItem($ID)
{
    global $conn;
    $id = intval($ID);
    $sql = "DELETE FROM search_history WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $result = $stmt->execute();
    $stmt->close();
    return ["status" => $result ? "success" : "error"];
}


$action = htmlspecialchars($_REQUEST['action'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8');

switch ($action) {
    case 'SaveCity':
        $response = SaveCity($_REQUEST['cityName'] ?? '', $_REQUEST['countryCode'] ?? '');
        break;
    case 'GetSavedCities':
        $response = GetSavedCities();
        break;
    case 'GetSavedCity':

        $response = GetSavedCity($_REQUEST['id'] ?? $_REQUEST['ID'] ?? '');
        break;
    case 'DeleteCity':
        $response = DeleteCity($_REQUEST['id'] ?? $_REQUEST['ID'] ?? '');
        break;
    case 'UpdateCityName':
        $response = UpdateCityName($_REQUEST['id'] ?? $_REQUEST['ID'] ?? '', $_REQUEST['newCityName'] ?? '');
        break;
    case 'LogSearch':
        $response = LogSearch($_REQUEST['cityName'] ?? '');
        break;
    case 'GetSearchHistory':
        $response = GetSearchHistory();
        break;
    case 'DeleteHistoryItem':
        $response = DeleteHistoryItem($_REQUEST['id'] ?? '');
        break;
    case 'ClearSearchHistory':
        $response = ClearSearchHistory();
        break;
    default:
        $response = [
            'status' => 'error',
            'message' => 'No action specified or action not found.'
        ];
        break;
}

if (is_array($response)) {
    echo json_encode($response);
} else {
    echo $response;
}

?>