<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>@yield('title', 'Weather App | Dashboard')</title>
  <meta name="description" content="Weather dashboard layout." />
  <meta name="csrf-token" content="{{ csrf_token() }}" />

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />

  {{-- Vite bundles resources/css/style.css and resources/js/app.js --}}
  @vite(['resources/css/style.css', 'resources/js/app.js'])

  @stack('styles')
</head>

<body>
  <header class="navbar sticky-top site-header glass" position="fixed">
    <div class="site-header__inner">
      <div class="d-flex align-items-center gap-2">
        <div>
          <img src="{{ asset('images/Logo.png') }}" alt="Weather App Logo" class="site-logo" style="width: 60px; height: 60px;" />
        </div>
        <div class="d-flex flex-column">
          <h1 class="site-title m-0">Weather App</h1>
          <p class="site-subtitle m-0">Weather dashboard layout</p>
        </div>
      </div>
      <nav aria-label="Main navigation">
        <ul class="site-nav list-unstyled m-0">
          <li><a href="#home" class="site-nav__link">Home</a></li>
          <li><a href="#forecast" class="site-nav__link">Forecast</a></li>
          <li><a href="#saved" class="site-nav__link">Saved Cities</a></li>
          <li><a href="#history" class="site-nav__link">History</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="app-shell container-fluid">

    @yield('content')

  </main>

  <footer class="site-footer glass">
    <div class="site-footer__inner">
      <p class="m-0">© 2026 Weather App UI</p>
    </div>
  </footer>

  @stack('scripts')
</body>

</html>