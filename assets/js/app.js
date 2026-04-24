(function () {
  var form = document.getElementById("searchForm");
  var cityInput = document.getElementById("cityInput");
  var cityName = document.getElementById("cityName");
  var bookmarkBtn = document.getElementById("bookmarkBtn");
  var savedCitiesList = document.getElementById("savedCitiesList");
  var searchHistoryDropdown = document.getElementById("searchHistoryDropdown");
  var searchHistoryList = document.getElementById("searchHistoryList");
  var clearHistory = document.getElementById("clear");

  function validateCityInput(city) {
    const trimmedCity = city.trim();

    if (trimmedCity === "") {
      alert("Please enter a city name.");
      return false;
    }

    if (trimmedCity.length > 100) {
      alert("City name is too long (Max 100 characters).");
      return false;
    }

    const cityRegex = /^[a-zA-Z0-9\s,\.-]+$/;
    if (!cityRegex.test(trimmedCity)) {
      alert(
        "Invalid characters detected. Please use only letters and standard punctuation."
      );
      return false;
    }

    return true;
  }
  if (
    !form ||
    !cityInput ||
    !savedCitiesList ||
    !bookmarkBtn ||
    !searchHistoryDropdown ||
    !searchHistoryList
  )
    return;

  var savedCities = [];
  var searchHistory = [];

  function loadSearchHistory() {
    fetch("DB_Ops.php?action=GetSearchHistory", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        var cities = response.map((item) => item.City_Name);
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
        console.log("Loaded search history:", searchHistory);
      })
      .catch((err) => console.error("Failed to load search history:", err));
  }

  function normalizeCity(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function saveSearchHistory(city) {
    city = city.replaceAll("`", "");
    if (!validateCityInput(city)) return;

    fetch("DB_Ops.php?action=LogSearch&cityName=" + encodeURIComponent(city), {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          searchHistory = searchHistory.filter(function (item) {
            return item.toLowerCase() !== city.toLowerCase();
          });
          searchHistory.unshift(city);
          if (searchHistory.length > 10) {
            searchHistory = searchHistory.slice(0, 10);
          }
        }
      })
      .catch((err) => console.error("Failed to save search history:", err));
  }

  function showSearchHistory() {
    searchHistoryList.innerHTML = "";

    if (searchHistory.length === 0) {
      var empty = document.createElement("li");
      empty.textContent = "No search history";
      empty.style.padding = "0.5rem 0.75rem";
      empty.style.color = "var(--muted)";
      empty.style.textAlign = "center";
      searchHistoryList.appendChild(empty);
    } else {
      searchHistory.forEach(function (city) {
        var item = document.createElement("li");
        item.textContent = city;
        item.addEventListener("click", function () {
          cityInput.value = city;
          hideSearchHistory();
          cityInput.focus();
        });
        searchHistoryList.appendChild(item);
      });
    }

    searchHistoryDropdown.style.display = "block";
  }

  function hideSearchHistory() {
    searchHistoryDropdown.style.display = "none";
  }

  function renderSavedCities() {
    savedCitiesList.innerHTML = "";

    fetch("DB_Ops.php?action=" + "GetSavedCities", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        savedCities = [];
        response.forEach(function (row) {
          savedCities.push({ city_name: row["City_Name"], ID: row["ID"] });
        });

        if (savedCities.length === 0) {
          var empty = document.createElement("li");
          empty.className = "saved-empty";
          empty.textContent = "No saved cities yet.";
          savedCitiesList.appendChild(empty);
          return;
        }

        savedCities.forEach(function (city) {
          var item = document.createElement("li");
          item.className = "saved-city-item";

          var nameBtn = document.createElement("button");
          nameBtn.type = "button";
          nameBtn.className =
            "btn btn-link p-0 text-decoration-none saved-city-name";
          nameBtn.dataset.city = city["city_name"];
          nameBtn.textContent = city["city_name"];

          var removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "saved-remove-btn";
          removeBtn.textContent = "Remove";
          removeBtn.addEventListener("click", function () {
            savedCities = savedCities.filter(function (itemCity) {
              return (
                itemCity["city_name"].toLowerCase() !==
                city["city_name"].toLowerCase()
              );
            });

            fetch("DB_Ops.php?action=" + "DeleteCity" + "&ID=" + city["ID"], {
              method: "GET",
            })
              .then((res) => res.json())
              .then((response) => {
                renderSavedCities();
              });
          });
          var editBtn = document.createElement("button");
          editBtn.type = "button";
          editBtn.className =
            "saved-edit-btn btn btn-sm btn-outline-warning ms-2";
          editBtn.textContent = "Rename";
          editBtn.addEventListener("click", function () {
            var newName = prompt(
              "Enter a new name for this saved city:",
              city["city_name"]
            );

            if (
              newName &&
              newName.trim() !== "" &&
              newName.trim() !== city["city_name"]
            ) {
              fetch(
                "DB_Ops.php?action=UpdateCityName&id=" +
                  city["ID"] +
                  "&newCityName=" +
                  encodeURIComponent(newName.trim()),
                {
                  method: "GET",
                }
              )
                .then((res) => res.json())
                .then((response) => {
                  if (response.status === "success") {
                    renderSavedCities();
                  } else {
                    alert("Error updating city: " + response.message);
                  }
                })
                .catch((err) => console.error("Failed to update city:", err));
            }
          });

          item.appendChild(nameBtn);
          item.appendChild(removeBtn);
          item.appendChild(editBtn);

          savedCitiesList.appendChild(item);
        });
      });
  }

  function addCurrentCityToSaved() {
    city = cityInput.value.replaceAll("`", "");
    console.log(city);
    if (!validateCityInput(city)) return;

    var isDuplicate = savedCities.some(function (item) {
      return item["city_name"].toLowerCase() === city.toLowerCase();
    });

    if (!isDuplicate) {
      fetch(
        "DB_Ops.php?action=" +
          "SaveCity" +
          "&cityName=" +
          city +
          "&countryCode=200",
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((response) => {
          savedCities.unshift({ city_name: city, ID: response["ID"] });
          renderSavedCities();
        });
    }
  }

  bookmarkBtn.addEventListener("click", function () {
    addCurrentCityToSaved();
  });

  cityInput.addEventListener("focus", function () {
    showSearchHistory();
  });

  cityInput.addEventListener("input", function () {
    if (cityInput.value.trim() === "") {
      showSearchHistory();
    } else {
      hideSearchHistory();
    }
  });

  document.addEventListener("click", function (event) {
    if (
      !searchHistoryDropdown.contains(event.target) &&
      event.target !== cityInput
    ) {
      hideSearchHistory();
    }
  });

  form.addEventListener("submit", function (event) {
    city = cityInput.value.replaceAll("`", "");
    if (!validateCityInput(city)) return;

    saveSearchHistory(city);
  });
  async function fetchHistory() {
    const res = await fetch("DB_Ops.php?action=GetSearchHistory");
    const history = await res.json();
    renderHistory(history);
  }

  async function deleteHistoryItem(id) {
    await fetch(`DB_Ops.php?action=DeleteHistoryItem&id=${id}`);
    fetchHistory();
  }

  function renderHistory(history) {
    const list = document.getElementById("historyList");
    if (!history || history.length === 0) {
      list.innerHTML =
        '<li class="small text-light-emphasis">No recent searches.</li>';
      return;
    }
    list.innerHTML = history
      .map(
        (item) => `
        <li class="d-flex justify-content-between align-items-center mb-2">
            <span class="cursor-pointer" style="cursor:pointer" onclick="getWeather('${item.City_Name}')">${item.City_Name}</span>
            <button class="btn-close btn-close-white" style="font-size: 0.6rem;" onclick="deleteHistoryItem(${item.ID})"></button>
        </li>
    `
      )
      .join("");
  }
  document.getElementById("clear").addEventListener("click", function () {
    console.log("Clearing...");
    fetch("DB_Ops.php?action=" + "ClearSearchHistory", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        fetchHistory();
      });
  });

  renderSavedCities();
  loadSearchHistory();
})();

var navLinks = document.querySelectorAll(".site-nav__link");
var header = document.querySelector(".site-header");
navLinks.forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    var targetId = this.getAttribute("href");

    if (targetId.startsWith("#")) {
      e.preventDefault();
      var targetSection = document.querySelector(targetId);
      console.log(targetId);
      if (targetSection) {
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = targetSection.offsetTop - headerHeight - 20; // 20px extra padding

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        targetSection.classList.remove("animate-section");
        void targetSection.offsetWidth;
        targetSection.classList.add("animate-section");

        setTimeout(function () {
          targetSection.classList.remove("animate-section");
        }, 3000);
      }
    }
  });
});
