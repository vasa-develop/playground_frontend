// Initialize variables for eye tracking
let isCalibrated = false;
let scrollThreshold = 0.2; // Percentage of viewport height for scroll trigger
let scrollSpeed = 2; // Pixels to scroll per frame
let calibrationPointsCount = 0; // Track calibration points manually

// Initialize WebGazer
window.onload = async function() {
    try {
        await webgazer.setRegression('ridge')
            .setTracker('TFFacemesh')
            .begin();
        
        // Set up prediction listener
        webgazer.setGazeListener(function(data, elapsedTime) {
            if (data == null || !isCalibrated) {
                return;
            }
            var xprediction = data.x; //these x coordinates are relative to the viewport
            var yprediction = data.y; //these y coordinates are relative to the viewport
            
            // Get viewport dimensions
            var viewportHeight = window.innerHeight;
            
            // Define scroll zones (20% from top and bottom)
            var scrollZone = viewportHeight * 0.2;
            
            // Check if gaze is in top or bottom zones and scroll accordingly
            if (yprediction < scrollZone) {
                window.scrollBy(0, -10);
            } else if (yprediction > viewportHeight - scrollZone) {
                window.scrollBy(0, 10);
            }
        });

        // Handle calibration completion
        document.addEventListener('click', function(e) {
            if (!isCalibrated) {
                // Increment calibration points one at a time
                calibrationPointsCount = Math.min(calibrationPointsCount + 1, 5);
                console.log('Calibration points:', calibrationPointsCount);
                
                // Update status display
                const statusElement = document.getElementById('calibration-status');
                if (statusElement) {
                    statusElement.textContent = `Points collected: ${calibrationPointsCount}/5`;
                }
                
                // Check if we have enough points for calibration
                if (calibrationPointsCount >= 5) {
                    isCalibrated = true;
                    const overlay = document.getElementById('calibration-overlay');
                    if (overlay) {
                        overlay.style.display = 'none';
                        console.log('Calibration complete - hiding overlay');
                    } else {
                        console.error('Calibration overlay element not found');
                    }
                } else {
                    console.log('Need more calibration points');
                }
            }
        });

    } catch (err) {
        console.error('Error initializing WebGazer:', err);
        alert('Error initializing eye tracking. Please make sure your webcam is enabled and try again.');
    }
};

// Save calibration data before unloading
window.onbeforeunload = function() {
    webgazer.end();
};
