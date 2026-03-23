const form = document.getElementById('joinForm');
const msgEl = document.getElementById('formMessage');
const savedContainer = document.getElementById('savedSubmissions');
const clearBtn = document.getElementById('clearSubmissions');

function showMessage(text, ok = true) {
  if (!msgEl) return;
  msgEl.textContent = text;
  msgEl.className = ok ? 'form-success' : 'form-error';
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const business = (data.get('business') || '').toString().trim();
    const contact = (data.get('contact') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const level = data.get('level');

    if (!business || !contact || !email || !level) {
      showMessage('Please complete the required fields (business, contact, email, level).', false);
      return;
    }

    const submission = {
      business,
      contact,
      email,
      phone: (data.get('phone') || '').toString().trim(),
      address: (data.get('address') || '').toString().trim(),
      level: Number(level),
      notes: (data.get('notes') || '').toString().trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const key = 'chamber_submissions';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(submission);
      localStorage.setItem(key, JSON.stringify(existing));
      showMessage('Thank you! Your application has been saved locally.', true);
      form.reset();
      renderSavedSubmissions();
    } catch (err) {
      console.error('Failed to save submission', err);
      showMessage('Failed to save your application. Try again.', false);
    }
  });
}

function renderSavedSubmissions() {
  if (!savedContainer) return;
  const key = 'chamber_submissions';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  if (!list.length) {
    savedContainer.innerHTML = '<p>No saved applications.</p>';
    return;
  }

  const out = document.createElement('div');
  out.className = 'sub-list';
  list.slice().reverse().forEach(item => {
    const el = document.createElement('article');
    el.className = 'saved-item';
    el.innerHTML = `<h4>${escapeHtml(item.business || item.contact || 'New')}</h4>
      <p>${escapeHtml(item.email || '')} — ${escapeHtml(item.phone || '')}</p>
      <p>Level: ${escapeHtml(String(item.level || '1'))}</p>
      <p class="small">${escapeHtml(item.timestamp || '')}</p>`;
    out.appendChild(el);
  });
  savedContainer.innerHTML = '';
  savedContainer.appendChild(out);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all saved submissions?')) return;
    localStorage.removeItem('chamber_submissions');
    renderSavedSubmissions();
    showMessage('Saved submissions cleared.', true);
  });
}

// render on load
renderSavedSubmissions();

export { };
