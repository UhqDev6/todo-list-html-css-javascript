const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO-APPS';

document.addEventListener('DOMContentLoaded', function() {
    /*Kode di atas adalah sebuah listener yang akan menjalankan kode yang ada didalamnya ketika 
    event DOMContentLoaded dibangkitkan alias ketika semua 
    elemen HTML sudah dimuat menjadi DOM dengan baik.*/

    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addTodo();
    });
    if(isStorageExist()){
        loadDataFromStorage();
    }
});


const addTodo = () => {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;
    /* kode di atas berfungsi untuk mengambil elemen pada html. Dalam kasus tersebut, kita menangkap element 
    input dengan id title dan memanggil properti value untuk 
    mendapatkan nilai yang diinputkan oleh user */

    const generatedID = generatedId();
    const todoObject = generatedTodoObject(generatedID, textTodo, timestamp, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const generatedId = () => {
    return +new Date();
}

const generatedTodoObject = (id, task, timestamp, isCompilated) => {
    return {
        id, 
        task,
        timestamp,
        isCompilated
    }
}


const makeTodo = (todoObject) => {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);

    container.setAttribute('id' , `todo-${todoObject.id}`);

    if(todoObject.isCompilated) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', ()=> {
            undoTaskFromComplated(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', ()=> {
            removeTaskFromComplated(todoObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', ()=> {
            addTaskToComplated(todoObject.id);
        });

        container.append(checkButton);
    }

    return container;
}

const addTaskToComplated = (todoId) => {
    const todoTarget = findTodo(todoId);

    if(todoTarget == null) return;

    todoTarget.isCompilated = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const findTodo = (todoId) => {
    for(const todoItem of todos){
        if(todoItem.id === todoId){
            return todoItem;
        }
    }
    return null;
}

const findTodoIndex = (todoId) => {
    for(const index in todos){
        if(todos[index].id === todoId){
            return index; 
        }
    }

}

const removeTaskFromComplated = (todoId) => {
    const todoTarget = findTodoIndex(todoId);
    if(todoTarget === -1) return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const undoTaskFromComplated = (todoId) => {
    const todoTarget = findTodo(todoId);

    if(todoTarget == null) return;

    todoTarget.isCompilated = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


document.addEventListener(RENDER_EVENT, () => {
    console.log(todos);
    const uncomplatedTodoList = document.getElementById('todos');
    uncomplatedTodoList.innerHTML = '';

    const compilatedTodoList = document.getElementById('complated-todos');
    compilatedTodoList.innerHTML = '';

    for(const todoItem of todos){
        const todoElement = makeTodo(todoItem);
        if(!todoItem.isCompilated){
            uncomplatedTodoList.append(todoElement);
        }else{
            compilatedTodoList.append(todoElement);
        }
    }
});


const saveData = () => {
    if(isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const isStorageExist = () => {
    if(typeof (Storage) === 'undefined') {
        alert('browser tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener('SAVED_EVENT', () => {
    console.log(localStorage.getItem(STORAGE_KEY));
});

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    console.log(data);

    if(data !== null) {
        for(const todo of data){
            todos.push(todo);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}