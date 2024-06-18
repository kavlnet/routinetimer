let exercises = [];
const exerciseCompleteSound = new Audio('sounds/beep.mp3'); // Ensure the path matches your sound file's location

document.addEventListener('DOMContentLoaded', () => {
    loadExercises(); // Load exercises from localStorage if any
    updateButtonStates(); // Update button states based on loaded exercises
});

document.getElementById('addExercise').addEventListener('click', () => {
    const name = document.getElementById('exerciseName').value;
    const time = parseInt(document.getElementById('exerciseTime').value, 10);
    if (name && time > 0) {
        exercises.push({ name, time });
        saveExercises();
        updateExerciseList();
        updateButtonStates();
        document.getElementById('exerciseName').value = '';
        document.getElementById('exerciseTime').value = '';
    }
});

document.getElementById('startExercises').addEventListener('click', startExercises);
document.getElementById('restartExercises').addEventListener('click', restartApp);
document.getElementById('clearExercises').addEventListener('click', clearExercises);

function updateExerciseList() {
    const list = document.getElementById('exerciseList');
    list.innerHTML = exercises.map(ex => `<p>${ex.name}: ${ex.time} seconds</p>`).join('');
}

function updateButtonStates() {
    const hasExercises = exercises.length > 0;
    document.getElementById('startExercises').disabled = !hasExercises;
    document.getElementById('clearExercises').disabled = !hasExercises;

    if (hasExercises) {
        document.getElementById('startExercises').style.display = 'inline';
        document.getElementById('clearExercises').style.display = 'inline';
    }
}

function startExercises() {
    document.getElementById('startExercises').style.display = 'none';
    document.getElementById('clearExercises').style.display = 'none';
    document.getElementById('exerciseForm').style.display = 'none';
    document.getElementById('exerciseList').style.display = 'none';
    document.getElementById('countdownDisplay').style.display = 'block';
    
    let index = 0;
    let exercisesForCountdown = exercises.map(ex => ({ ...ex }));

    function nextExercise() {
        if (index < exercisesForCountdown.length) {
            if (index > 0) { // Prevent sound playing before the first exercise
                exerciseCompleteSound.play();
            }
            const exercise = exercisesForCountdown[index++];
            document.getElementById('countdownDisplay').innerHTML = `<h1>${exercise.time} seconds of ${exercise.name}</h1>`;
            const intervalId = setInterval(() => {
                exercise.time--;
                if (exercise.time <= 0) {
                    clearInterval(intervalId);
                    if (index < exercisesForCountdown.length) {
                        exerciseCompleteSound.play(); // Play sound at the end of an exercise
                    }
                    nextExercise();
                } else {
                    document.getElementById('countdownDisplay').innerHTML = `<h1>${exercise.time} seconds of ${exercise.name}</h1>`;
                }
            }, 1000);
        } else {
            document.getElementById('countdownDisplay').innerHTML = `<h1>Done with all exercises!</h1>`;
            exercisesCompleted();
        }
    }
    nextExercise();
}

function exercisesCompleted() {
    exerciseCompleteSound.play(); // Play sound after completing all exercises
    document.getElementById('restartExercises').style.display = 'inline';
    document.getElementById('clearExercises').style.display = 'none';
}

function restartApp() {
    // Reset the countdown display to remove the "Done with all exercises!" message
    document.getElementById('countdownDisplay').style.display = 'none';
    // Hide the "Restart" button since we're restarting.
    document.getElementById('restartExercises').style.display = 'none';

    document.getElementById('exerciseForm').style.display = 'block';
    document.getElementById('exerciseList').style.display = 'block';
    document.getElementById('restartExercises').style.display = 'none';

    updateExerciseList();
    updateButtonStates(); // This will effectively revert the buttons to their initial state
}

function clearExercises() {
    exercises = [];
    localStorage.removeItem('exercises');
    updateExerciseList();
    updateButtonStates(); // Reset buttons to reflect no exercises
}

function saveExercises() {
    localStorage.setItem('exercises', JSON.stringify(exercises));
}

function loadExercises() {
    const storedExercises = localStorage.getItem('exercises');
    if (storedExercises) {
        exercises = JSON.parse(storedExercises);
        updateExerciseList();
    }
}
