<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= isset($pageTitle) ? htmlspecialchars($pageTitle) : 'Weather App | Dashboard' ?></title>
  <meta name="description" content="Weather dashboard layout." />

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
  <link rel="stylesheet" href="assets/css/style.css" />
</head>

<body>
  <header class="site-header glass">
    <div class="site-header__inner">
      <div>
        <h1 class="site-title m-0">Weather App</h1>
        <p class="site-subtitle m-0">Weather dashboard layout</p>
      </div>
      <nav aria-label="Main navigation">
        <ul class="site-nav list-unstyled m-0">
          <li><a href="#" class="site-nav__link">Home</a></li>
          <li><a href="#" class="site-nav__link">Forecast</a></li>
          <li><a href="#" class="site-nav__link">Saved Cities</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="app-shell container-fluid">
