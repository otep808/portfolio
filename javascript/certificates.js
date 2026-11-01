/* certificates.js — render the Skills certificates from api/certificates.php.
   Only replaces the hard-coded cards when the API returns a non-empty list;
   on static hosting (no PHP) the original cards stay exactly as they are. */
(function () {
  'use strict';
  var grid = document.getElementById('certGrid');
  if (!grid) return;

  function esc(s) { return String(s == null ? '' : s); }

  function viewFile(file) {
    if (!file) return;
    var ext = file.split('.').pop().toLowerCase();
    if (ext === 'pdf') { window.open(file, '_blank'); return; }
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;z-index:9998;background:rgba(8,9,17,.96);display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;max-width:90vw;max-height:92vh;';
    var img = document.createElement('img');
    img.src = file; img.alt = 'Certificate';
    img.style.cssText = 'max-width:90vw;max-height:88vh;object-fit:contain;display:block;border:1px solid var(--border);';
    var close = document.createElement('button');
    close.textContent = '✕';
    close.style.cssText = 'position:absolute;top:-14px;right:-14px;width:32px;height:32px;background:var(--blue);color:#fff;border:none;cursor:pointer;font-size:1rem;border-radius:50%;line-height:32px;text-align:center;';
    close.addEventListener('click', function () { modal.remove(); });
    wrap.appendChild(img); wrap.appendChild(close); modal.appendChild(wrap);
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  }

  fetch('api/certificates.php').then(function (r) {
    if (!r.ok) throw new Error('api');
    return r.json();
  }).then(function (data) {
    var list = data.certificates;
    if (!Array.isArray(list) || !list.length) return;
    grid.textContent = '';
    list.forEach(function (c, i) {
      var card = document.createElement('div');
      card.className = 'cert-card reveal visible rd' + ((i % 3) + 1);
      if (c.icon) {
        var icon = document.createElement('img');
        icon.className = 'cert-icon-img'; icon.src = esc(c.icon); icon.alt = esc(c.title);
        card.appendChild(icon);
      }
      var label = document.createElement('p'); label.className = 'cert-label'; label.textContent = esc(c.label); card.appendChild(label);
      var title = document.createElement('p'); title.className = 'cert-title'; title.textContent = esc(c.title); card.appendChild(title);
      var desc = document.createElement('p'); desc.className = 'cert-desc'; desc.textContent = esc(c.description); card.appendChild(desc);
      if (c.file) {
        var btn = document.createElement('button');
        btn.className = 'cert-view-btn';
        btn.textContent = (String(c.file).split('.').pop().toLowerCase() === 'pdf' ? '📄 View Certificate' : '🔍 View Certificate');
        btn.addEventListener('click', function (e) { e.stopPropagation(); viewFile(c.file); });
        card.appendChild(btn);
      }
      grid.appendChild(card);
    });
    var note = document.createElement('p');
    note.className = 'widget-note'; note.style.marginTop = '1rem';
    note.textContent = 'Live certificate data — edit these in admin.php. If the API is unavailable, the original cards are kept instead.';
    grid.parentNode.insertBefore(note, grid.nextSibling);
  }).catch(function () { /* keep the hard-coded cards: static hosting fallback */ });
})();
