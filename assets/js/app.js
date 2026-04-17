// UI-only behavior for search + saved cities list.
(function () {
  var form = document.getElementById('searchForm');
  var cityInput = document.getElementById('cityInput');
  var cityName = document.getElementById('cityName');
  var bookmarkBtn = document.getElementById('bookmarkBtn');
  var savedCitiesList = document.getElementById('savedCitiesList');

  if (!form || !cityInput || !savedCitiesList || !bookmarkBtn) return;

  var savedCities = [];

  function normalizeCity(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function renderSavedCities() {
    savedCitiesList.innerHTML = '';

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
      nameBtn.textContent = city;
      nameBtn.addEventListener('click', function () {
        cityInput.value = city;
        if (cityName) {
          cityName.textContent = city;
        }
      });

      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'saved-remove-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', function () {
        savedCities = savedCities.filter(function (itemCity) {
          return itemCity.toLowerCase() !== city.toLowerCase();
        });
        renderSavedCities();
      });

      item.appendChild(nameBtn);
      item.appendChild(removeBtn);
      savedCitiesList.appendChild(item);
    });
  }

  function addCurrentCityToSaved() {
    var city = normalizeCity(cityInput.value);
    if (!city) return;

    var isDuplicate = savedCities.some(function (item) {
      return item.toLowerCase() === city.toLowerCase();
    });

    if (!isDuplicate) {
      savedCities.unshift(city);
      renderSavedCities();
    }
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var city = normalizeCity(cityInput.value);
    if (!city) return;

    if (cityName) {
      cityName.textContent = city;
    }
  });

  bookmarkBtn.addEventListener('click', function () {
    addCurrentCityToSaved();
  });

  renderSavedCities();
})();
