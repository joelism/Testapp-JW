/* Joel Starter App – einfache Notizen (offline), Suche, Darkmode. */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const storeKey = 'joel-notes-v1';
const themeKey = 'joel-theme';

const state = {
  notes: loadNotes(),
  filter: ''
};

function loadNotes() {
  try { return JSON.parse(localStorage.getItem(storeKey)) || []; }
  catch { return []; }
}
function saveNotes() {
  localStorage.setItem(storeKey, JSON.stringify(state.notes));
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function render() {
  const list = $('#notes');
  list.innerHTML = '';
  const q = state.filter.trim().toLowerCase();
  const filtered = state.notes
    .slice()
    .sort((a,b)=>b.updated - a.updated)
    .filter(n => !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q));

  if (!filtered.length) {
    const li = document.createElement('li');
    li.className = 'note';
    li.innerHTML = '<div class="meta">Keine Notizen (oder nichts passt zur Suche).</div>';
    list.appendChild(li);
    return;
  }

  for (const note of filtered) {
    const li = document.createElement('li');
    li.className = 'note';
    li.innerHTML = `
      <header>
        <h3 contenteditable="true" data-id="${note.id}" class="title">${escapeHtml(note.title) || 'Ohne Titel'}</h3>
        <div class="actions">
          <button data-act="share" data-id="${note.id}" title="Teilen">🔗</button>
          <button data-act="delete" data-id="${note.id}" title="Löschen">🗑️</button>
        </div>
      </header>
      <div class="meta">Zuletzt bearbeitet: ${formatDate(note.updated)}</div>
      <div class="body" contenteditable="true" data-id="${note.id}" data-field="body">${escapeHtml(note.body)}</div>
    `;
    list.appendChild(li);
  }
}

function escapeHtml(str='') {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function addNote() {
  const title = $('#noteTitle').value.trim();
  const body = $('#noteBody').value.trim();
  if (!title && !body) return;
  const now = Date.now();
  state.notes.push({ id: crypto.randomUUID(), title, body, created: now, updated: now });
  $('#noteTitle').value = '';
  $('#noteBody').value = '';
  saveNotes(); render();
}

function updateNote(id, patch) {
  const n = state.notes.find(n => n.id === id);
  if (!n) return;
  Object.assign(n, patch, { updated: Date.now() });
  saveNotes(); // live save
}

function deleteNote(id) {
  state.notes = state.notes.filter(n => n.id !== id);
  saveNotes(); render();
}

function exportNotes() {
  const data = JSON.stringify({ exportedAt: new Date().toISOString(), notes: state.notes }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'joel-notes-export.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importNotes(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (parsed && Array.isArray(parsed.notes)) {
        state.notes = parsed.notes;
        saveNotes(); render();
      } else if (Array.isArray(parsed)) {
        state.notes = parsed;
        saveNotes(); render();
      } else {
        alert('Ungültige Datei.');
      }
    } catch (e) {
      alert('Konnte die Datei nicht lesen.');
    }
  };
  reader.readAsText(file);
}

function initTheme() {
  const pref = localStorage.getItem(themeKey);
  if (pref === 'dark' || (pref === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
  $('#themeToggle').textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
}
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(themeKey, isDark ? 'dark' : 'light');
  $('#themeToggle').textContent = isDark ? '☀️' : '🌙';
}

document.addEventListener('click', (e) => {
  const act = e.target?.dataset?.act;
  const id = e.target?.dataset?.id;
  if (act === 'delete' && id) {
    if (confirm('Diese Notiz wirklich löschen?')) deleteNote(id);
  } else if (act === 'share' && id) {
    const n = state.notes.find(n => n.id === id);
    if (!n) return;
    const text = `📝 ${n.title}\n\n${n.body}`;
    if (navigator.share) {
      navigator.share({ title: n.title || 'Notiz', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('In Zwischenablage kopiert.');
    }
  }
});

// Handle editing
document.addEventListener('input', (e) => {
  const el = e.target;
  if (el.classList.contains('title')) {
    updateNote(el.dataset.id, { title: el.textContent ?? '' });
  } else if (el.dataset.field === 'body') {
    updateNote(el.dataset.id, { body: el.textContent ?? '' });
  }
});

// UI wiring
$('#addNote').addEventListener('click', addNote);
$('#search').addEventListener('input', (e) => { state.filter = e.target.value; render(); });
$('#exportBtn').addEventListener('click', exportNotes);
$('#importBtn').addEventListener('click', () => $('#importFile').click());
$('#importFile').addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) importNotes(file);
});
$('#themeToggle').addEventListener('click', toggleTheme);

initTheme();
render();
