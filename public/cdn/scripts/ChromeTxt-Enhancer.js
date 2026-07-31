/**
 * ChromeWeb Text Enhancer
 * A floating liquid‑glass panel for customizing text on any page.
 *
 * Features:
 *  - Load fonts from Google Fonts (just type the name) or paste a custom <link>.
 *  - Create a gradient overlay on text using two colour pickers.
 *  - Choose where to apply: all text, headings, paragraphs, or a custom CSS selector.
 *  - Draggable panel with a glassmorphism design.
 */
(function () {
  if (document.getElementById('cw-text-enhancer-panel')) return;

  /* ───── Create the liquid‑glass panel ───── */
  const panel = document.createElement('div');
  panel.id = 'cw-text-enhancer-panel';
  panel.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 2147483647;
    background: rgba(18, 18, 18, 0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(192, 192, 192, 0.2);
    border-radius: 24px;
    padding: 20px;
    color: #e0e0e0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 13px;
    width: 280px;
    box-shadow: 0 25px 45px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08);
    user-select: none;
    cursor: move;
    overflow-y: auto;
    max-height: 80vh;
  `;

  /* Inner content wrapper (for drag offset) */
  const inner = document.createElement('div');
  inner.style.pointerEvents = 'auto';
  panel.appendChild(inner);

  /* Title and close button */
  const titleRow = document.createElement('div');
  titleRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;';
  const title = document.createElement('h3');
  title.textContent = 'ChromeTxt Enhancer';
  title.style.cssText = 'margin:0;font-size:15px;color:#fff;font-weight:600;';
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&#x2715;';
  closeBtn.style.cssText = 'background:none;border:none;color:#888;font-size:16px;cursor:pointer;';
  closeBtn.onclick = () => panel.remove();
  titleRow.appendChild(title);
  titleRow.appendChild(closeBtn);
  inner.appendChild(titleRow);

  /* ───── Helper: create a section ───── */
  function addSection(labelText) {
    const label = document.createElement('div');
    label.textContent = labelText;
    label.style.cssText = 'font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#aaa;margin:12px 0 4px;';
    inner.appendChild(label);
  }

  /* ───── Font Section ───── */
  addSection('Font');
  const fontInput = document.createElement('input');
  fontInput.type = 'text';
  fontInput.placeholder = 'Font name (e.g. Inter)';
  fontInput.style.cssText = 'width:100%;padding:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(192,192,192,0.2);border-radius:8px;color:#fff;margin-bottom:6px;outline:none;';
  inner.appendChild(fontInput);

  const loadFontBtn = document.createElement('button');
  loadFontBtn.textContent = 'Load Google Font';
  loadFontBtn.style.cssText = 'width:100%;padding:8px;background:linear-gradient(135deg,#e0e0e0,#808080);color:#0a0a0a;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-bottom:6px;';
  inner.appendChild(loadFontBtn);

  const customFontArea = document.createElement('textarea');
  customFontArea.placeholder = 'Or paste a <link> for a custom font...';
  customFontArea.style.cssText = 'width:100%;height:50px;background:rgba(255,255,255,0.05);border:1px solid rgba(192,192,192,0.2);border-radius:8px;color:#fff;padding:6px;resize:vertical;margin-bottom:6px;outline:none;';
  inner.appendChild(customFontArea);

  const injectCustomBtn = document.createElement('button');
  injectCustomBtn.textContent = 'Inject Custom Link';
  injectCustomBtn.style.cssText = 'width:100%;padding:8px;background:rgba(255,255,255,0.1);border:1px solid rgba(192,192,192,0.3);color:#e0e0e0;border-radius:8px;cursor:pointer;margin-bottom:6px;';
  inner.appendChild(injectCustomBtn);

  /* ───── Gradient Section ───── */
  addSection('Gradient');
  const colorRow = document.createElement('div');
  colorRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:6px;';
  const startColor = document.createElement('input');
  startColor.type = 'color';
  startColor.value = '#c0c0c0';
  startColor.style.flex = '1';
  const endColor = document.createElement('input');
  endColor.type = 'color';
  endColor.value = '#ffffff';
  endColor.style.flex = '1';
  colorRow.appendChild(startColor);
  colorRow.appendChild(endColor);
  inner.appendChild(colorRow);

  const angleRow = document.createElement('div');
  angleRow.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:8px;';
  const angleLabel = document.createElement('span');
  angleLabel.textContent = 'Angle:';
  angleLabel.style.color = '#aaa';
  const angleInput = document.createElement('input');
  angleInput.type = 'number';
  angleInput.value = '90';
  angleInput.style.cssText = 'width:60px;background:rgba(255,255,255,0.05);border:1px solid rgba(192,192,192,0.2);border-radius:6px;color:#fff;padding:4px;text-align:center;';
  angleRow.appendChild(angleLabel);
  angleRow.appendChild(angleInput);
  inner.appendChild(angleRow);

  /* ───── Target Section ───── */
  addSection('Apply To');
  const targetSelect = document.createElement('select');
  targetSelect.style.cssText = 'width:100%;padding:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(192,192,192,0.2);border-radius:8px;color:#fff;margin-bottom:6px;outline:none;';
  targetSelect.innerHTML = `
    <option value="all">All text</option>
    <option value="headings">Headings (h1-h6)</option>
    <option value="paragraphs">Paragraphs</option>
    <option value="custom">Custom selector…</option>
  `;
  inner.appendChild(targetSelect);

  const customSelector = document.createElement('input');
  customSelector.type = 'text';
  customSelector.placeholder = 'e.g. .article p, .content';
  customSelector.style.cssText = 'width:100%;padding:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(192,192,192,0.2);border-radius:8px;color:#fff;margin-bottom:8px;display:none;outline:none;';
  inner.appendChild(customSelector);

  targetSelect.onchange = () => {
    customSelector.style.display = targetSelect.value === 'custom' ? 'block' : 'none';
  };

  /* ───── Action buttons ───── */
  const applyBtn = document.createElement('button');
  applyBtn.textContent = 'Apply Enhancement';
  applyBtn.style.cssText = 'width:100%;padding:10px;background:linear-gradient(135deg,#e0e0e0,#808080);color:#0a0a0a;border:none;border-radius:12px;font-weight:600;cursor:pointer;margin-bottom:6px;';
  inner.appendChild(applyBtn);

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.style.cssText = 'width:100%;padding:8px;background:rgba(255,255,255,0.08);border:1px solid rgba(192,192,192,0.2);color:#e0e0e0;border-radius:8px;cursor:pointer;';
  inner.appendChild(resetBtn);

  document.body.appendChild(panel);

  /* ═══════════ Functionality ═══════════ */

  // ---------- Font loading ----------
  const loadedFonts = new Set();

  function loadGoogleFont(fontName) {
    const urlFont = fontName.trim().replace(/\s+/g, '+');
    if (loadedFonts.has(urlFont)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${urlFont}&display=swap`;
    document.head.appendChild(link);
    loadedFonts.add(urlFont);
  }

  loadFontBtn.onclick = () => {
    const name = fontInput.value.trim();
    if (name) {
      loadGoogleFont(name);
      // Set the font-family to be applied later (stored in a data attribute or closure)
      loadFontBtn.dataset.font = name;
      alert(`Google Font "${name}" loaded!`);
    }
  };

  injectCustomBtn.onclick = () => {
    const html = customFontArea.value.trim();
    if (html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const linkEl = temp.querySelector('link[rel="stylesheet"]');
      if (linkEl) {
        document.head.appendChild(linkEl.cloneNode());
        alert('Custom font CSS injected!');
      } else {
        alert('Could not find a <link> tag in the pasted HTML.');
      }
    }
  };

  // ---------- Apply enhancement ----------
  function getTargetSelector() {
    const mode = targetSelect.value;
    if (mode === 'all') {
      return 'body, h1, h2, h3, h4, h5, h6, p, a, span, li, blockquote, td, th, div, section, article, header, footer, nav, main, aside';
    } else if (mode === 'headings') {
      return 'h1, h2, h3, h4, h5, h6';
    } else if (mode === 'paragraphs') {
      return 'p';
    } else {
      return customSelector.value || '*';
    }
  }

  applyBtn.onclick = () => {
    const start = startColor.value;
    const end = endColor.value;
    const angle = angleInput.value || '90';
    const selector = getTargetSelector();
    const fontFamily = loadFontBtn.dataset.font || fontInput.value.trim();

    // Remove any previous enhancer style
    const old = document.getElementById('cw-text-enhancer-style');
    if (old) old.remove();

    const style = document.createElement('style');
    style.id = 'cw-text-enhancer-style';
    style.textContent = `
      ${selector} {
        background: linear-gradient(${angle}deg, ${start}, ${end});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        ${fontFamily ? `font-family: '${fontFamily}', sans-serif !important;` : ''}
      }
    `;
    document.head.appendChild(style);
  };

  // ---------- Reset ----------
  resetBtn.onclick = () => {
    const old = document.getElementById('cw-text-enhancer-style');
    if (old) old.remove();
    fontInput.value = '';
    customFontArea.value = '';
    startColor.value = '#c0c0c0';
    endColor.value = '#ffffff';
    angleInput.value = '90';
    targetSelect.value = 'all';
    customSelector.style.display = 'none';
    loadFontBtn.dataset.font = '';
  };

  /* ═══════════ Drag functionality ═══════════ */
  let isDragging = false, startX, startY, initialX, initialY;

  panel.addEventListener('mousedown', (e) => {
    // Only initiate drag if not clicking a button, input, or select
    if (e.target.closest('button, input, select, textarea')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = panel.offsetLeft;
    initialY = panel.offsetTop;
    panel.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    panel.style.left = (initialX + dx) + 'px';
    panel.style.top = (initialY + dy) + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      panel.style.cursor = 'move';
    }
  });

})();
