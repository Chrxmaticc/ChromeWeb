/**
 * ChromeUniversal – Theme Switcher for websites with Basic CSS.
 * Injects a floating panel with 6 colour themes.
 * Excludes elements containing hex hashes (like icon hashes) to keep icons readable.
 */
(function () {
  // Prevent duplicate panels
  if (document.getElementById('cw-panel')) return;

  // ---- Create the floating panel ----
  var panel = document.createElement('div');
  panel.id = 'cw-panel';
  panel.style.cssText =
    'position:fixed;bottom:20px;right:20px;z-index:99999;' +
    'background:rgba(18,18,18,0.9);backdrop-filter:blur(12px);' +
    'border:1px solid rgba(192,192,192,0.2);border-radius:16px;' +
    'padding:12px;color:#e0e0e0;font-family:Inter,sans-serif;' +
    'width:200px;box-shadow:0 10px 25px rgba(0,0,0,0.7);';

  // Panel title
  var title = document.createElement('h3');
  title.textContent = 'Chrome Basic Themes';
  title.style.cssText = 'font-size:14px;margin:0 0 8px;color:#fff;';
  panel.appendChild(title);

  // Close button
  var closeBtn = document.createElement('button');
  closeBtn.textContent = '\u2715'; // ✕
  closeBtn.style.cssText =
    'position:absolute;top:6px;right:8px;' +
    'background:none;border:none;color:#888;' +
    'cursor:pointer;font-size:16px;';
  closeBtn.onclick = function () {
    panel.remove();
  };
  panel.appendChild(closeBtn);

  // ---- Theme definitions ----
  var themes = {
    red:
      '*:not([class*="a-f"]):not([class*="0-9"]){' +
      'background-color:#2d0000!important;color:#ffcccc!important;border-color:#550000!important' +
      '}a{color:#ff6666!important}',
    blue:
      '*:not([class*="a-f"]):not([class*="0-9"]){' +
      'background-color:#001a33!important;color:#aaccff!important;border-color:#003366!important' +
      '}a{color:#66aaff!important}',
    purple:
      '*:not([class*="a-f"]):not([class*="0-9"]){' +
      'background-color:#1a0033!important;color:#ddbbff!important;border-color:#400060!important' +
      '}a{color:#cc99ff!important}',
    green:
      '*:not([class*="a-f"]):not([class*="0-9"]){' +
      'background-color:#002200!important;color:#99dd99!important;border-color:#005500!important' +
      '}a{color:#66cc66!important}',
    white:
      '*:not([class*="a-f"]):not([class*="0-9"]){' +
      'background-color:#ffffff!important;color:#111!important;border-color:#cccccc!important' +
      '}a{color:#555!important}',
    black:
      '*:not([class*="a-f"]):not([class*="0-9"]){' +
      'background-color:#000000!important;color:#cccccc!important;border-color:#333!important' +
      '}a{color:#888!important}'
  };

  // ---- Theme application function ----
  function applyTheme(themeId) {
    // Remove previous theme style
    var old = document.getElementById('cw-theme-style');
    if (old) old.remove();

    // Insert new theme CSS
    var style = document.createElement('style');
    style.id = 'cw-theme-style';
    style.textContent = themes[themeId];
    document.head.appendChild(style);

    // JS safety net: force icon containers to be transparent
    setTimeout(function () {
      var iconContainers = document.querySelectorAll('[class*="a-f"], [class*="0-9"]');
      iconContainers.forEach(function (el) {
        el.style.backgroundColor = 'transparent';
        el.style.background = '';
      });

      // Also clear any img backgrounds
      var imgs = document.querySelectorAll('img');
      imgs.forEach(function (img) {
        img.style.backgroundColor = 'transparent';
      });
    }, 50);
  }

  // ---- Create colour buttons ----
  var colors = ['red', 'blue', 'purple', 'green', 'white', 'black'];
  colors.forEach(function (color) {
    var btn = document.createElement('button');
    btn.textContent = color.charAt(0).toUpperCase() + color.slice(1);
    btn.style.cssText =
      'display:block;width:100%;margin:4px 0;padding:6px 10px;' +
      'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);' +
      'color:#c0c0c0;border-radius:8px;cursor:pointer;font-size:12px;transition:0.2s;';

    // Hover effects
    btn.onmouseenter = function () {
      btn.style.background = 'rgba(255,255,255,0.15)';
      btn.style.color = '#fff';
    };
    btn.onmouseleave = function () {
      btn.style.background = 'rgba(255,255,255,0.05)';
      btn.style.color = '#c0c0c0';
    };

    // Click event
    btn.onclick = function () {
      applyTheme(color);
    };

    panel.appendChild(btn);
  });

  // Add the panel to the page
  document.body.appendChild(panel);
})();
