import { isValidHex } from "./utils.js";

const FOLLOW_KEY = "followed-comic";
/**
 * Saves a comic to the followed list in localStorage
 * @param {string} comicID - The hex-based ID of the comic
 */
function saveToFollowedList(comicID) {
    try {
        // Validate input
        if (!comicID) {
            throw new Error("comicID is required");
        }
        if (!isValidHex(comicID)) {
            throw new Error("comicID phải là hex hợp lệ");
        }

        // Get the current followed list from localStorage (or initialize as empty array)
        let followed = [];
        const storedFollowed = localStorage.getItem(FOLLOW_KEY);
        if (storedFollowed) {
            followed = JSON.parse(storedFollowed);
            if (!Array.isArray(followed)) {
                throw new Error("Dữ liệu followed trong localStorage không hợp lệ");
            }
        }

        // Create a new entry with timestamp
        const newEntry = {
            comicID, // Hex-based string
            timeStamp: new Date().toISOString() // e.g., "2025-04-20T06:21:00.000Z"
        };

        // Remove any existing entry with the same comicID (deduplication)
        followed = followed.filter(entry => entry.comicID !== comicID);

        // Add the new entry to the end
        followed.push(newEntry);

        // Save the updated list back to localStorage
        localStorage.setItem(FOLLOW_KEY, JSON.stringify(followed));
    } catch (error) {
        console.error("Lỗi khi lưu danh sách theo dõi:", error.message);
    }
}

/**
 * Retrieves the followed comics list from localStorage
 * @returns {Array} - The array of followed comics
 */
function getFollowedList() {
    try {
        const followed = JSON.parse(localStorage.getItem(FOLLOW_KEY)) || [];
        if (!Array.isArray(followed)) {
            throw new Error("Dữ liệu followed trong localStorage không hợp lệ");
        }
        return followed;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách theo dõi:", error.message);
        return [];
    }
}

/**
 * Removes a comic from the followed list in localStorage
 * @param {string} comicID - The hex-based ID of the comic to remove
 */
function removeFromFollowedList(comicID) {
    try {
        // Validate input
        if (!comicID) {
            throw new Error("comicID is required");
        }
        if (!isValidHex(comicID)) {
            throw new Error("comicID phải là hex hợp lệ");
        }

        // Get the current followed list from localStorage
        let followed = [];
        const storedFollowed = localStorage.getItem(FOLLOW_KEY);
        if (storedFollowed) {
            followed = JSON.parse(storedFollowed);
            if (!Array.isArray(followed)) {
                throw new Error("Dữ liệu followed trong localStorage không hợp lệ");
            }
        }

        // Remove the entry with the matching comicID
        const initialLength = followed.length;
        followed = followed.filter(entry => entry.comicID !== comicID);

        // If no changes were made (comicID not found), no need to update localStorage
        if (followed.length === initialLength) {
            return; // Comic was not in the list, nothing to do
        }

        // Save the updated list back to localStorage
        localStorage.setItem(FOLLOW_KEY, JSON.stringify(followed));
    } catch (error) {
        console.error("Lỗi khi xóa khỏi danh sách theo dõi:", error.message);
    }
}

/**
 * Checks if a comic is in the followed list
 * @param {string} comicID - The hex-based ID of the comic to check
 * @returns {boolean} - True if the comic is followed, false otherwise
 */
function isComicFollowed(comicID) {
    try {
        // Validate input
        if (!comicID) {
            throw new Error("comicID is required");
        }
        if (!isValidHex(comicID)) {
            throw new Error("comicID phải là hex hợp lệ");
        }

        const followed = JSON.parse(localStorage.getItem(FOLLOW_KEY)) || [];
        if (!Array.isArray(followed)) {
            throw new Error("Dữ liệu followed trong localStorage không hợp lệ");
        }

        // Check if the comicID exists in the followed list
        return followed.some(entry => entry.comicID === comicID);
    } catch (error) {
        console.error("Lỗi khi kiểm tra danh sách theo dõi:", error.message);
        return false;
    }
}

export { saveToFollowedList, getFollowedList, removeFromFollowedList, isComicFollowed };