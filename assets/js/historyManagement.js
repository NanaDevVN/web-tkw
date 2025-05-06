import { isValidHex } from "./utils.js";

const HISTORY_KEY = "history";
const MAX_HISTORY_ITEMS = 20;

/**
 * Saves a reading history entry to localStorage
 * @param {string} comicID - The hex-based ID of the comic
 * @param {string} chapterID - The hex-based ID of the chapter
 * @param {string} [timeStamp] - Optional timestamp (ISO string); if not provided, current time is used
 */
function saveToHistory(comicID, chapterID) {
    try {
        // Validate inputs
        if (!comicID || !chapterID) {
            throw new Error('comicID hoặc chapterID không được rỗng');
        }
        if (!isValidHex(comicID) || !isValidHex(chapterID)) {
            throw new Error('comicID hoặc chapterID không phải là hex hợp lệ');
        }

        // Get the current history from localStorage (or initialize as empty array)
        let history = [];
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        if (storedHistory) {
            history = JSON.parse(storedHistory);
            if (!Array.isArray(history)) {
                throw new Error('Dữ liệu lịch sử trong localStorage không hợp lệ');
            }
        }

        // Create a new history entry
        const newEntry = {
            comicID, // Hex-based string
            chapterID, // Hex-based string
            timeStamp: new Date().toISOString() // Use provided timestamp or current time
        };

        // Remove any existing entry with the same comicID and chapterID (deduplication)
        history = history.filter(
            entry => !(entry.comicID === comicID && entry.chapterID === chapterID)
        );

        // Add the new entry to the end
        history.push(newEntry);

        // If history exceeds the max limit, remove the oldest entry (first item)
        if (history.length > MAX_HISTORY_ITEMS) {
            history.shift();
        }

        // Save the updated history back to localStorage
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Lỗi khi lưu lịch sử đọc:', error.message);
    }
}

/**
 * Retrieves the reading history from localStorage
 * @returns {Array} - The array of history entries
 */
function getReadingHistory() {
    try {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        if (!Array.isArray(history)) {
            throw new Error('Dữ liệu lịch sử trong localStorage không hợp lệ');
        }
        return history;
    } catch (error) {
        console.error('Lỗi khi lấy lịch sử đọc:', error.message);
        return [];
    }
}

export { saveToHistory, getReadingHistory }