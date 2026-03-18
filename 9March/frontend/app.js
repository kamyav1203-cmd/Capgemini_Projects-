const API_URL = 'http://localhost:5000/api/todo';

let todos = [];
let currentFilter = 'all';

const PRIORITY_LABEL = { 1: 'Low', 2: 'Medium', 3: 'High' };
const PRIORITY_CLASS  = { 1: 'priority-low', 2: 'priority-medium', 3: 'priority-high' };

// ── DOM refs ──────────────────────────────────────────────
const taskInput      = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addBtn         = document.getElementById('addBtn');
const todoList       = document.getElementById('todoList');
const searchInput    = document.getElementById('searchInput');
const emptyMsg       = document.getElementById('emptyMsg');
const filterBtns     = document.querySelectorAll('.filter-btn');
const themeToggle    = document.getElementById('themeToggle');

// ── Theme toggle ──────────────────────────────────────────
themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '🌙' : '☀️';
});

// ── Fetch all todos from API ──────────────────────────────
async function fetchTodos() {
  try {
    const res = await fetch(API_URL);
    todos = await res.json();
    render();
  } catch {
    alert('Cannot connect to the API. Make sure TodoApp.Api is running on http://localhost:5000');
  }
}

// ── Add a new todo ────────────────────────────────────────
async function addTodo() {
  const title = taskInput.value.trim();
  if (!title) { taskInput.focus(); return; }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      isCompleted: false,
      priority: parseInt(prioritySelect.value)
    })
  });

  if (res.ok) {
    taskInput.value = '';
    prioritySelect.value = '2';
    await fetchTodos();
  }
}

// ── Toggle completed ──────────────────────────────────────
async function toggleTodo(todo) {
  await fetch(`${API_URL}/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: todo.title, isCompleted: !todo.isCompleted, priority: todo.priority })
  });
  await fetchTodos();
}

// ── Save edited title + priority ──────────────────────────
async function saveTodo(todo, newTitle, newPriority) {
  newTitle = newTitle.trim();
  if (!newTitle) return;

  await fetch(`${API_URL}/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle, isCompleted: todo.isCompleted, priority: parseInt(newPriority) })
  });
  await fetchTodos();
}

// ── Delete a todo ─────────────────────────────────────────
async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  await fetchTodos();
}

// ── Render list ───────────────────────────────────────────
function render() {
  const search = searchInput.value.toLowerCase();

  const filtered = todos.filter(t => {
    const matchesFilter =
      currentFilter === 'all' ||
      (currentFilter === 'active'    && !t.isCompleted) ||
      (currentFilter === 'completed' &&  t.isCompleted) ||
      (currentFilter === 'low'       &&  t.priority === 1) ||
      (currentFilter === 'medium'    &&  t.priority === 2) ||
      (currentFilter === 'high'      &&  t.priority === 3);
    const matchesSearch = t.title.toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  });

  // Sort: High → Medium → Low, then incomplete before complete
  filtered.sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return b.priority - a.priority;
  });

  todoList.innerHTML = '';
  emptyMsg.classList.toggle('hidden', filtered.length > 0);

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.isCompleted ? ' completed' : '');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.isCompleted;
    checkbox.addEventListener('change', () => toggleTodo(todo));

    // Priority badge
    const badge = document.createElement('span');
    badge.className = `priority-badge ${PRIORITY_CLASS[todo.priority] || 'priority-medium'}`;
    badge.textContent = PRIORITY_LABEL[todo.priority] || 'Medium';

    // Title span
    const span = document.createElement('span');
    span.className = 'todo-title';
    span.textContent = todo.title;

    // Edit input
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = todo.title;

    // Edit priority select
    const editPriority = document.createElement('select');
    editPriority.className = 'edit-priority';
    [['1','Low'],['2','Medium'],['3','High']].forEach(([val, label]) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = label;
      if (parseInt(val) === todo.priority) opt.selected = true;
      editPriority.appendChild(opt);
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      span.style.display = 'none';
      badge.style.display = 'none';
      editInput.style.display = 'block';
      editPriority.style.display = 'block';
      saveBtn.style.display = 'inline-block';
      editBtn.style.display = 'none';
      editInput.focus();
    });

    // Save button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-save';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => saveTodo(todo, editInput.value, editPriority.value));

    // Enter / Escape in edit input
    editInput.addEventListener('keydown', e => {
      if (e.key === 'Enter')  saveTodo(todo, editInput.value, editPriority.value);
      if (e.key === 'Escape') fetchTodos();
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.append(checkbox, badge, span, editInput, editPriority, editBtn, saveBtn, deleteBtn);
    todoList.appendChild(li);
  });
}

// ── Event listeners ───────────────────────────────────────
addBtn.addEventListener('click', addTodo);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });
searchInput.addEventListener('input', render);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ── Init ──────────────────────────────────────────────────
fetchTodos();
