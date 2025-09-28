// Global variables
let tasks = {
    todo: [],
    progress: [],
    done: []
};

let taskIdCounter = 1;

// Initialize the app
function init() {
    updateDateDisplay();
    loadTasks();
    renderAllTasks();
    loadTheme();
}

// Update date display
function updateDateDisplay() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('dateDisplay').textContent = now.toLocaleDateString('en-US', options);
}

// Theme functionality
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
        themeToggle.title = 'Toggle Light Mode';
        saveTheme('dark');
    } else {
        themeToggle.textContent = '🌙';
        themeToggle.title = 'Toggle Dark Mode';
        saveTheme('light');
    }
}

function saveTheme(theme) {
    // In a real app, this would save to localStorage
    // For this demo, we'll store it in a variable
    window.currentTheme = theme;
}

function loadTheme() {
    // In a real app, this would load from localStorage
    // For this demo, we'll default to light mode
    const savedTheme = window.currentTheme || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = '☀️';
        document.getElementById('themeToggle').title = 'Toggle Light Mode';
    }
}

// Toggle add task input
function toggleAddTask(column) {
    const inputGroup = document.getElementById(column + 'Input');
    const isActive = inputGroup.classList.contains('active');
    
    // Close all input groups
    document.querySelectorAll('.input-group').forEach(group => {
        group.classList.remove('active');
    });
    
    if (!isActive) {
        inputGroup.classList.add('active');
        document.getElementById(column + 'Text').focus();
    }
}

// Cancel add task
function cancelAddTask(column) {
    document.getElementById(column + 'Input').classList.remove('active');
    document.getElementById(column + 'Text').value = '';
}

// Add new task
function addTask(column) {
    const textInput = document.getElementById(column + 'Text');
    const prioritySelect = document.getElementById(column + 'Priority');
    const text = textInput.value.trim();
    
    if (text === '') {
        alert('Please enter a task description');
        return;
    }

    const task = {
        id: taskIdCounter++,
        text: text,
        priority: prioritySelect.value,
        completed: column === 'done',
        createdAt: new Date().toLocaleString(),
        column: column
    };

    tasks[column].push(task);
    textInput.value = '';
    document.getElementById(column + 'Input').classList.remove('active');
    
    saveTasks();
    renderAllTasks();
}

// Delete task
function deleteTask(column, taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks[column] = tasks[column].filter(task => task.id !== taskId);
        saveTasks();
        renderAllTasks();
    }
}

// Move task between columns
function moveTask(fromColumn, toColumn, taskId) {
    const taskIndex = tasks[fromColumn].findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        const task = tasks[fromColumn][taskIndex];
        task.column = toColumn;
        task.completed = toColumn === 'done';
        
        tasks[fromColumn].splice(taskIndex, 1);
        tasks[toColumn].push(task);
        
        saveTasks();
        renderAllTasks();
    }
}

// Edit task
function editTask(column, taskId) {
    const task = tasks[column].find(t => t.id === taskId);
    if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderAllTasks();
        }
    }
}

// Render all tasks
function renderAllTasks() {
    renderTasks('todo');
    renderTasks('progress');
    renderTasks('done');
    updateCounts();
}

// Render tasks for a specific column
function renderTasks(column) {
    const container = document.getElementById(column + 'Tasks');
    
    if (tasks[column].length === 0) {
        container.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        return;
    }

    const tasksHTML = tasks[column].map(task => {
        const priorityClass = `priority-${task.priority}`;
        const completedClass = task.completed ? 'completed' : '';
        
        return `
            <div class="task-card ${completedClass}">
                <div class="task-header">
                    <div class="task-text">
                        <span class="priority-indicator ${priorityClass}"></span>
                        ${task.text}
                    </div>
                    <div class="task-actions">
                        <button class="task-btn edit" onclick="editTask('${column}', ${task.id})" title="Edit">✏️</button>
                        ${column !== 'done' ? `<button class="task-btn complete" onclick="moveTask('${column}', '${column === 'todo' ? 'progress' : 'done'}', ${task.id})" title="${column === 'todo' ? 'Start' : 'Complete'}">${column === 'todo' ? '▶️' : '✅'}</button>` : ''}
                        ${column !== 'todo' ? `<button class="task-btn" onclick="moveTask('${column}', '${column === 'progress' ? 'todo' : 'progress'}', ${task.id})" title="Move back">↩️</button>` : ''}
                        <button class="task-btn delete" onclick="deleteTask('${column}', ${task.id})" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="task-meta">
                    <span>Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                    <span>${task.createdAt}</span>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = tasksHTML;
}

// Update task counts
function updateCounts() {
    document.getElementById('todoCount').textContent = tasks.todo.length;
    document.getElementById('progressCount').textContent = tasks.progress.length;
    document.getElementById('doneCount').textContent = tasks.done.length;
}

// Save tasks to memory (simulating persistence)
function saveTasks() {
    // In a real app, this would save to localStorage or a database
    // For this demo, tasks persist only during the session
}

// Load tasks from memory
function loadTasks() {
    // In a real app, this would load from localStorage or a database
    // Starting with some sample tasks for demonstration
    if (tasks.todo.length === 0 && tasks.progress.length === 0 && tasks.done.length === 0) {
        tasks.todo = [
            {
                id: taskIdCounter++,
                text: "Design new UI mockups",
                priority: "high",
                completed: false,
                createdAt: new Date().toLocaleString(),
                column: "todo"
            }
        ];
        
        tasks.progress = [
            {
                id: taskIdCounter++,
                text: "Implement user authentication",
                priority: "medium",
                completed: false,
                createdAt: new Date().toLocaleString(),
                column: "progress"
            }
        ];
        
        tasks.done = [
            {
                id: taskIdCounter++,
                text: "Set up project structure",
                priority: "low",
                completed: true,
                createdAt: new Date().toLocaleString(),
                column: "done"
            }
        ];
    }
}

// Event Listeners
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const activeInput = document.querySelector('.input-group.active .task-input');
        if (activeInput && e.target === activeInput) {
            const column = activeInput.id.replace('Text', '');
            addTask(column);
        }
    }
    
    if (e.key === 'Escape') {
        document.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('active');
        });
    }
});

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', init);