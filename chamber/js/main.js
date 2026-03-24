const dataUrl = 'data/members.json';

function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

async function loadMembers() {
  try {
    const res = await fetch(dataUrl);
    const members = await res.json();
    // merge any locally saved submissions
    try {
      const saved = JSON.parse(localStorage.getItem('chamber_submissions') || '[]');
      if (Array.isArray(saved) && saved.length) {
        const mapped = saved.map(s => ({
          name: s.business || s.contact || 'New Member',
          address: s.address || '',
          phone: s.phone || '',
          website: s.website || '',
          image: s.image || '',
          level: Number(s.level) || 1,
          notes: s.notes || ''
        }));
        return members.concat(mapped);
      }
    } catch (e) {
      console.warn('Could not parse saved submissions', e);
    }

    return members;
  } catch (err) {
    console.error('Failed to load members', err);
    return [];
  }
}

function createCard(member) {
  const card = document.createElement('article');
  card.className = 'card';

  const img = document.createElement('img');
  img.alt = member.name;
  img.src = member.image ? `images/${member.image}` : 'images/business1.svg';

  const info = document.createElement('div');
  info.className = 'info';

  const h3 = document.createElement('h3');
  h3.textContent = member.name;

  const addr = document.createElement('p');
  addr.textContent = member.address;

  const phone = document.createElement('p');
  phone.textContent = member.phone;

  const link = document.createElement('a');
  link.href = member.website;
  link.textContent = 'Website';
  link.target = '_blank';

  const level = document.createElement('p');
  const levelName = member.level === 3 ? 'Gold' : member.level === 2 ? 'Silver' : 'Member';
  level.textContent = `Membership: ${levelName}`;

  info.appendChild(h3);
  info.appendChild(addr);
  info.appendChild(phone);
  info.appendChild(link);
  info.appendChild(level);

  card.appendChild(img);
  card.appendChild(info);
  return card;
}

function render(members, view = 'grid') {
  const container = document.getElementById('directory');
  container.innerHTML = '';
  container.className = 'directory ' + view;

  if (view === 'list') {
    members.forEach(m => container.appendChild(createCard(m)));
  } else {
    members.forEach(m => container.appendChild(createCard(m)));
  }
}

function filterMembers(members) {
  const sel = document.getElementById('levelFilter');
  const val = sel ? sel.value : 'all';
  const search = document.getElementById('searchInput') ? document.getElementById('searchInput').value.trim().toLowerCase() : '';

  let out = members;
  if (val !== 'all') {
    const n = Number(val);
    out = out.filter(m => m.level === n);
  }

  if (search) {
    out = out.filter(m => {
      return (
        (m.name && m.name.toLowerCase().includes(search)) ||
        (m.address && m.address.toLowerCase().includes(search)) ||
        (m.notes && m.notes.toLowerCase().includes(search))
      );
    });
  }

  return out;
}

async function init() {
  const members = await loadMembers();
  let currentView = 'grid';
  const initialFiltered = filterMembers(members);
  render(initialFiltered, currentView);
  const resultCountEl = document.getElementById('resultCount');
  if (resultCountEl) resultCountEl.textContent = initialFiltered.length;

  document.getElementById('gridBtn').addEventListener('click', () => {
    currentView = 'grid';
    document.getElementById('gridBtn').setAttribute('aria-pressed', 'true');
    document.getElementById('listBtn').setAttribute('aria-pressed', 'false');
    render(filterMembers(members), currentView);
  });

  document.getElementById('listBtn').addEventListener('click', () => {
    currentView = 'list';
    document.getElementById('gridBtn').setAttribute('aria-pressed', 'false');
    document.getElementById('listBtn').setAttribute('aria-pressed', 'true');
    render(filterMembers(members), currentView);
  });

  const updateAndRender = () => {
    const filtered = filterMembers(members);
    const rc = document.getElementById('resultCount');
    if (rc) rc.textContent = filtered.length;
    render(filtered, currentView);
  };

  document.getElementById('levelFilter').addEventListener('change', updateAndRender);

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(updateAndRender, 250));
  }

  // nav toggle for small screens
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('open');
    });
    // close menu when clicking outside of it
    document.addEventListener('click', (evt) => {
      if (!mainNav.classList.contains('open')) return;
      const target = evt.target;
      if (mainNav.contains(target) || navToggle.contains(target)) return;
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('open');
    });

    // close menu with Escape key
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' && mainNav.classList.contains('open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
        navToggle.focus();
      }
    });

    // close menu when a nav link is activated (useful on mobile)
    const navLinks = document.querySelectorAll('.main-nav .nav-list a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
          navToggle.setAttribute('aria-expanded', 'false');
          mainNav.classList.remove('open');
        }
      });
    });
  }

  // footer last modified
  const lm = document.getElementById('lastModified');
  lm.textContent = document.lastModified || new Date().toLocaleString();
}

window.addEventListener('DOMContentLoaded', init);
