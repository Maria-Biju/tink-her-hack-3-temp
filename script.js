// Event listener for "Load Video"
document.getElementById('load-video').addEventListener('click', function () {
    const youtubeLink = document.getElementById('youtube-link').value.trim();
    const videoId = extractVideoId(youtubeLink);
    const iframe = document.getElementById('video-iframe');

    if (videoId) {
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        document.getElementById('youtube-link').value = ''; // Clear input field
        addVideoToSaved(youtubeLink); // Save the video link
        displaySavedVideos(); // Update saved videos list
    } else {
        iframe.src = ''; // Reset iframe if invalid
        showErrorMessage('Invalid YouTube link. Please enter a valid URL.');
    }
});

// Extract YouTube video ID
function extractVideoId(url) {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// Display error message
function showErrorMessage(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';
}

// Save video URL to local storage or in-memory
function addVideoToSaved(url) {
    let savedVideos = JSON.parse(localStorage.getItem('savedVideos')) || [];
    if (!savedVideos.includes(url)) {
        savedVideos.push(url);
        localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
    }
}

// Display saved videos
function displaySavedVideos() {
    const savedVideosContainer = document.getElementById('saved-videos');
    savedVideosContainer.innerHTML = ''; // Clear existing list

    const savedVideos = JSON.parse(localStorage.getItem('savedVideos')) || [];
    savedVideos.forEach((video, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="#" onclick="loadSavedVideo('${video}')">${video}</a> 
                              <button  onclick="removeVideo(${index})">Remove</button>`;
        savedVideosContainer.appendChild(listItem);
    });
}

// Load saved video into the iframe
function loadSavedVideo(url) {
    const iframe = document.getElementById('video-iframe');
    const videoId = extractVideoId(url);
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
}

// Remove video from saved list
function removeVideo(index) {
    let savedVideos = JSON.parse(localStorage.getItem('savedVideos')) || [];
    savedVideos.splice(index, 1); // Remove video at the specified index
    localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
    displaySavedVideos(); // Update list after removal
}

// Initialize the saved videos list when the page loads
window.onload = function() {
    displaySavedVideos();
};


document.getElementById('save-note').addEventListener('click', function () {
    const noteInput = document.getElementById('note-input').value;

    // Check if note is not empty
    if (noteInput.trim() !== '') {
        // Create a new note element
        const noteElement = document.createElement('div');
        noteElement.className = 'note';

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';

        // Add the delete button to the note element
        noteElement.textContent = noteInput;
        noteElement.appendChild(deleteButton);

        // Append the new note to the saved notes container
        document.getElementById('saved-notes').appendChild(noteElement);

        // Save to localStorage
        let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        savedNotes.push(noteInput);
        localStorage.setItem('notes', JSON.stringify(savedNotes));

        // Clear the input field
        document.getElementById('note-input').value = '';

        // Add event listener to the delete button
        deleteButton.addEventListener('click', function () {
            // Remove the note element from the DOM
            noteElement.remove();

            // Remove the note from localStorage
            savedNotes = savedNotes.filter(note => note !== noteInput);
            localStorage.setItem('notes', JSON.stringify(savedNotes));
        });
    } else {
        alert("Please enter a note before saving.");
    }
});

// Load saved notes when the page loads
window.addEventListener('load', function () {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

    savedNotes.forEach(note => {
        // Create a new note element
        const noteElement = document.createElement('div');
        noteElement.className = 'note';

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';

        // Add the delete button to the note element
        noteElement.textContent = note;
        noteElement.appendChild(deleteButton);

        // Append the new note to the saved notes container
        document.getElementById('saved-notes').appendChild(noteElement);

        // Add event listener to the delete button
        deleteButton.addEventListener('click', function () {
            // Remove the note element from the DOM
            noteElement.remove();

            // Remove the note from localStorage
            let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
            savedNotes = savedNotes.filter(savedNote => savedNote !== note);
            localStorage.setItem('notes', JSON.stringify(savedNotes));
        });
    });
});

// Add tasks
document.getElementById('add-task').addEventListener('click', function () {
    const taskInput = document.getElementById('task-input').value;
    const taskTime = document.getElementById('task-time').value;

    if (taskInput.trim() !== '' && taskTime) {
        const task = {
            text: taskInput,
            time: taskTime
        };

        // Save task to localStorage
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Add task to the DOM
        addTaskToDOM(task);

        // Clear input fields
        document.getElementById('task-input').value = '';
        document.getElementById('task-time').value = '';

        // Set reminder
        setReminder(task);
    } else {
        alert('Please enter a task and a valid time.');
    }
});

// Function to add task to the DOM
function addTaskToDOM(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';

    taskElement.innerHTML = `
        <span>${task.text}</span>
        <span class="time">${new Date(task.time).toLocaleString()}</span>
        <button class="delete-task">Delete</button>
    `;

    document.getElementById('task-list').appendChild(taskElement);

    // Delete task functionality
    taskElement.querySelector('.delete-task').addEventListener('click', function () {
        taskElement.remove();
        removeTaskFromStorage(task);
    });
}

// Function to remove task from localStorage
function removeTaskFromStorage(taskToRemove) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskToRemove.text || task.time !== taskToRemove.time);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to set a reminder
function setReminder(task) {
    const timeDiff = new Date(task.time).getTime() - new Date().getTime();
    if (timeDiff > 0) {
        setTimeout(() => {
            alert(`Reminder: ${task.text}`);
        }, timeDiff);
    }
}

// Load tasks from localStorage on page load
window.addEventListener('load', function () {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task);
        setReminder(task);
    });
});
