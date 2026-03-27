// scripts/form.js
document.addEventListener('DOMContentLoaded', () => {
  // Set current year and lastModified if present on page
  const yearEl = document.getElementById('year');
  const lastEl = document.getElementById('lastModified');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (lastEl) lastEl.textContent = document.lastModified;

  // Populate hidden timestamp on join form
  const ts = document.getElementById('timestamp');
  if (ts) {
    const now = new Date();
    ts.value = now.toISOString(); // ISO timestamp
  }

  // Form validation enhancements
  const form = document.getElementById('joinForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      // Use browser validation first
      if (!form.checkValidity()) {
        // Let browser show validation UI
        return;
      }

      // Additional pattern check for orgTitle if present
      const orgTitle = document.getElementById('orgTitle');
      if (orgTitle && orgTitle.value) {
        const pattern = new RegExp(orgTitle.getAttribute('pattern'));
        if (!pattern.test(orgTitle.value)) {
          e.preventDefault();
          orgTitle.setCustomValidity('Organization title must be letters, hyphens, spaces, minimum 7 characters.');
          orgTitle.reportValidity();
          return;
        } else {
          orgTitle.setCustomValidity('');
        }
      }

      // No preventDefault here because we want GET to thankyou.html
      // Timestamp is already set in hidden field
    });
  }

  // Modal handling using <dialog>
  const infoLinks = document.querySelectorAll('.info-link[data-modal]');
  infoLinks.forEach(link => {
    link.addEventListener('click', (ev) => {
      ev.preventDefault();
      const id = link.getAttribute('data-modal');
      const dlg = document.getElementById(id);
      if (dlg) {
        if (typeof dlg.showModal === 'function') {
          dlg.showModal();
        } else {
          // fallback for browsers without dialog support
          dlg.setAttribute('open', '');
        }
        // move focus into dialog
        const closeBtn = dlg.querySelector('[data-close]');
        if (closeBtn) closeBtn.focus();
      }
    });
  });

  // Close dialog buttons
  const closeButtons = document.querySelectorAll('dialog [data-close]');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const dlg = btn.closest('dialog');
      if (!dlg) return;
      if (typeof dlg.close === 'function') dlg.close();
      else dlg.removeAttribute('open');
    });
  });

  // Close dialog on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('dialog[open]').forEach(dlg => {
        if (typeof dlg.close === 'function') dlg.close();
        else dlg.removeAttribute('open');
      });
    }
  });

  // Close dialog when clicking backdrop (for browsers supporting dialog)
  document.querySelectorAll('dialog').forEach(dlg => {
    dlg.addEventListener('click', (e) => {
      const rect = dlg.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
        && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        if (typeof dlg.close === 'function') dlg.close();
        else dlg.removeAttribute('open');
      }
    });
  });
});
