document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const habitTracker = document.getElementById('habit-tracker');
    const logoutButton = document.getElementById('logout');
    const newHabitInput = document.getElementById('new-habit');
    const addHabitButton = document.getElementById('add-habit');
    const habitsDiv = document.getElementById('habits');

    let currentUser = null;

    // Show register form
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        habitTracker.style.display = 'none'; 
    });

    // Show login form
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        habitTracker.style.display = 'none'; 
    });

    // Register user
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            alert('Username already exists.');
        } else {
            users[username] = { password, habits: [] };
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful. Please login.');
            registerForm.reset();
            showLogin.click();
        }
    });

    // Login user
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username] && users[username].password === password) {
            currentUser = username;
            loginForm.style.display = 'none';
            registerForm.style.display = 'none';
            habitTracker.style.display = 'block'; 
            loadHabits(); 
        } else {
            alert('Invalid username or password.');
        }
    });

    // Logout user
    logoutButton.addEventListener('click', () => {
        currentUser = null;
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        habitTracker.style.display = 'none'; 
        habitsDiv.innerHTML = ''; 
    });

    // Add new habit
    addHabitButton.addEventListener('click', () => {
        const habitName = newHabitInput.value.trim();
        if (habitName) {
            const users = JSON.parse(localStorage.getItem('users'));
            const newHabit = { name: habitName, days: Array(100).fill(false), startDate: new Date().toISOString() };
            users[currentUser].habits.push(newHabit);
            localStorage.setItem('users', JSON.stringify(users));
            newHabitInput.value = '';
            loadHabits(); 
        }
    });

    // Load habits
    function loadHabits() {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users && currentUser && users[currentUser]) {
            const habits = users[currentUser].habits;
            habitsDiv.innerHTML = ''; 
            habits.forEach((habit, index) => {
                const habitDiv = document.createElement('div');
                habitDiv.className = 'habit';

                const habitHeader = document.createElement('div');
                habitHeader.className = 'habit-header';
                habitHeader.innerHTML = `
                    <span>${habit.name}</span>
                    <button class="delete-habit-btn" data-habit-index="${index}">&times;</button>
                `;
                habitDiv.appendChild(habitHeader);

                habit.days.forEach((done, dayIndex) => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'habit-checkbox';
                    checkbox.checked = done;
                    checkbox.addEventListener('change', () => {
                        habit.days[dayIndex] = checkbox.checked;
                        localStorage.setItem('users', JSON.stringify(users));
                    });
                    habitDiv.appendChild(checkbox);
                });

                habitsDiv.appendChild(habitDiv);
            });

            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-habit-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = e.target.dataset.habitIndex;
                    users[currentUser].habits.splice(index, 1);
                    localStorage.setItem('users', JSON.stringify(users));
                    loadHabits(); 
                });
            });
        }
    }
});
