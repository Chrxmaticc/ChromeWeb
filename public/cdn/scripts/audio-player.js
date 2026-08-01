// ChromeWeb – Draggable Liquid‑Glass Audio Player
(function () {
  if (document.getElementById('cw-audio-player')) return;

  /* ── Build Player ── */
  const player = document.createElement('div');
  player.id = 'cw-audio-player';
  Object.assign(player.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '2147483647',
    background: 'rgba(18,18,18,0.55)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(192,192,192,0.2)',
    borderRadius: '24px',
    padding: '16px',
    color: '#e0e0e0',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '13px',
    width: '260px',
    boxShadow: '0 25px 45px rgba(0,0,0,0.8)',
    cursor: 'move',
    userSelect: 'none',
  });

  player.innerHTML = `
    <!-- Close button -->
    <button id="cw-audio-close" style="position:absolute;top:8px;right:12px;background:none;border:none;color:#888;font-size:16px;cursor:pointer;">✕</button>

    <!-- Cover -->
    <div id="cw-audio-cover" style="width:100%;aspect-ratio:1/1;border-radius:16px;background:linear-gradient(135deg,#222,#111);display:flex;align-items:center;justify-content:center;margin-bottom:12px;overflow:hidden;">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    </div>

    <!-- Track info -->
    <div id="cw-audio-title" style="font-weight:600;text-align:center;margin-bottom:2px;">No track loaded</div>
    <div id="cw-audio-artist" style="font-size:0.8rem;color:#aaa;text-align:center;margin-bottom:10px;"></div>

    <!-- Progress -->
    <div id="cw-audio-progress" style="height:4px;background:#333;border-radius:2px;overflow:hidden;cursor:pointer;margin:8px 0;">
      <div id="cw-audio-progress-fill" style="height:100%;background:linear-gradient(to right,#c0c0c0,#e0e0e0);width:0%;"></div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:0.7rem;color:#aaa;margin-bottom:10px;">
      <span id="cw-audio-current">0:00</span>
      <span id="cw-audio-duration">0:00</span>
    </div>

    <!-- Controls -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <button id="cw-audio-prev" style="background:none;border:none;color:#ccc;cursor:pointer;padding:4px;">⏮️</button>
      <button id="cw-audio-play" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);border:none;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;">▶️</button>
      <button id="cw-audio-next" style="background:none;border:none;color:#ccc;cursor:pointer;padding:4px;">⏭️</button>
    </div>

    <!-- Volume -->
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
      <span style="color:#aaa;">🔊</span>
      <input type="range" id="cw-audio-volume" min="0" max="1" step="0.01" value="0.8" style="flex:1;accent-color:#c0c0c0;">
    </div>

    <!-- URL input -->
    <div style="display:flex;gap:6px;">
      <input type="text" id="cw-audio-url" placeholder="Paste audio URL…" style="flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(192,192,192,0.2);border-radius:8px;padding:6px;color:#fff;font-size:0.8rem;outline:none;">
      <button id="cw-audio-load" style="background:linear-gradient(135deg,#e0e0e0,#808080);color:#000;border:none;border-radius:8px;padding:0 12px;font-weight:600;cursor:pointer;">Load</button>
    </div>
  `;

  document.body.appendChild(player);

  /* ── Logic ── */
  const audio = new Audio();
  const cover = document.getElementById('cw-audio-cover');
  const titleEl = document.getElementById('cw-audio-title');
  const artistEl = document.getElementById('cw-audio-artist');
  const progressFill = document.getElementById('cw-audio-progress-fill');
  const progressBar = document.getElementById('cw-audio-progress');
  const currentTimeEl = document.getElementById('cw-audio-current');
  const durationEl = document.getElementById('cw-audio-duration');
  const playBtn = document.getElementById('cw-audio-play');
  const volumeSlider = document.getElementById('cw-audio-volume');
  const urlInput = document.getElementById('cw-audio-url');
  const loadBtn = document.getElementById('cw-audio-load');

  function formatTime(sec) {
    sec = Math.floor(sec) || 0;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function updateUI() {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }

  audio.addEventListener('timeupdate', updateUI);
  audio.addEventListener('loadedmetadata', updateUI);
  audio.addEventListener('play', () => playBtn.innerHTML = '⏸️');
  audio.addEventListener('pause', () => playBtn.innerHTML = '▶️');
  audio.addEventListener('ended', () => { playBtn.innerHTML = '▶️'; });

  progressBar.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    audio.currentTime = (x / rect.width) * audio.duration;
  });

  volumeSlider.addEventListener('input', (e) => { audio.volume = parseFloat(e.target.value); });

  playBtn.addEventListener('click', () => {
    if (audio.paused) audio.play();
    else audio.pause();
  });

  document.getElementById('cw-audio-prev').addEventListener('click', () => audio.currentTime = 0);
  document.getElementById('cw-audio-next').addEventListener('click', () => audio.currentTime = 0);

  loadBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (!url) return alert('Please enter an audio URL.');
    audio.src = url;
    audio.load();
    // Reset display
    titleEl.textContent = 'Loading…';
    artistEl.textContent = '';
    cover.innerHTML = '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
    // Extract metadata if possible
    audio.addEventListener('loadedmetadata', () => {
      titleEl.textContent = url.split('/').pop() || 'Track';
      artistEl.textContent = '';
      // Try to get cover from media session (if available)
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: titleEl.textContent,
          artist: 'ChromeWeb',
        });
      }
    }, { once: true });
  });

  // Close button
  document.getElementById('cw-audio-close').addEventListener('click', () => player.remove());

  /* ── Drag ── */
  let isDragging = false, startX, startY, initialX, initialY;
  player.addEventListener('mousedown', (e) => {
    if (e.target.closest('button, input, #cw-audio-progress, #cw-audio-volume')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = player.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    player.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    player.style.left = (initialX + dx) + 'px';
    player.style.top = (initialY + dy) + 'px';
    player.style.right = 'auto';
    player.style.bottom = 'auto';
    player.style.margin = '0';
  });
  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      player.style.cursor = 'move';
    }
  });

})();
