<?php
error_reporting(0);
error_reporting(0);
$pageTitle = 'Weather App | Dashboard';
require __DIR__ . '/includes/header.php';
?>
<!-- Search / Controls -->
<section class="glass p-3 p-md-4 mb-4 position-relative" style="z-index: 10;" aria-label="City search section"
  id="home">
  <form class="row g-2" id="searchForm">
    <div class="col-12 col-md-6 col-xl-7 position-relative">
      <label for="cityInput" class="form-label">Search city</label>
      <input type="text" id="cityInput" class="form-control" name="city" placeholder="e.g., Cairo" />
      <div id="searchHistoryDropdown" class="search-history-dropdown">
        <ul id="searchHistoryList" class="search-history-list"></ul>
      </div>
    </div>
    <div class="col-6 col-md-3 col-xl-2 d-grid align-self-end">
      <button type="submit" class="btn btn-info text-dark fw-semibold">Get Weather</button>
    </div>
    <div class="col-6 col-md-3 col-xl-1 d-grid align-self-end">
      <button type="button" id="bookmarkBtn" class="btn btn-warning text-dark fw-semibold">Save City</button>
    </div>
    <div class="col-6 col-md-3 col-xl-1 d-grid align-self-end">
      <button type="button" id="locationBtn" class="btn btn btn-primary">Use Location</button>
    </div>
  </form>
</section>

<section class="row g-4" aria-label="Weather dashboard" id="forecast">
  <div class="col-12 col-xl-9">
    <!-- Main weather info -->
    <article class="glass p-4 mb-4" aria-label="Current weather overview">
      <p class="panel-title mb-2">Current Weather</p>
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h2 class="h3 m-0" id="cityName">------</h2>
          <p class="m-0 text-light-emphasis" id="dateText">------</p>
        </div>
        <div class="text-end">
          <p class="metric m-0" id="temperature">--°C</p>
          <p class="m-0 text-light-emphasis" id="weatherDescription">Condition</p>
        </div>
      </div>

      <hr class="border-secondary my-4" />

      <div class="row g-3">
        <div class="col-6 col-md-3">
          <div class="weather-card">
            <p class="weather-card__label">Humidity</p>
            <p class="weather-card__value">--%</p>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="weather-card">
            <p class="weather-card__label">Wind Speed</p>
            <p class="weather-card__value">-- km/h</p>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="weather-card">
            <p class="weather-card__label">Pressure</p>
            <p class="weather-card__value">---- hPa</p>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="weather-card">
            <p class="weather-card__label">Visibility</p>
            <p class="weather-card__value">-- km</p>
          </div>
        </div>
      </div>
    </article>

    <section class="glass p-3 p-md-4" aria-label="Forecast section">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="h5 m-0">3-Day Forecast</h3>
      </div>

      <div class="row lg-1 justify-content-center" id="forecastList">
        <div class="col">
          <div class="forecast-item">Day 1<br />--° / --°</div>
        </div>
        <div class="col">
          <div class="forecast-item">Day 2<br />--° / --°</div>
        </div>
        <div class="col">
          <div class="forecast-item">Day 3<br />--° / --°</div>
        </div>
      </div>
    </section>
  </div>

  <div class="col-12 col-xl-3" id="saved">
    <aside class="glass p-4 h-100" aria-label="Saved cities">
      <p class="panel-title mb-3">Saved Cities</p>
      <p class="small text-light-emphasis mt-n1">Bookmark cities from the search box.</p>

      <ul id="savedCitiesList" class="saved-cities-list list-unstyled m-0">
        <li class="saved-empty">No saved cities yet.</li>
      </ul>
    </aside>
  </div>
  <div class="col-12 col-xl-3 justify-content-md-center">
    <aside id="history" class="glass p-4 mb-4" aria-label="Search History">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <p class="panel-title m-0">Recent Searches</p>
        <button type="button" id="clear" class="btn btn btn-danger">Clear All</button>
      </div>
      <ul id="historyList" class="list-unstyled m-0">
      </ul>
    </aside>
  </div>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>