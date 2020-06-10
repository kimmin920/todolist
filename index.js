const form = document.querySelector(".form");
const pending = document.querySelector(".pending");
const finished = document.querySelector(".finished");
const alert = document.querySelector(".alert");
const plusBtn = document.querySelector(".plus-icon");

let pendingArr = [];
let finishedArr = [];

function handleRewind(e) {
  const btn = e.target.parentNode.parentNode;
  finished.removeChild(btn);
  const id = btn.id;
  let value;
  finishedArr.map(each => each.id === id && (value = each.text));
  deleteDoneLS(id);
  makePendingList(value, id);
}
function setFinishedLS() {
  localStorage.setItem("finishedArr", JSON.stringify(finishedArr));
}
function makeDoneList(value, id) {
  const btnBox = document.createElement("span");
  const delBtn = document.createElement("button");
  delBtn.innerText = "✖️";
  const rewindBtn = document.createElement("button");
  rewindBtn.innerText = "➰";
  const newLi = document.createElement("li");
  const newId = id || Date.now().toString();
  newLi.id = newId;
  newLi.innerText = value;
  btnBox.appendChild(delBtn);
  btnBox.appendChild(rewindBtn);
  newLi.appendChild(btnBox);
  finished.appendChild(newLi);
  const liObj = {
    id: newId,
    text: value
  };
  finishedArr.push(liObj);
  setFinishedLS();
  delBtn.addEventListener("click", handleDelete);
  rewindBtn.addEventListener("click", handleRewind);
}

function deleteLS(id) {
  const newToDos = pendingArr.filter(each => {
    return each.id !== id;
  });
  pendingArr = newToDos;
  setPendingLS();
}
function deleteDoneLS(id) {
  const newDones = finishedArr.filter(each => {
    return each.id !== id;
  });
  finishedArr = newDones;
  setFinishedLS();
}

function handleDelete(e) {
  const btn = e.target.parentNode.parentNode;
  let listName = btn.parentNode.className;
  console.log(listName);
  const id = btn.id;
  if (listName === "pending") {
    pending.removeChild(btn);
    deleteLS(id);
  }
  if (listName === "finished") {
    finished.removeChild(btn);
    deleteDoneLS(id);
  }
}
function handleDone(e) {
  const btn = e.target.parentNode.parentNode;
  pending.removeChild(btn);
  const id = btn.id;
  let value;
  pendingArr.map(each => each.id === id && (value = each.text));
  deleteLS(id);
  makeDoneList(value, id);
}

function setPendingLS() {
  localStorage.setItem("pendingArr", JSON.stringify(pendingArr));
}
function makePendingList(value, id) {
  // create buttons.
  const btnBox = document.createElement("span");
  const delBtn = document.createElement("button");
  const doneBtn = document.createElement("button");
  delBtn.innerText = "✖️";
  doneBtn.innerText = "✔️";
  // create each list.
  const newLi = document.createElement("li");
  // get new id if it's new list
  const newId = id || Date.now().toString();
  newLi.id = newId;
  newLi.innerText = value;
  btnBox.appendChild(delBtn);
  btnBox.appendChild(doneBtn);
  newLi.appendChild(btnBox);
  pending.appendChild(newLi);
  form.task.value = "";
  const liObj = {
    id: newId,
    text: value
  };
  pendingArr.push(liObj);
  setPendingLS();
  delBtn.addEventListener("click", handleDelete);
  doneBtn.addEventListener("click", handleDone);
}

function handleSubmit(e) {
  e.preventDefault();
  let value = form.task.value;
  if (value.length > 13) {
    alert.innerHTML = `⚠️ TEXTS MUST BE UNDER 12 LETTERS ⚠️ ( current input: ${
      value.length
    } )`;
  } else {
    alert.innerHTML = "";
    makePendingList(value);
  }
}
function callFinishedLS() {
  const doneLS = localStorage.getItem("finishedArr");
  if (doneLS !== null) {
    const arr = JSON.parse(doneLS);
    arr.map(e => makeDoneList(e.text, e.id));
  }
}

function callPendingLS() {
  const todosLS = localStorage.getItem("pendingArr");
  if (todosLS !== null) {
    const arr = JSON.parse(todosLS);
    arr.map(e => makePendingList(e.text, e.id));
  }
}

function init() {
  // from localstorage to DOM.
  callPendingLS();
  callFinishedLS();

  // add task(input) submit event.
  form.addEventListener("submit", handleSubmit);
  plusBtn.addEventListener("click", handleSubmit);
}

init();
