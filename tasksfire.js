
// Firebase configuration (replace with your own config)
var firebaseConfig = {
    apiKey: "AIzaSyBCxQrqopNLvh8f6PNKB-uXZS5Sf_RaT2g",
    authDomain: "carbonconnect2023.firebaseapp.com",
    projectId: "carbonconnect2023",
    storageBucket: "carbonconnect2023.appspot.com",
    messagingSenderId: "1041152472743",
    appId: "1:1041152472743:web:4297ad684e743d132f4d82",
  };

firebase.initializeApp(firebaseConfig);
// Get a reference to the Firebase database
const database = firebase.database()
var database_ref = database.ref()

// Reference to the task list <ul> element
var taskList = document.getElementById('task-list');

// Reference to the task input and add button
var taskInput = document.getElementById('task-input');
var addButton = document.getElementById('add-task-button');

// Reference to the Firebase database node
var tasksRef = database.ref('tasks');

// Function to add a task to the database
function addTaskToDatabase(task) {
    tasksRef.push().set({ text: task, completed: false }); // Added 'completed' field
}

// Function to toggle a task's completion status
function toggleTaskCompletion(taskKey, isCompleted) {
    tasksRef.child(taskKey).update({ completed: !isCompleted });
}

// Function to display tasks from the database
function displayTasksFromDatabase() {
    tasksRef.on('value', function (snapshot) {
        var incompleteTasks = [];
        var completedTasks = [];

        snapshot.forEach(function (childSnapshot) {
            var taskData = childSnapshot.val();
            var taskText = taskData.text;
            var taskKey = childSnapshot.key; // Unique key for the task
            var isCompleted = taskData.completed; // Added 'completed' status

            if (isCompleted) {
                completedTasks.push({ key: taskKey, text: taskText });
            } else {
                incompleteTasks.push({ key: taskKey, text: taskText });
            }
        });

        // Clear the task list
        taskList.innerHTML = '';

        // Display incomplete tasks first
        incompleteTasks.forEach(function (task) {
            createTaskListItem(task.key, task.text, false);
        });

        // Display completed tasks at the bottom
        completedTasks.forEach(function (task) {
            createTaskListItem(task.key, task.text, true);
        });
    });
}

// Function to create a task list item
function createTaskListItem(taskKey, taskText, isCompleted) {
    var listItem = document.createElement('li');
    var taskButton = document.createElement('button'); // Task button
    taskButton.innerText = taskText;

    if (isCompleted) {
        listItem.style.backgroundColor = '#f2f2f2'; // Gray background for completed tasks
        taskButton.addEventListener('click', function () {
            toggleTaskCompletion(taskKey, isCompleted); // Toggle task completion status
        });
    } else {
        taskButton.addEventListener('click', function () {
            toggleTaskCompletion(taskKey, isCompleted); // Toggle task completion status
        });
    }

    listItem.appendChild(taskButton);
    taskList.appendChild(listItem);
}

// Event listener for the "Add Task" button
addButton.addEventListener('click', function () {
    var newTask = taskInput.value.trim();
    if (newTask !== '') {
        addTaskToDatabase(newTask);
        taskInput.value = ''; // Clear the input field
    }
});

// Initialize and display tasks
displayTasksFromDatabase();

