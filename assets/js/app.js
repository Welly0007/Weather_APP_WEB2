// UI-only behavior for search + saved cities list.
(function () {
  var form = document.getElementById('searchForm');
  var cityInput = document.getElementById('cityInput');
  var cityName = document.getElementById('cityName');
  var bookmarkBtn = document.getElementById('bookmarkBtn');
  var savedCitiesList = document.getElementById('savedCitiesList');
  var searchHistoryDropdown = document.getElementById('searchHistoryDropdown');
  var searchHistoryList = document.getElementById('searchHistoryList');

  if (!form || !cityInput || !savedCitiesList || !bookmarkBtn || !searchHistoryDropdown || !searchHistoryList) return;

  var savedCities = [];
  var searchHistory = [];

  function loadSearchHistory() {
    fetch("DB_Ops.php?action=GetSearchHistory", {
      method: "GET"
    })
    .then(res => res.json())
    .then(response => {
      var cities = response.map(item => item.City_Name);
      var unique = [];
      var seen = new Set();
      for (var i = cities.length - 1; i >= 0; i--) {
        var city = cities[i];
        if (!seen.has(city.toLowerCase())) {
          seen.add(city.toLowerCase());
          unique.unshift(city);
        }
      }
      searchHistory = unique;
      console.log('Loaded search history:', searchHistory);
    })
    .catch(err => console.error('Failed to load search history:', err));
  }

  function normalizeCity(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function saveSearchHistory(city) {
    var normalizedCity = normalizeCity(city);
    if (!normalizedCity) return;

    fetch("DB_Ops.php?action=LogSearch&cityName=" + encodeURIComponent(normalizedCity), {
      method: "GET"
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === 'success') {
        searchHistory = searchHistory.filter(function (item) {
          return item.toLowerCase() !== normalizedCity.toLowerCase();
        });
        searchHistory.unshift(normalizedCity);
        if (searchHistory.length > 10) {
          searchHistory = searchHistory.slice(0, 10);
        }
      }
    })
    .catch(err => console.error('Failed to save search history:', err));
  }

  function showSearchHistory() {
    searchHistoryList.innerHTML = '';

    if (searchHistory.length === 0) {
      var empty = document.createElement('li');
      empty.textContent = 'No search history';
      empty.style.padding = '0.5rem 0.75rem';
      empty.style.color = 'var(--muted)';
      empty.style.textAlign = 'center';
      searchHistoryList.appendChild(empty);
    } else {
      searchHistory.forEach(function (city) {
        var item = document.createElement('li');
        item.textContent = city;
        item.addEventListener('click', function () {
          cityInput.value = city;
          hideSearchHistory();
          cityInput.focus();
        });
        searchHistoryList.appendChild(item);
      });
    }

    searchHistoryDropdown.style.display = 'block';
  }

  function hideSearchHistory() {
    searchHistoryDropdown.style.display = 'none';
  }

  function renderSavedCities() {
    savedCitiesList.innerHTML = '';

    fetch("DB_Ops.php?action=" + "GetSavedCities", {
        method: "GET"
    })
    .then(res => res.json())
    .then(response => {
      savedCities = [];
      response.forEach(function (row) {
        savedCities.push({"city_name" : row["City_Name"], "ID" : row["ID"]});
      })
      
      if (savedCities.length === 0) {
        var empty = document.createElement('li');
        empty.className = 'saved-empty';
        empty.textContent = 'No saved cities yet.';
        savedCitiesList.appendChild(empty);
        return;
      }
    
      savedCities.forEach(function (city) {
        var item = document.createElement('li');
        item.className = 'saved-city-item';

        var nameBtn = document.createElement('button');
        nameBtn.type = 'button';
        nameBtn.className = 'btn btn-link p-0 text-decoration-none saved-city-name';
        nameBtn.dataset.city = city["city_name"];
        nameBtn.textContent = city["city_name"];

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'saved-remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', function () {
          savedCities = savedCities.filter(function (itemCity) {
            return itemCity["city_name"].toLowerCase() !== city["city_name"].toLowerCase();
          });

          fetch("DB_Ops.php?action=" + "DeleteCity" + "&ID=" + city["ID"], {
            method: "GET"
          })
          .then(res => res.json())
          .then(response=> {
              renderSavedCities();
          })
        });

        item.appendChild(nameBtn);
        item.appendChild(removeBtn);
        savedCitiesList.appendChild(item);
      });
    })
  }

  function addCurrentCityToSaved() {
    var city = normalizeCity(cityInput.value);
    if (!city) return;

    var isDuplicate = savedCities.some(function (item) {
      return item["city_name"].toLowerCase() === city.toLowerCase();
    });

    if (!isDuplicate) {
      fetch("DB_Ops.php?action=" + "SaveCity" + "&cityName=" + city + "&countryCode=200", {
          method: "GET"
        })
        .then(res => res.json())
        .then(response=> {
            savedCities.unshift({"city_name" : city, "ID" : response["ID"]});
            renderSavedCities();
      })
    }
  }

  bookmarkBtn.addEventListener('click', function () {
    addCurrentCityToSaved();
  });

  // Search history dropdown functionality
  cityInput.addEventListener('focus', function () {
    showSearchHistory();
  });

  cityInput.addEventListener('input', function () {
    if (cityInput.value.trim() === '') {
      showSearchHistory();
    } else {
      hideSearchHistory();
    }
  });

  document.addEventListener('click', function (event) {
    if (!searchHistoryDropdown.contains(event.target) && event.target !== cityInput) {
      hideSearchHistory();
    }
  });

  form.addEventListener('submit', function (event) {
    var city = normalizeCity(cityInput.value);
    if (city) {
      saveSearchHistory(city);
    }
  });
  

  renderSavedCities();
  loadSearchHistory();
})();
