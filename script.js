document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyState = document.querySelector('.empty-state');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');
    const progressMessage = document.getElementById('progress-message');

    // Show or hide empty state
    const toggleEmptyState = () => {
        const isEmpty = taskList.children.length === 0;

        emptyState.style.display = isEmpty ? 'flex' : 'none';
    
        todosContainer.style.width = isEmpty ? '50%' : '100%';
    };

    // Confetti animation
    const Confetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, options) {
            confetti(
                Object.assign({}, defaults, options, {
                    particleCount: Math.floor(count * particleRatio)
                })
            );
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55
        });

        fire(0.2, {
            spread: 60
        });

        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 45
        });
    };

    // Update progress bar
    const updateProgress = (
        checkCompletion = true
    ) => {
        const totalTasks =
            taskList.children.length;
    
        const completedTasks =
            taskList.querySelectorAll(
                '.checkbox:checked'
            ).length;
    
        const progress =
            totalTasks > 0
                ? Math.round(
                    (completedTasks / totalTasks) * 100
                  )
                : 0;
    
        progressBar.style.width =
            `${progress}%`;
    
        progressNumbers.textContent =
            `${completedTasks} / ${totalTasks}`;
    
        // Progress messages
        if (totalTasks === 0) {
            progressMessage.textContent =
                'Ready to start 🚀';
    
        } else if (progress <= 25) {
            progressMessage.textContent =
                `First steps 🌱 (${progress}%)`;
    
        } else if (progress <= 50) {
            progressMessage.textContent =
                `Building momentum ⚡ (${progress}%)`;
    
        } else if (progress <= 75) {
            progressMessage.textContent =
                `Crushing it 🔥 (${progress}%)`;
    
        } else if (progress < 100) {
            progressMessage.textContent =
                `Final stretch 🎯 (${progress}%)`;
    
        } else {
            progressMessage.textContent =
                'Mission complete 🎉';
        }
    
        if (
            checkCompletion &&
            totalTasks > 0 &&
            completedTasks === totalTasks
        ) {
            Confetti();
        }
    };

    // Save tasks
    const saveTasksToLocalStorage = () => {
        const tasks = Array.from(
            taskList.querySelectorAll('li')
        ).map(li => ({
            text: li.querySelector('span').textContent,
            completed:
                li.querySelector('.checkbox').checked
        }));

        localStorage.setItem(
            'tasks',
            JSON.stringify(tasks)
        );
    };

    // Add task
    const addTask = (
        text,
        completed = false,
        checkCompletion = true
    ) => {
        const taskText =
            text || taskInput.value.trim();

        if (!taskText) return;

        const li = document.createElement('li');

        li.innerHTML = `
            <input
                type="checkbox"
                class="checkbox"
                ${completed ? 'checked' : ''}
            >

            <span>${taskText}</span>

            <div class="task-buttons">
                <button class="edit-btn" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="delete-btn" title ="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        const checkbox =
            li.querySelector('.checkbox');

        const editBtn =
            li.querySelector('.edit-btn');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        // Toggle completed
        checkbox.addEventListener(
            'change',
            () => {
                const isChecked =
                    checkbox.checked;

                li.classList.toggle(
                    'completed',
                    isChecked
                );

                editBtn.disabled =
                    isChecked;

                editBtn.style.opacity =
                    isChecked ? '0.5' : '1';

                editBtn.style.pointerEvents =
                    isChecked
                        ? 'none'
                        : 'auto';

                updateProgress();
                saveTasksToLocalStorage();
            }
        );

        // Edit task
        editBtn.addEventListener(
            'click',
            () => {
                if (!checkbox.checked) {
                    taskInput.value =
                        li.querySelector('span')
                            .textContent;

                    li.remove();

                    toggleEmptyState();
                    updateProgress(false);
                    saveTasksToLocalStorage();
                }
            }
        );

        // Delete task
        li.querySelector('.delete-btn')
            .addEventListener('click', () => {
                li.remove();

                toggleEmptyState();
                updateProgress(false);
                saveTasksToLocalStorage();
            });

        taskList.appendChild(li);

        taskInput.value = '';

        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTasksToLocalStorage();
    };

    // Load tasks
    const loadTasksFromLocalStorage = () => {
        const savedTasks =
            JSON.parse(
                localStorage.getItem('tasks')
            ) || [];

        savedTasks.forEach(
            ({ text, completed }) =>
                addTask(
                    text,
                    completed,
                    false
                )
        );

        toggleEmptyState();
        updateProgress();
    };

    // Add task button
    addTaskBtn.addEventListener(
        'click',
        () => addTask()
    );

    // Enter key
    taskInput.addEventListener(
        'keypress',
        e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTask();
            }
        }
    );

    // Initial load
    toggleEmptyState();
    loadTasksFromLocalStorage();


    // Drag and drop board
new Sortable(taskList, {
  animation: 150,
});
});