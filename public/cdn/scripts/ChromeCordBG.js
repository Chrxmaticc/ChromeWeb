// ChromeCord – Custom Background Injector
// Save as: cdn/scripts/chromecord-bg.js
(function () {
  const url = prompt('Enter the image URL for your Discord background:');
  if (!url) return;

  // Remove any previous custom background style
  const old = document.getElementById('cw-custom-bg');
  if (old) old.remove();

  const style = document.createElement('style');
  style.id = 'cw-custom-bg';
  style.textContent = `
    /* Apply background to Discord's main app container */
    [class*="app"] {
      background-image: url("${url}") !important;
      background-size: cover !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
    }
    /* Keep guild icons and avatars transparent */
    [class*="guilds"] * {
      background-color: transparent !important;
      background-image: none !important;
    }
    img, [class*="avatar"] {
      background-color: transparent !important;
    }
  `;
  document.head.appendChild(style);

  alert('Custom background applied!');
})();
