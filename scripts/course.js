// Course data array (example data from course list)
const courses = [
  { code: 'WDD130', name: 'Intro to Web Development', credits: 3, department: 'WDD', completed: true },
  { code: 'WDD131', name: 'HTML & CSS', credits: 3, department: 'WDD', completed: true },
  { code: 'WDD231', name: 'Web Frontend Development I', credits: 3, department: 'WDD', completed: false },
  { code: 'CSE120', name: 'Intro to Programming', credits: 3, department: 'CSE', completed: true },
  { code: 'CSE140', name: 'Discrete Structures', credits: 3, department: 'CSE', completed: false }
];

const coursesContainer = document.getElementById('courses');
const creditTotalEl = document.getElementById('creditTotal');

function renderCourses(filter = 'ALL') {
  if (!coursesContainer) return;

  let filtered = courses;
  if (filter === 'WDD') filtered = courses.filter(c => c.department === 'WDD');
  if (filter === 'CSE') filtered = courses.filter(c => c.department === 'CSE');

  coursesContainer.innerHTML = '';

  filtered.forEach(course => {
    const card = document.createElement('div');
    card.className = 'course-card';
    if (course.completed) card.classList.add('completed');

    card.innerHTML = `
			<h3>${course.code} - ${course.name}</h3>
			<p>Credits: ${course.credits}</p>
			<p>Department: ${course.department}</p>
		`;

    coursesContainer.appendChild(card);
  });

  const total = filtered.reduce((sum, c) => sum + (c.credits || 0), 0);
  if (creditTotalEl) creditTotalEl.textContent = total;
}

document.addEventListener('DOMContentLoaded', () => {
  renderCourses('ALL');

  const allBtn = document.getElementById('allBtn');
  const cseBtn = document.getElementById('cseBtn');
  const wddBtn = document.getElementById('wddBtn');

  if (allBtn) allBtn.addEventListener('click', () => renderCourses('ALL'));
  if (cseBtn) cseBtn.addEventListener('click', () => renderCourses('CSE'));
  if (wddBtn) wddBtn.addEventListener('click', () => renderCourses('WDD'));
});
