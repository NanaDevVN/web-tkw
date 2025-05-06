function countdown(seconds, callback) {
    if (seconds < 0 || !Number.isInteger(seconds)) {
        console.error("Please provide a non-negative integer for seconds");
        return;
    }

    const interval = setInterval(() => {
        if (seconds <= 0) {
            clearInterval(interval); // Stop the countdown
            callback(); // Execute the callback
        } else {
            console.log(seconds); // Log current seconds (optional)
            seconds--;
        }
    }, 1000); // Run every 1000ms (2 second)
}

async function getDataJSON(URL) {
    const response = await fetch(URL);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
}

/**
 * Validates if a string is a valid hex number (contains only 0-9, a-f, A-F)
 * @param {string} value - The string to validate
 * @returns {boolean} - True if valid hex, false otherwise
 */
function isValidHex(value) {
    return /^[0-9a-fA-F]+$/.test(value);
}

export { countdown, getDataJSON, isValidHex };