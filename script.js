/* =========================================================
   Tomat Merah: navigasi halaman, grafik SVG, dan tema
   ========================================================= */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);

  /* ---------- 1. Navigasi antar halaman (berbasis hash) ---------- */
  const pages = [...document.querySelectorAll('.page')];
  const links = [...document.querySelectorAll('nav a')];

  function showPage() {
    let id = location.hash.slice(1) || 'beranda';
    if (!pages.some((p) => p.id === id)) id = 'beranda';

    pages.forEach((p) => p.classList.toggle('on', p.id === id));
    links.forEach((a) => {
      if (a.getAttribute('href') === '#' + id) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
    window.scrollTo(0, 0);
  }

  addEventListener('hashchange', showPage);
  showPage();

  /* ---------- 2. Grafik tinggi tanaman (halaman Budidaya) ---------- */
  function drawGrowthChart() {
    // [hari setelah semai, tinggi dalam cm]
    const data = [[0, 0], [14, 8], [30, 30], [45, 75], [60, 115], [75, 150], [90, 170]];
    const MAX_DAY = 90;
    const MAX_HEIGHT = 180;

    const x = (day) => 40 + (day / MAX_DAY) * 340;
    const y = (cm) => 260 - (cm / MAX_HEIGHT) * 230;

    let grid = '';
    let labels = '';
    let dots = '';

    // Garis dan label sumbu Y
    [0, 60, 120, 180].forEach((cm) => {
      grid += `<path d="M40 ${y(cm)}H380"/>`;
      labels += `<text x="6" y="${y(cm) + 4}">${cm}</text>`;
    });

    // Label sumbu X
    [0, 30, 60, 90].forEach((day) => {
      labels += `<text x="${x(day)}" y="278" text-anchor="middle">${day}</text>`;
    });

    // Titik data
    data.forEach(([day, cm]) => {
      dots += `<circle cx="${x(day)}" cy="${y(cm)}" r="5"/>`;
    });

    // Garis penghubung
    const line = data
      .map(([day, cm], i) => `${i ? 'L' : 'M'}${x(day)} ${y(cm)}`)
      .join('');

    $('gx').innerHTML = grid;
    $('gt').innerHTML = labels;
    $('gp').innerHTML = dots;
    $('gl').setAttribute('d', line);
  }

  /* ---------- 3. Grafik batang nutrisi (halaman Nutrisi) ---------- */
  function drawNutritionChart() {
    // [nama, persen kebutuhan harian per 100 g]
    const data = [
      ['Vitamin C', 15],
      ['Vitamin K', 7],
      ['Kalium', 5],
      ['Vitamin A', 5],
      ['Folat', 4],
      ['Serat', 4],
    ];
    const MAX_VALUE = 15;
    const MAX_BAR_WIDTH = 230;

    let svg = '';
    data.forEach(([name, value], i) => {
      const top = 14 + i * 40;
      const width = (value / MAX_VALUE) * MAX_BAR_WIDTH;

      svg += `<text x="0" y="${top + 18}" font-size="13" font-weight="600">${name}</text>`;
      svg += `<rect x="100" y="${top}" width="${width}" height="26" rx="13" fill="var(--fg)"/>`;
      svg += `<text x="${108 + width}" y="${top + 18}" font-size="13">${value}%</text>`;
    });

    $('nb').innerHTML = svg;
  }

  /* ---------- 4. Tingkat kematangan (halaman Hama & panen) ---------- */
  function drawRipeness() {
    // [label, opacity tomat]; makin matang makin pekat
    const stages = [
      ['Hijau', 0.12],
      ['Mulai merah', 0.4],
      ['Hampir merah', 0.7],
      ['Merah penuh', 1],
    ];

    let svg = '';
    stages.forEach(([label, opacity], i) => {
      const x = 8 + i * 88;
      svg += `<use href="#tm" x="${x}" y="70" width="78" height="78" opacity="${opacity}"/>`;
      svg += `<text x="${x + 39}" y="180" font-size="12" font-weight="600" text-anchor="middle">${label}</text>`;
    });

    // Panah waktu pematangan
    svg += '<path d="M40 215H320" stroke="var(--fg)" stroke-width="3"/>';
    svg += '<path d="M312 208l10 7-10 7" fill="none" stroke="var(--fg)" stroke-width="3"/>';
    svg += '<text x="180" y="240" font-size="12" text-anchor="middle">Waktu pematangan</text>';

    $('rp').innerHTML = svg;
  }

  drawGrowthChart();
  drawNutritionChart();
  drawRipeness();

  /* ---------- 5. Tombol ganti tema ---------- */
  const root = document.documentElement;

  $('th').addEventListener('click', () => {
    const isDark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = isDark ? 'light' : 'dark';
  });
})();
