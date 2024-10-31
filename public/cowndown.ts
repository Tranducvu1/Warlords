// Preloading sound for countdown to enhance user experience
const countdownsound: HTMLAudioElement = new Audio('../music/start.mp3');

// Set properties for the audio
countdownsound.loop = false; // Ensure sound plays only once
countdownsound.volume = 1.0;  // Set volume to maximum
let isPaused: boolean = false; 
let countdownInterval: number | null = null;
// Declare DOM elements for countdown display and overlay
const countdownelement: HTMLElement | null = document.getElementById('countdown');
const leftnumberelement: HTMLElement | null = document.getElementById('left-number');
const countdowntozeroelement: HTMLElement | null = document.getElementById('countdownToZero'); 
const overlaystart: HTMLElement | null = document.getElementById('overlay');
const bullet: HTMLElement | null = document.getElementById('bullet');
let totaltime: number = (7 * 60) + 3; // Total countdown time in seconds (7 minutes and 3 seconds)
let leftnumbervalue: number = 30; // Initial value for the left number display
let countdownstarted: boolean = false; // Flag to track if the countdown has started
let countdowntozerovalue: number = 30; // Initial value for countdown to zero
const pauseButton: HTMLElement | null = document.getElementById('pause');
//press enter to resume game
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        resumeGame();
    }
});
    
// Function to start the countdown
function startcountdown(): void {
    if (!countdownstarted) { // Check if countdown has not started
        countdownstarted = true; // Mark countdown as started
        countdownsound.play(); // Start playing the countdown sound
    }

    // Set up an interval to update the countdown display every second
    const interval = setInterval(() => {
        const minutes: number = Math.floor(totaltime / 60); // Calculate remaining minutes
        const seconds: number = totaltime % 60; // Calculate remaining seconds

        // Update the countdown display element, ensuring it exists
        if (countdownelement) {
            countdownelement.textContent = 
                String(minutes).padStart(2, '0') + ':' + // Format minutes with leading zero
                String(seconds).padStart(2, '0'); // Format seconds with leading zero
        }

        // Check if the countdown has reached zero
        if (totaltime <= 0) {
            clearInterval(interval); // Stop the interval when time's up
            if (countdownelement) {
                countdownelement.textContent = "Time's up!"; // Update display for end of countdown
            }
            showgameoverscreen(); // Trigger game over screen display
            countdownsound.pause(); // Stop sound playback
        }

        totaltime--; // Decrement total time remaining

    }, 1000); // Update interval set for every 1000 milliseconds (1 second)
}

// Function to display the game over screen
function showgameoverscreen(): void {
    if (overlaystart) {
        overlaystart.style.display = 'flex'; // Make the overlay visible on game over
    }
}

// Restart the game when the button is clicked
const restartbutton: HTMLElement | null = document.getElementById('restartButton');
if (restartbutton) {
    restartbutton.addEventListener('click', () => {
        location.reload(); // Reload the current page to restart the game
    });
}

// Error handling for audio loading
countdownsound.addEventListener('error', function(e: Event) {
    console.error('Error loading countdown sound:', e); // Log error if audio fails to load
});
//add event listener to pause button
if (pauseButton) {
    pauseButton.addEventListener('click', () => {
        if (isPaused) {
             resumeGame();  
        } else {
            pauseGame(); 
        }
    });
}

//add function to pause game
function pauseGame(): void {
    if (!isPaused) {
        isPaused = true; 
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
       
        const pauseOverlay: HTMLElement | null = document.getElementById('pauseOverlay');
        if (pauseOverlay) {
            pauseOverlay.style.display = 'flex';    
            console.log(pauseOverlay.style.display);
    }
}
}

//add function to resume game
function resumeGame(): void {
    if (isPaused) {
        isPaused = false;
        startcountdown(); 
        const pauseOverlay: HTMLElement | null = document.getElementById('pauseOverlay');
        if (pauseOverlay) {
            pauseOverlay.style.display = 'none'; 
            console.log(pauseOverlay.style.display);
        }
    }
}

// Automatically start the countdown when the page loads
startcountdown();
// Export variables for use in other files
export { leftnumbervalue, leftnumberelement };
