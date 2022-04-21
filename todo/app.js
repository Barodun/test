let root = document.getElementById("root");

function createElem(tagName, className, text) {
  let tag = document.createElement(tagName);
  className ? tag.classList.add(className) : null;
  text ? (tag.innerText = text) : null;
  return tag;
}

function createInput(tagName, typeName, text, className) {
  let input = document.createElement(tagName);
  input.type = typeName;
  input.placeholder = text;
  className ? input.classList.add(className) : null;
  return input;
}

let id = 0;
let todos = [];

function setLocal(key, value) {
  let string = JSON.stringify(value);
  localStorage.setItem(key, string);
}

function saveID() {
  setLocal("todoID", id);
  console.log('jopa')
}

function setName() {
  let todo = {
    id: ++id,
    date: new Date().toLocaleDateString(),
    text: textToDo(),
    isChecked: false,
  };
  todos.push(todo);
  setLocal("todos", todos);
  saveID();
}

function deleteAllCard() {
  todos.length = 0;
  setLocal("todos", todos);
  addCard();
  id = 0;
  saveID();
}

function deleteLast() {
  todos.length = todos.length - 1;
  setLocal("todos", todos);
  addCard();
}

function textToDo() {
  let text = document.querySelector("input");
  let val = text.value;
  text.value = "";
  return val;
}

function deleteCurrent() {
  let elements = document.querySelectorAll(".delete");
  elements.forEach((element) => {
    element.addEventListener("click", () => {
      let parent = element.parentElement.parentElement;
      let todoId = parent.getAttribute('data-id');
      let todo = todos.find((e) => e.id == todoId);
      todos.splice(todos.indexOf(todo), 1);
      setLocal("todos", todos);

      countAll();
      countCompleted();
      parent.remove();
    });
  });
}

function doneCurrent() {
  let elements = document.querySelectorAll(".done");
  elements.forEach((element) => {
    element.addEventListener("click", () => {
      let parent = element.parentElement.parentElement;
      let todoDone = parent.getAttribute('checked');
      let todoId = parent.getAttribute('data-id');
      let todo = todos.find((e) => e.id == todoId);
      if (todoDone == 'false') {
        parent.setAttribute('checked', 'true');
        todo.isChecked = true;
        element.innerHTML = "✖";
      } else {
        parent.setAttribute('checked', 'false');
        todo.isChecked = false;
        element.innerHTML = "✔";
      }
      setLocal("todos", todos);

      countAll();
      countCompleted();
    });
  });
}

function countAll() {
  document.querySelector(".todo__all").innerHTML =
    "All: " + document.querySelectorAll(".todo__wrapper").length;
}

function countCompleted() {
  document.querySelector(".todo__done").innerHTML =
    "Completed: " + document.querySelectorAll("[checked='true']").length;
}

function showCompleted() {
  let all = document.querySelectorAll(".todo__wrapper");
  all.forEach((element) => {
    element.style.display = "none";
  });
  let completed = document.querySelectorAll("[checked='true']");
  completed.forEach((element) => {
    element.style.display = "block";
  });
}

function showAll() {
  let all = document.querySelectorAll(".todo__wrapper");
  all.forEach((element) => {
    element.style.display = "block";
  });
}

function changeButton() {
  let elements = document.querySelectorAll(".done");
  elements.forEach((element) => {
    let parent = element.parentElement.parentElement;
    let todoDone = parent.getAttribute('checked');
    if (todoDone == 'false') {
      element.innerHTML = "✔";
    } else {
      element.innerHTML = "✖";
    }
  })
}

function addCard() {
  todosWrapper.innerHTML = "";
  todos.forEach((el) => {
    let wrapper = '';
    let rowThird = '';
    let buttonCreate = '';
    let todoText = '';
    let buttonCancel = '';
    let date = '';
    wrapper = createElem("div", "todo__wrapper");
    rowThird = createElem("div", "todo__text");
    buttonCreate = createElem("button", "done", "✔");
    todoText = createElem("p", "todo__name", el.text);
    buttonCancel = createElem("button", "delete", "🗑");
    date = createElem("p", "todo__date", el.date);

    container.append(todosWrapper);
    todosWrapper.append(wrapper);
    wrapper.append(rowThird);
    wrapper.setAttribute('data-id', el.id);
    wrapper.setAttribute('checked', el.isChecked)
    rowThird.append(buttonCreate);
    rowThird.append(todoText);
    rowThird.append(buttonCancel);
    rowThird.append(date);
  });
}

let container = createElem("div", "container");

let rowFirst = createElem("div", "todo__enter");
let buttonDeleteAll = createElem("button", "", "Delete All");
buttonDeleteAll.addEventListener("click", () => {
  deleteAllCard();
  countAll();
  countCompleted();
});
let buttonDeleteLast = createElem("button", "", "Delete Last");
buttonDeleteLast.addEventListener("click", () => {
  deleteLast();
  countAll();
  countCompleted();
});
let inputEnter = createInput("input", "text", "Enter todo...");
let buttonAdd = createElem("button", "", "Add");
buttonAdd.addEventListener("click", () => {
  setName();
  addCard();
  deleteCurrent();
  doneCurrent();
  countAll();
  countCompleted();
});

let rowSecond = createElem("div", "todo__search");
let textAll = createElem("p", "todo__all", "All: 0");
let textCompleted = createElem("p", "todo__done", "Completed: 0");
let buttonShowAll = createElem("button", "", "Show All");
buttonShowAll.addEventListener("click", showAll);
let buttonShowCompleted = createElem("button", "", "Show Completed");
buttonShowCompleted.addEventListener("click", showCompleted);
let inputSearch = createInput("input", "search", "Search");
let todosWrapper = createElem("div", "todos__wrapper");

window.addEventListener("load", () => {
  let localData = localStorage.getItem("todos");
  let localID = localStorage.getItem("todoID");
  if (localData) {
    todos = JSON.parse(localData);
    addCard();
  }
  if (localID) {
    id = JSON.parse(localID);
  }
});
window.addEventListener("load", () => {
  deleteCurrent();
  doneCurrent();
  countAll();
  countCompleted();
  changeButton();
})

container.append(rowFirst);
rowFirst.append(buttonDeleteAll);
rowFirst.append(buttonDeleteLast);
rowFirst.append(inputEnter);
rowFirst.append(buttonAdd);

container.append(rowSecond);
rowSecond.append(textAll);
rowSecond.append(textCompleted);
rowSecond.append(buttonShowAll);
rowSecond.append(buttonShowCompleted);
rowSecond.append(inputSearch);

root.append(container);

function search() {
  todosWrapper.innerHTML = "";
  todos.forEach((el) => {
    if (el.text.toLocaleLowerCase().indexOf(document.querySelector('input[type="search"]').value.toLocaleLowerCase()) !== -1) {
      let wrapper = createElem("div", "todo__wrapper");
      let rowThird = createElem("div", "todo__text");
      let buttonCreate = createElem("button", "done", "✔️");
      let todoText = createElem("p", "todo__name", el.text);
      let buttonCancel = createElem("button", "delete", "🗑");
      let date = createElem("p", "todo__date", el.date);

      container.append(todosWrapper);
      todosWrapper.append(wrapper);
      wrapper.append(rowThird);
      wrapper.setAttribute('data-id', el.id);
      wrapper.setAttribute('checked', el.isChecked)
      rowThird.append(buttonCreate);
      rowThird.append(todoText);
      rowThird.append(buttonCancel);
      rowThird.append(date);
    }
  });
}

inputSearch.addEventListener('change', search);