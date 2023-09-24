// Select elements
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Function to toggle a task's completion status and reposition it in the list
function toggleTaskCompletion(event) {
    const listItem = event.target;
    const isCompleted = listItem.classList.contains('completed');

    if (isCompleted) {
        // Task is completed, mark it as incomplete and move it above the first completed task
        listItem.classList.remove('completed');
        listItem.style.backgroundColor = ''; // Reset the button color
        const completedTasks = Array.from(taskList.querySelectorAll('.completed'));
        if (completedTasks.length > 0) {
            taskList.insertBefore(listItem, completedTasks[0]);
        } else {
            taskList.insertBefore(listItem, taskList.firstChild);
        }
    } else {
        // Task is incomplete, mark it as completed, turn the button gray, and move it to the bottom
        listItem.classList.add('completed');
        listItem.style.backgroundColor = 'gray';
        taskList.appendChild(listItem);
    }
}

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const listItem = document.createElement('li');
        listItem.textContent = taskText;
        taskList.insertBefore(listItem, taskList.firstChild);

        // Add a click event listener to toggle task completion and reposition it
        listItem.addEventListener('click', toggleTaskCompletion);

        // Clear the task input field
        taskInput.value = '';
    }
}

 

// Event listener for adding tasks
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
