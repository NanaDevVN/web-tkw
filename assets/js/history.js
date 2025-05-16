import { getReadingHistory } from "./lib/historyManagement.js";
import { fetchDetailsData, fetchChaptersData, getComicName, getChapterTitle } from "./lib/comicData.js";

// Config
const CONFIG = {
    SELECTORS: {
        HISTORY_CONTAINER: 'history'
    },
    CLASSES: {
        HISTORY_ITEM: 'history-item',
        INFO: 'info'
    },
    STRINGS: {
        NO_HISTORY: "Chưa có lịch sử đọc.",
        ERROR_MESSAGE: "Có lỗi xảy ra khi tải lịch sử đọc.",
        CHAPTER_LABEL: "Chap:"
    }
};

/**
 * Formats a timestamp to the desired format (e.g., "9:53 19/4/2025")
 * @param {string} timeStamp - ISO timestamp string
 * @returns {string} - Formatted timestamp
 */
function formatTimeStamp(timeStamp) {
    return new Date(timeStamp).toLocaleString('vi-VN', {
        hour: 'numeric',
        minute: '2-digit',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour12: false
    }).replace(',', '');
}

/**
 * Creates a history item DOM element
 * @param {Object} entry - The history entry { comicID, chapterID, timeStamp }
 * @param {Object} detailsMap - Map of comicID to details data
 * @param {Object} chaptersMap - Map of comicID to chapters data
 * @returns {HTMLElement} - The history item element
 */
function createHistoryItem(entry, detailsMap, chaptersMap) {
    const { comicID, chapterID, timeStamp } = entry;

    const comicName = getComicName(detailsMap[comicID], comicID);
    const chapterTitle = getChapterTitle(chaptersMap[comicID], chapterID);
    const chapterNumber = parseInt(chapterID, 16);
    const formattedTime = formatTimeStamp(timeStamp);

    const item = document.createElement('div');
    item.className = CONFIG.CLASSES.HISTORY_ITEM;

    // Info section
    const infoDiv = document.createElement('div');
    infoDiv.className = CONFIG.CLASSES.INFO;
    const nameP = document.createElement('p');
    nameP.textContent = comicName;
    const chapterP = document.createElement('p');
    chapterP.textContent = `${CONFIG.STRINGS.CHAPTER_LABEL} ${chapterTitle} - ${chapterNumber}`;
    infoDiv.append(nameP, chapterP);

    // Timestamp section
    const timeDiv = document.createElement('div');
    const timeP = document.createElement('p');
    timeP.textContent = formattedTime;
    timeDiv.appendChild(timeP);

    // Assemble the item
    item.append(infoDiv, timeDiv);
    return item;
}

/**
 * Fetches comic details and chapters for all unique comic IDs in the history
 * @param {Array} history - The list of history entries
 * @returns {Promise<{detailsMap: Object, chaptersMap: Object}>} - Maps of comicID to details and chapters data
 */
async function fetchComicData(history) {
    const uniqueComicIDs = [...new Set(history.map(entry => entry.comicID))];
    const detailsPromises = uniqueComicIDs.map(fetchDetailsData);
    const chaptersPromises = uniqueComicIDs.map(fetchChaptersData);
    const [detailsResults, chaptersResults] = await Promise.all([
        Promise.all(detailsPromises),
        Promise.all(chaptersPromises)
    ]);
    const detailsMap = Object.fromEntries(uniqueComicIDs.map((id, index) => [id, detailsResults[index]]));
    const chaptersMap = Object.fromEntries(uniqueComicIDs.map((id, index) => [id, chaptersResults[index]]));
    return { detailsMap, chaptersMap };
}

/**
 * Initializes the history page
 */
async function initHistoryPage() {
    const historyContainer = document.getElementById(CONFIG.SELECTORS.HISTORY_CONTAINER);
    if (!historyContainer) {
        console.error("Lỗi: Không tìm thấy history-container trong trang");
        document.body.innerHTML = `<p>${CONFIG.STRINGS.ERROR_MESSAGE}</p>`;
        return;
    }

    try {
        const history = getReadingHistory();
        if (history.length === 0) {
            historyContainer.innerHTML = `<p>${CONFIG.STRINGS.NO_HISTORY}</p>`;
            return;
        }

        // Sort history by timestamp (newest first)
        history.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

        // Fetch comic data
        const { detailsMap, chaptersMap } = await fetchComicData(history);

        // Create and append history items
        const historyItems = history.map(entry =>
            createHistoryItem(entry, detailsMap, chaptersMap)
        );
        historyContainer.append(...historyItems);
    } catch (error) {
        console.error("Lỗi khi hiển thị lịch sử đọc:", error.message);
        historyContainer.innerHTML = `<p>${CONFIG.STRINGS.ERROR_MESSAGE}</p>`;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', initHistoryPage);