const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const addBtn = document.getElementById('add-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

function newTodoItem(text, isCompleted) {
  const todoItem = document.createElement('div');
  todoItem.classList.add('todo-item');
  todoItem.innerHTML = `
    <button class="btn complete-btn">
        <i class="fa-regular fa-circle-check" id="complete-icon"></i>
    </button>
    <p>${text}</p>
    <button class="btn delete-btn">
        <i class="fa-solid fa-trash" id="delete-icon"></i>
    </button>
`;

  if (isCompleted) {
    todoItem.classList.add('completed');
  }

  todoList.appendChild(todoItem);
}

function loadTodoItems() {
  if (localStorage.getItem('todoItems') !== null) {
    const todoItems = JSON.parse(localStorage.getItem('todoItems'));

    for (let index = 0; index < todoItems.length; index += 1) {
      const todoItem = todoItems[index];
      newTodoItem(todoItem.text, todoItem.completed);
    }
  }
}

function completeTodo() {
  if (this.parentNode.classList.contains('completed')) {
    this.parentNode.classList.remove('completed');
  } else {
    this.parentNode.classList.add('completed');
  }
}

function saveTodoItems() {
  const todoItems = [];

  for (let index = 0; index < todoList.children.length; index += 1) {
    const todoItem = todoList.children.item(index);

    const todoInfo = {
      text: todoItem.innerText,
      completed: todoItem.classList.contains('completed'),
    };

    todoItems.push(todoInfo);
  }

  localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

function deleteTodo() {
  this.parentNode.remove();
}

function addButtonsEventsListeners() {
  const completeBtnEls = document.querySelectorAll('.complete-btn');
  completeBtnEls.forEach((btn) => {
    btn.addEventListener('click', completeTodo);
    btn.addEventListener('click', saveTodoItems);
  });

  const deleteBtnEls = document.querySelectorAll('.delete-btn');
  deleteBtnEls.forEach((btn) => {
    btn.addEventListener('click', deleteTodo);
    btn.addEventListener('click', saveTodoItems);
  });
}

function addTodo() {
  const todoText = todoInput.value;

  if (todoText === '') {
    const formContainer = document.querySelector('.form-container');
    const emptyTodoWarning = document.createElement('p');
    emptyTodoWarning.setAttribute('id', 'emptytodo-warning');
    emptyTodoWarning.innerText = 'Todo text cannot be empty.';

    formContainer.appendChild(emptyTodoWarning);

    setTimeout(() => {
      emptyTodoWarning.remove();
    }, 1000);

    return;
  }

  newTodoItem(todoText, false);
  addButtonsEventsListeners();
  saveTodoItems();
}

function clearList(list) {
  while (list.length > 0) {
    list.item(0).remove();
  }
}

function clearAll() {
  clearList(todoList.children);
  localStorage.clear();
}

function clearCompleted() {
  const completedTodoItems = todoList.getElementsByClassName('completed');
  clearList(completedTodoItems);
  saveTodoItems();
}

loadTodoItems();

if (todoList.hasChildNodes()) {
  addButtonsEventsListeners();
}

addBtn.addEventListener('click', addTodo);
clearAllBtn.addEventListener('click', clearAll);
clearCompletedBtn.addEventListener('click', clearCompleted);
