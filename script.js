/* ===== DJ TAMTAM JAVASCRIPT ===== */

// ─── NAVBAR SCROLL ─────────────────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── MOBILE MENU ───────────────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

document.getElementById('navLinks').addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    document.getElementById('navLinks').classList.remove('open');
  }
});

// ─── PARTICLES ─────────────────────────────────────────────
(function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#a855f7', '#00d4ff', '#f0abfc', '#7c3aed'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    Object.assign(p.style, {
      width: size + 'px',
      height: size + 'px',
      left: Math.random() * 100 + '%',
      background: color,
      boxShadow: `0 0 ${size * 3}px ${color}`,
      animationDuration: (Math.random() * 15 + 10) + 's',
      animationDelay: (Math.random() * 10) + 's',
    });
    container.appendChild(p);
  }
})();

// ─── SCROLL FADE-IN ────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.service-card, .contact-card, .stat, .about-text, .about-visual').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ─── COUNTER ANIMATION ─────────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + (el.dataset.target === '100' ? '%' : '+');
      }, 25);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ─── CALENDAR ──────────────────────────────────────────────

// Busy dates: format "YYYY-MM-DD"
// Pre-populate with some example busy dates for the current month + next few months
const busyDates = new Set([
  '2026-05-03',
  '2026-05-10',
  '2026-05-17',
  '2026-05-24',
  '2026-05-31',
  '2026-06-06',
  '2026-06-13',
  '2026-06-20',
  '2026-06-27',
  '2026-07-04',
  '2026-07-12',
  '2026-07-19',
]);

const monthNames = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDate = null;

function formatDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function formatDateDisplay(y, m, d) {
  const months = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
  return `${d}. ${months[m]} ${y}`;
}

function renderCalendar() {
  document.getElementById('calTitle').textContent = `${monthNames[currentMonth]} ${currentYear}`;

  const daysContainer = document.getElementById('calDays');
  daysContainer.innerHTML = '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Day of week for 1st of month (Monday=0)
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const offset = (firstDay === 0) ? 6 : firstDay - 1; // Convert Sunday=0 to Mon-based
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Empty cells before first day
  for (let i = 0; i < offset; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    daysContainer.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day';
    cell.textContent = d;

    const dateStr = formatDate(currentYear, currentMonth, d);
    const cellDate = new Date(currentYear, currentMonth, d);

    if (cellDate < today) {
      cell.classList.add('past');
    } else if (busyDates.has(dateStr)) {
      cell.classList.add('busy');
      cell.title = 'Opptatt';
    } else {
      if (dateStr === selectedDate) {
        cell.classList.add('selected');
      }
      if (cellDate.getTime() === today.getTime()) {
        cell.classList.add('today');
      }
      cell.addEventListener('click', () => selectDate(dateStr, d));
    }

    daysContainer.appendChild(cell);
  }
}

function selectDate(dateStr, day) {
  selectedDate = dateStr;
  const [y, m] = dateStr.split('-').map(Number);
  document.getElementById('bookDate').value = formatDateDisplay(y, m - 1, day);
  renderCalendar();

  // Scroll to form on mobile
  if (window.innerWidth < 900) {
    document.getElementById('bookingForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

document.getElementById('prevMonth').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
});

renderCalendar();

// ─── BOOKING FORM ──────────────────────────────────────────
document.getElementById('bookingForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Validate required fields
  const required = ['fname', 'lname', 'email', 'eventType', 'bookDate'];
  let valid = true;

  required.forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('error');
    if (!el.value.trim()) {
      el.classList.add('error');
      valid = false;
    }
  });

  // Email format check
  const emailEl = document.getElementById('email');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailEl.value && !emailPattern.test(emailEl.value)) {
    emailEl.classList.add('error');
    valid = false;
  }

  if (!valid) {
    // Shake effect on submit button
    const btn = this.querySelector('button[type="submit"]');
    btn.style.animation = 'shake 0.4s';
    setTimeout(() => btn.style.animation = '', 400);
    return;
  }

  // If a date was selected, mark it as busy
  if (selectedDate) {
    busyDates.add(selectedDate);
    renderCalendar();
  }

  // Show success state
  document.getElementById('bookingForm').style.display = 'none';
  const success = document.getElementById('formSuccess');
  success.classList.add('visible');
  success.style.display = 'flex';
});

window.resetForm = function () {
  document.getElementById('bookingForm').reset();
  document.getElementById('bookDate').value = '';
  selectedDate = null;
  renderCalendar();

  document.getElementById('bookingForm').style.display = 'flex';
  const success = document.getElementById('formSuccess');
  success.classList.remove('visible');
  success.style.display = 'none';
};

// ─── SHAKE KEYFRAME (injected) ────────────────────────────
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(style);

// ─── SMOOTH NAV HIGHLIGHT ──────────────────────────────────
// ─── MEDIA TABS ────────────────────────────────────────────
document.querySelectorAll('.media-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.media-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.media-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ─── AUDIO MEDIA ───────────────────────────────────────────
let audioFile = null;

document.getElementById('addAudioBtn').addEventListener('click', () => {
  document.getElementById('addAudioForm').classList.toggle('open');
});
document.getElementById('cancelAudioBtn').addEventListener('click', () => {
  document.getElementById('addAudioForm').classList.remove('open');
  resetAudioForm();
});

document.getElementById('audioFile').addEventListener('change', function () {
  audioFile = this.files[0];
  document.getElementById('audioFileChosen').textContent = audioFile ? audioFile.name : '';
});

setupDragDrop('audioDrop', 'audioFile', 'audio', (file) => {
  audioFile = file;
  document.getElementById('audioFileChosen').textContent = file.name;
});

document.getElementById('saveAudioBtn').addEventListener('click', () => {
  const title = document.getElementById('audioTitle').value.trim();
  if (!title) { document.getElementById('audioTitle').classList.add('error'); return; }
  if (!audioFile) { document.getElementById('audioDrop').style.borderColor = '#ef4444'; return; }

  const url = URL.createObjectURL(audioFile);
  const genre = document.getElementById('audioGenre').value.trim();
  const desc = document.getElementById('audioDesc').value.trim();
  addAudioCard({ title, genre, desc, url });

  document.getElementById('addAudioForm').classList.remove('open');
  resetAudioForm();
});

function addAudioCard({ title, genre, desc, url }) {
  document.getElementById('audioEmpty').style.display = 'none';
  const card = document.createElement('div');
  card.className = 'audio-card fade-in';
  card.innerHTML = `
    <div class="audio-card-header">
      <div class="audio-card-info">
        <h4>${escHtml(title)}</h4>
        ${genre ? `<span class="audio-badge">${escHtml(genre)}</span>` : ''}
      </div>
      <button class="card-delete" title="Slett">✕</button>
    </div>
    ${desc ? `<p class="audio-card-desc">${escHtml(desc)}</p>` : ''}
    <audio controls src="${url}"></audio>
  `;
  card.querySelector('.card-delete').addEventListener('click', () => {
    URL.revokeObjectURL(url);
    card.remove();
    if (!document.querySelector('#audioGrid .audio-card')) {
      document.getElementById('audioEmpty').style.display = '';
    }
  });
  document.getElementById('audioGrid').prepend(card);
  setTimeout(() => card.classList.add('visible'), 50);
}

function resetAudioForm() {
  document.getElementById('audioTitle').value = '';
  document.getElementById('audioTitle').classList.remove('error');
  document.getElementById('audioGenre').value = '';
  document.getElementById('audioDesc').value = '';
  document.getElementById('audioFileChosen').textContent = '';
  document.getElementById('audioDrop').style.borderColor = '';
  document.getElementById('audioFile').value = '';
  audioFile = null;
}

// ─── VIDEO MEDIA ───────────────────────────────────────────
let videoFile = null;

document.getElementById('addVideoBtn').addEventListener('click', () => {
  document.getElementById('addVideoForm').classList.toggle('open');
});
document.getElementById('cancelVideoBtn').addEventListener('click', () => {
  document.getElementById('addVideoForm').classList.remove('open');
  resetVideoForm();
});

document.getElementById('videoFile').addEventListener('change', function () {
  videoFile = this.files[0];
  document.getElementById('videoFileChosen').textContent = videoFile ? videoFile.name : '';
});

setupDragDrop('videoDrop', 'videoFile', 'video', (file) => {
  videoFile = file;
  document.getElementById('videoFileChosen').textContent = file.name;
});

document.getElementById('saveVideoBtn').addEventListener('click', () => {
  const title = document.getElementById('videoTitle').value.trim();
  if (!title) { document.getElementById('videoTitle').classList.add('error'); return; }
  if (!videoFile) { document.getElementById('videoDrop').style.borderColor = '#ef4444'; return; }

  const url = URL.createObjectURL(videoFile);
  const type = document.getElementById('videoType').value;
  const desc = document.getElementById('videoDesc').value.trim();
  addVideoCard({ title, type, desc, url });

  document.getElementById('addVideoForm').classList.remove('open');
  resetVideoForm();
});

function addVideoCard({ title, type, desc, url }) {
  document.getElementById('videoEmpty').style.display = 'none';
  const typeLabels = { reklame: 'Reklame', highlights: 'Highlights', promo: 'Promo', annet: 'Annet' };
  const card = document.createElement('div');
  card.className = 'video-card fade-in';
  card.innerHTML = `
    <video controls src="${url}" preload="metadata"></video>
    <div class="video-card-info">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div>
          <h4>${escHtml(title)}</h4>
          <span class="video-badge">${escHtml(typeLabels[type] || type)}</span>
        </div>
        <button class="card-delete" title="Slett">✕</button>
      </div>
      ${desc ? `<p class="video-card-desc">${escHtml(desc)}</p>` : ''}
    </div>
  `;
  card.querySelector('.card-delete').addEventListener('click', () => {
    URL.revokeObjectURL(url);
    card.remove();
    if (!document.querySelector('#videoGrid .video-card')) {
      document.getElementById('videoEmpty').style.display = '';
    }
  });
  document.getElementById('videoGrid').prepend(card);
  setTimeout(() => card.classList.add('visible'), 50);
}

function resetVideoForm() {
  document.getElementById('videoTitle').value = '';
  document.getElementById('videoTitle').classList.remove('error');
  document.getElementById('videoDesc').value = '';
  document.getElementById('videoFileChosen').textContent = '';
  document.getElementById('videoDrop').style.borderColor = '';
  document.getElementById('videoFile').value = '';
  videoFile = null;
}

// ─── DRAG & DROP HELPER ────────────────────────────────────
function setupDragDrop(zoneId, inputId, mediaType, onFile) {
  const zone = document.getElementById(zoneId);
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith(mediaType + '/')) {
      onFile(file);
    }
  });
}

// ─── XSS HELPER ────────────────────────────────────────────
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#fff' : '';
  });
}, { passive: true });
