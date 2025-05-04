
const card = document.getElementById('card');
const colorOptions = document.querySelectorAll('.color-option');
const animationSelect = document.getElementById('animation-select');
const styleButtons = document.querySelectorAll('.style-btn');
const speedControl = document.getElementById('speed-control');
const speedValue = document.getElementById('speed-value');
const triggerAnimationBtn = document.getElementById('trigger-animation');
const resetPreferencesBtn = document.getElementById('reset-preferences');
const pulseBtn = document.querySelector('.pulse-btn');

// AppState
let currentTheme = {
    backgroundColor: '#3498db',
    animation: 'bounce',
    style: 'rounded',
    speed: 1
};

// Initialize the app
function initApp() {
    loadPreferences();
    applyCurrentTheme();
    setupEventListeners();

    //initial active states
    updateActiveStates();

    // animation to grab attention
    setTimeout(() => {
        triggerCardAnimation();
    }, 1000);
}

//fetch from localStorage
function loadPreferences() {
    try {
        const savedTheme = localStorage.getItem('userTheme');
        if (savedTheme) {
            currentTheme = JSON.parse(savedTheme);
            console.log('Loaded saved preferences:', currentTheme);
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}

// Save to localStorage
function savePreferences() {
    try {
        localStorage.setItem('userTheme', JSON.stringify(currentTheme));
        console.log('Preferences saved:', currentTheme);

        showSaveFeedback();
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

// Apply current theme
function applyCurrentTheme() {

    card.style.backgroundColor = currentTheme.backgroundColor;
    triggerAnimationBtn.style.backgroundColor = currentTheme.backgroundColor;

    // card style
    card.className = 'animated-card ' + currentTheme.style;

    animationSelect.value = currentTheme.animation;

    //speed control
    speedControl.value = currentTheme.speed;
    speedValue.textContent = currentTheme.speed + 'x';
}

function setupEventListeners() {
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentTheme.backgroundColor = option.dataset.color;
            card.style.backgroundColor = currentTheme.backgroundColor;
            triggerAnimationBtn.style.backgroundColor = currentTheme.backgroundColor;
            savePreferences();
            updateActiveStates();
        });
    });

    animationSelect.addEventListener('change', () => {
        currentTheme.animation = animationSelect.value;
        savePreferences();
    });


    styleButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentTheme.style = button.dataset.style;
            card.className = 'animated-card ' + currentTheme.style;
            savePreferences();
            updateActiveStates();
        });
    });

    speedControl.addEventListener('input', () => {
        currentTheme.speed = parseFloat(speedControl.value);
        speedValue.textContent = currentTheme.speed + 'x';
        savePreferences();
    });


    triggerAnimationBtn.addEventListener('click', triggerCardAnimation);


    resetPreferencesBtn.addEventListener('click', resetPreferences);


    pulseBtn.addEventListener('click', () => {
        pulseBtn.classList.add('animate-pulse');
        setTimeout(() => {
            pulseBtn.classList.remove('animate-pulse');
        }, 1000);
    });
}

// Update active states for UI elements
function updateActiveStates() {
    colorOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === currentTheme.backgroundColor) {
            option.classList.add('active');
        }
    });

    styleButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.style === currentTheme.style) {
            button.classList.add('active');
        }
    });
}

function triggerCardAnimation() {
    // Remove previous animations
    card.className = 'animated-card ' + currentTheme.style;

    // Force a reflow to restart animation
    void card.offsetWidth;

    // Apply animation with current speed
    card.style.animationDuration = (1 / currentTheme.speed) + 's';
    if (currentTheme.animation === 'flip') {
        // Flip once
        card.style.animationIterationCount = '1';
    } else {
        card.style.animationIterationCount = 'infinite';
    }

    card.classList.add('animate-' + currentTheme.animation);

    //flip animation, reset after completion
    if (currentTheme.animation === 'flip') {
        setTimeout(() => {
            card.classList.remove('animate-flip');
        }, (1000 / currentTheme.speed));
    }
}

function resetPreferences() {
    // Default theme
    currentTheme = {
        backgroundColor: '#3498db',
        animation: 'bounce',
        style: 'rounded',
        speed: 1
    };

    applyCurrentTheme();
    updateActiveStates();
    savePreferences();

    resetPreferencesBtn.textContent = 'Preferences Reset!';
    setTimeout(() => {
        resetPreferencesBtn.textContent = 'Reset Preferences';
    }, 1500);

    // animation after reset
    setTimeout(() => {
        triggerCardAnimation();
    }, 300);
}

// Create and append a notification element
function showSaveFeedback() {
    const notification = document.createElement('div');
    notification.textContent = 'Preferences Saved!';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#2ecc71';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'all 0.3s ease';

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);

    // Remove notification
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}


document.addEventListener('DOMContentLoaded', initApp);
