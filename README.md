# Serverless Education Analytics Dashboard built on AWS(S3, CloudFront, API Gateway, Lambda)


<!DOCTYPE html>
<html lang="en" data-theme="system">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>EduTrack – Student Dashboard (Multi‑Theme)</title>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="style.css" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" defer></script>
  <script defer src="script.js"></script>
</head>
<body>
  <canvas id="confetti" aria-hidden="true"></canvas>

  <header class="app-header">
    <div class="brand">
      <img src="logo.png" class="logo" alt="UEL logo" />
      <div>
        <h1 class="title">EduTrack</h1>
        <p class="subtitle">University of East London</p>
      </div>
    </div>

    <div class="header-actions">
      <label class="picker">
        <span class="picker-label">Theme</span>
        <select id="themePicker" title="Pick a theme">
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="ocean">Ocean</option>
          <option value="orchid">Orchid</option>
          <option value="sunset">Sunset</option>
          <option value="emerald">Emerald</option>
        </select>
      </label>
    </div>
  </header>

  <main class="stage">
    <section class="card">
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions">
        <button id="btnFetchGrades" class="btn btn-blue btn-3d">📊 View My Grades</button>
        <button id="btnFetchAssignments" class="btn btn-cyan btn-3d">📑 View Assignments</button>
        <button id="btnSubmitGrades" class="btn btn-green btn-3d">✅ Submit Grades</button>
        <button id="btnUpload" class="btn btn-orange btn-3d">📤 Upload Assignment</button>
      </div>
      <div class="controls">
        <label class="depth">Depth
          <input id="depthRange" type="range" min="200" value="800" max="1200" />
        </label>
      </div>
      <pre id="status" class="status" aria-live="polite"></pre>
    </section>

    <section class="grid-2">
      <article class="card">
        <h2 class="section-title blue">Grades</h2>
        <table id="gradesTable" class="glass">
          <thead><tr><th>Subject</th><th>Grade (%)</th></tr></thead>
          <tbody id="gradesBody"></tbody>
        </table>
      </article>

      <article class="card">
        <h2 class="section-title cyan">Grades Overview</h2>
        <canvas id="gradesChart" height="220"></canvas>
      </article>
    </section>

    <section class="card">
      <h2 class="section-title orange">Assignments</h2>
      <ul id="assignmentList" class="list"></ul>
    </section>

    <section class="card">
      <h2 class="section-title orange">Upload Assignment</h2>
      <form id="uploadForm" class="upload-form">
        <label>Course <input id="course" required placeholder="e.g., CS101" /></label>
        <label>File <input id="file" type="file" required /></label>
        <button class="btn btn-orange btn-3d" type="submit">Upload</button>
        <span id="uploadStatus" class="hint"></span>
      </form>
    </section>

    <footer class="app-footer">
      <p>Hosted on S3 + CloudFront • API Gateway + Lambda backend</p>
    </footer>
  </main>

  <div id="toast" class="toast" role="status" aria-live="polite"></div>
</body>
</html>
