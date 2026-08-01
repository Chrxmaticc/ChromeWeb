// ChromeWeb Font Changer
(function () {
  if (document.getElementById('cw-font-changer')) return;
  const select = document.createElement('select');
  select.id = 'cw-font-changer';
  select.style.cssText = 'position:fixed;top:10px;right:10px;z-index:99999;background:#222;color:#fff;border:1px solid #555;padding:4px;border-radius:6px;';
  const fonts = ['Inter', 'Roboto Mono', 'Dancing Script', 'Orbitron', 'Arial', 'Times New Roman'];
  fonts.forEach(f => select.innerHTML += `<option value="${f}">${f}</option>`);
  select.onchange = () => document.body.style.fontFamily = select.value;
  document.body.appendChild(select);
})();
