const API_URL = '/api/todos';

const state = {
  todos: [],
  filter: 'all',
};

const elements = {
  connectionStatus: document.querySelector('#connectionStatus'),
  totalCount: document.querySelector('#totalCount'),
  openCount: document.querySelector('#openCount'),
  doneCount: document.querySelector('#doneCount'),
  todoForm: document.querySelector('#todoForm'),
  title: document.querySelector('#title'),
  description: document.querySelector('#description'),
  todoList: document.querySelector('#todoList'),
  notice: document.querySelector('#notice'),
  refreshButton: document.querySelector('#refreshButton'),
  segments: document.querySelectorAll('.segment'),
  editDialog: document.querySelector('#editDialog'),
  editForm: document.querySelector('#editForm'),
  editId: document.querySelector('#editId'),
  editTitle: document.querySelector('#editTitle'),
  editDescription: document.querySelector('#editDescription'),
  editCompleted: document.querySelector('#editCompleted'),
  closeDialog: document.querySelector('#closeDialog'),
  cancelEdit: document.querySelector('#cancelEdit'),
};

const setNotice = (message, isError = false) => {
  elements.notice.textContent = message;
  elements.notice.classList.toggle('error', isError);
};

const setConnection = (status) => {
  elements.connectionStatus.textContent = status;
  elements.connectionStatus.classList.toggle('online', status === 'Online');
  elements.connectionStatus.classList.toggle('offline', status === 'Offline');
};

const formatDate = (dateString) => {
  if (!dateString) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

const filteredTodos = () => {
  if (state.filter === 'open') {
    return state.todos.filter((todo) => !todo.completed);
  }

  if (state.filter === 'done') {
    return state.todos.filter((todo) => todo.completed);
  }

  return state.todos;
};

const updateSummary = () => {
  const done = state.todos.filter((todo) => todo.completed).length;
  const open = state.todos.length - done;

  elements.totalCount.textContent = state.todos.length;
  elements.openCount.textContent = open;
  elements.doneCount.textContent = done;
};

const createTodoItem = (todo) => {
  const article = document.createElement('article');
  article.className = `todo-item${todo.completed ? ' done' : ''}`;

  const checkbox = document.createElement('input');
  checkbox.className = 'todo-check';
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.ariaLabel = `Mark ${todo.title} as ${todo.completed ? 'open' : 'done'}`;
  checkbox.addEventListener('change', () => updateTodo(todo._id, { completed: checkbox.checked }));

  const content = document.createElement('div');

  const title = document.createElement('h3');
  title.className = 'todo-title';
  title.textContent = todo.title;

  const description = document.createElement('p');
  description.className = 'todo-description';
  description.textContent = todo.description || 'No description';

  const meta = document.createElement('div');
  meta.className = 'todo-meta';
  meta.textContent = `Updated ${formatDate(todo.updatedAt)}`;

  content.append(title, description, meta);

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const editButton = document.createElement('button');
  editButton.className = 'icon-button';
  editButton.type = 'button';
  editButton.title = 'Edit';
  editButton.ariaLabel = `Edit ${todo.title}`;
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => openEditDialog(todo));

  const deleteButton = document.createElement('button');
  deleteButton.className = 'icon-button danger';
  deleteButton.type = 'button';
  deleteButton.title = 'Delete';
  deleteButton.ariaLabel = `Delete ${todo.title}`;
  deleteButton.textContent = 'Del';
  deleteButton.addEventListener('click', () => deleteTodo(todo._id));

  actions.append(editButton, deleteButton);
  article.append(checkbox, content, actions);

  return article;
};

const renderTodos = () => {
  updateSummary();
  elements.todoList.replaceChildren();

  const visibleTodos = filteredTodos();

  if (visibleTodos.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No todos here';
    elements.todoList.append(empty);
    return;
  }

  elements.todoList.append(...visibleTodos.map(createTodoItem));
};

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message || 'Request failed');
  }

  return body;
};

const loadTodos = async () => {
  try {
    setNotice('');
    const response = await requestJson(API_URL);
    state.todos = response.data;
    setConnection('Online');
    renderTodos();
  } catch (error) {
    setConnection('Offline');
    setNotice(error.message, true);
  }
};

const createTodo = async (event) => {
  event.preventDefault();

  const title = elements.title.value.trim();
  const description = elements.description.value.trim();

  if (!title) {
    elements.title.focus();
    return;
  }

  try {
    const response = await requestJson(API_URL, {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });

    state.todos = [response.data, ...state.todos];
    elements.todoForm.reset();
    setConnection('Online');
    renderTodos();
  } catch (error) {
    setNotice(error.message, true);
  }
};

const updateTodo = async (id, updates) => {
  try {
    const response = await requestJson(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    state.todos = state.todos.map((todo) => (todo._id === id ? response.data : todo));
    renderTodos();
  } catch (error) {
    setNotice(error.message, true);
    await loadTodos();
  }
};

const deleteTodo = async (id) => {
  try {
    await requestJson(`${API_URL}/${id}`, { method: 'DELETE' });
    state.todos = state.todos.filter((todo) => todo._id !== id);
    renderTodos();
  } catch (error) {
    setNotice(error.message, true);
  }
};

const openEditDialog = (todo) => {
  elements.editId.value = todo._id;
  elements.editTitle.value = todo.title;
  elements.editDescription.value = todo.description || '';
  elements.editCompleted.checked = todo.completed;
  elements.editDialog.showModal();
};

const closeEditDialog = () => {
  elements.editDialog.close();
  elements.editForm.reset();
};

const saveEdit = async (event) => {
  event.preventDefault();

  const id = elements.editId.value;
  const updates = {
    title: elements.editTitle.value.trim(),
    description: elements.editDescription.value.trim(),
    completed: elements.editCompleted.checked,
  };

  if (!updates.title) {
    elements.editTitle.focus();
    return;
  }

  await updateTodo(id, updates);
  closeEditDialog();
};

elements.todoForm.addEventListener('submit', createTodo);
elements.refreshButton.addEventListener('click', loadTodos);
elements.editForm.addEventListener('submit', saveEdit);
elements.closeDialog.addEventListener('click', closeEditDialog);
elements.cancelEdit.addEventListener('click', closeEditDialog);

elements.segments.forEach((segment) => {
  segment.addEventListener('click', () => {
    elements.segments.forEach((button) => button.classList.remove('active'));
    segment.classList.add('active');
    state.filter = segment.dataset.filter;
    renderTodos();
  });
});

loadTodos();
