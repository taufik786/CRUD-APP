const { connect } = require("mongoose");

const taskForm = document.getElementById('taskForm');
const taskName = document.getElementById('taskName');
const taskJob = document.getElementById('taskJob');
const taskAddress = document.getElementById('taskAddress');
const taskList = document.getElementById('taskList');

const {ipcRenderer, Renderer} = require('electron');

taskForm.addEventListener('submit', e => {
    e.preventDefault();
    // console.log(taskName.value,taskJob.value, taskAddress.value)
    const task = {
        name: taskName.value,
        job: taskJob.value,
        address: taskAddress.value
    }
    // ipcRenderer.send('new-task', task)
    if(!updateStatus){
        ipcRenderer.send('new-task', task);
    }else{
        ipcRenderer.send('update-task', {...task, idTaskToUpdate})
    }
    taskForm.reset();
    setTimeout(120)
});

ipcRenderer.on('new-task-created', (e, args) => {
    const newTask = JSON.parse(args);
    // console.log(newTask)
    tasks.push(newTask)
    renderTasks(tasks)
    alert("Task Created Successfully");
})


ipcRenderer.send('get-tasks');

ipcRenderer.on('get-tasks', (e, args)=> {
    const taskReceived = JSON.parse(args);
    tasks = taskReceived;
    // console.log(tasks)
    renderTasks(tasks);
})

let tasks = [];
function renderTasks(tasks){
    taskList.innerHTML = '';
    tasks.map(t => {
    taskList.innerHTML += `
        <li>
            <h4>Task Id : ${t._id}</h4>
            <p>Task Name : ${t.name}</p>
            <p>Task Job : ${t.job}</p>
            <p>Task Address : ${t.address}</p>
            <button onclick="deleteTask('${t._id}')" > Delete </button>
            <button onclick="editTask('${t._id}')"> Edit </button>
        </li>
    `;
    })
}

function deleteTask(id) {
    // console.log(id);
    // ipcRenderer.send('delete-task', id);
    const result = confirm('Are You Sure you want to delete it?')
    if(result){
        ipcRenderer.send('delete-task', id)
    }
    return;
}

ipcRenderer.on('delete-task-success', (e, args) => {
    // console.log(args)
    const deletedTask = JSON.parse(args);
    const newTasks = tasks.filter( t => {
        return t._id !== deletedTask._id;

    });
    tasks = newTasks;
    renderTasks(tasks);
})

let updateStatus = false;
let idTaskToUpdate = ''

function editTask(id){
    // console.log(id)
    updateStatus = true;
    idTaskToUpdate = id;
    const task = tasks.find(task => task._id === id)
    taskName.value = task.name;
    taskJob.value = task.job;
    taskAddress.value = task.address;

}
ipcRenderer.on('update-task-success', (e, args)=> {
    // console.log(args)
    const updatedTask = JSON.parse(args);
    tasks = tasks.map(t => {
        if(t._id === updatedTask._id){
            t.name = updatedTask.name;
            t.job = updatedTask.job;
            t.address = updatedTask.address;
        }
        return t;

    })
    renderTasks(tasks)
    alert('Task Updated')
})

