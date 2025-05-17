import { getFollowedList, removeFromFollowedList } from "./lib/followManagement.js";
import { fetchDetailsData, getComicName } from "./lib/comicData.js";

// Config
const CONFIG = {
    COMIC_ENDPOINT: 'data/comic/',
    SELECTORS: {
        WATCHLIST_CONTAINER: 'watchlist',
        UNFOLLOW_BUTTON: 'unfollow-button'
    },
    CLASSES: {
        WATCHLIST_ITEM: 'watchlist-item',
        COVER: 'cover',
        INFO: 'info',
        TITLE: 'title',
        DESC: 'desc'
    },
    STRINGS: {
        NO_WATCHLIST: "Chưa có truyện nào trong danh sách theo dõi.",
        ERROR_MESSAGE: "Có lỗi xảy ra khi tải danh sách theo dõi.",
        UNFOLLOW_BUTTON: "Bỏ theo dõi",
        COVER_ALT: "Comic cover"
    }
};

/**
 * Creates a watchlist item DOM element
 * @param {Object} entry - The watchlist entry { comicID, timeStamp }
 * @param {Object} detailsMap - Map of comicID to details data
 * @param {HTMLElement} watchlistContainer - The watchlist container element
 * @returns {HTMLElement} - The watchlist item element
 */
function createWatchlistItem(entry, detailsMap, watchlistContainer) {
    const { comicID } = entry;
    const comicName = getComicName(detailsMap[comicID], comicID);
    const cover = detailsMap[comicID]?.comic?.cover || '';
    const description = detailsMap[comicID]?.comic?.description || [];

    const item = document.createElement('div');
    item.className = CONFIG.CLASSES.WATCHLIST_ITEM;

    // Cover image
    const coverDiv = document.createElement('div');
    coverDiv.className = CONFIG.CLASSES.COVER;
    const coverImg = document.createElement('img');
    coverImg.src = cover ? `${CONFIG.COMIC_ENDPOINT}${comicID}/${cover}` : '';
    coverImg.alt = CONFIG.STRINGS.COVER_ALT;
    coverDiv.appendChild(coverImg);

    // Info section (title and description)
    const infoDiv = document.createElement('div');
    infoDiv.className = CONFIG.CLASSES.INFO;

    const titleDiv = document.createElement('div');
    titleDiv.className = CONFIG.CLASSES.TITLE;
    const titleA = document.createElement('a');
    titleA.textContent = comicName;
    titleA.href = `detail.html?comicID=${comicID}`
    titleDiv.appendChild(titleA);

    const descDiv = document.createElement('div');
    descDiv.className = CONFIG.CLASSES.DESC;
    const descParagraphs = description.map(item => {
        const p = document.createElement('p');
        p.textContent = item;
        return p;
    });
    descDiv.append(...descParagraphs);

    infoDiv.appendChild(titleDiv);
    infoDiv.appendChild(descDiv);

    // Unfollow button
    const buttonDiv = document.createElement('div');
    const unfollowButton = document.createElement('button');
    unfollowButton.className = CONFIG.SELECTORS.UNFOLLOW_BUTTON;
    unfollowButton.textContent = CONFIG.STRINGS.UNFOLLOW_BUTTON;
    unfollowButton.addEventListener('click', () => {
        removeFromFollowedList(comicID);
        item.remove();
        if (!watchlistContainer.hasChildNodes()) {
            watchlistContainer.innerHTML = `<p>${CONFIG.STRINGS.NO_WATCHLIST}</p>`;
        }
    });
    buttonDiv.appendChild(unfollowButton);

    // Assemble the item
    item.append(coverDiv, infoDiv, buttonDiv);
    return item;
}

/**
 * Fetches comic details for all unique comic IDs in the watchlist
 * @param {Array} watchlist - The list of followed comics
 * @returns {Promise<Object>} - A map of comicID to details data
 */
async function fetchComicDetails(watchlist) {
    const uniqueComicIDs = [...new Set(watchlist.map(entry => entry.comicID))];
    const detailsPromises = uniqueComicIDs.map(fetchDetailsData);
    const detailsResults = await Promise.all(detailsPromises);
    return Object.fromEntries(uniqueComicIDs.map((id, index) => [id, detailsResults[index]]));
}

/**
 * Initializes the watchlist page
 */
async function initWatchlistPage() {
    const watchlistContainer = document.getElementById(CONFIG.SELECTORS.WATCHLIST_CONTAINER);
    if (!watchlistContainer) {
        console.error("Lỗi: Không tìm thấy watchlist-container trong trang");
        document.body.innerHTML = `<p>${CONFIG.STRINGS.ERROR_MESSAGE}</p>`;
        return;
    }

    try {
        const watchlist = getFollowedList();
        if (watchlist.length === 0) {
            watchlistContainer.innerHTML = `<p>${CONFIG.STRINGS.NO_WATCHLIST}</p>`;
            return;
        }

        // Sort watchlist by timestamp (newest first)
        watchlist.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

        // Fetch comic details
        const detailsMap = await fetchComicDetails(watchlist);

        // Create and append watchlist items
        const watchlistItems = watchlist.map(entry =>
            createWatchlistItem(entry, detailsMap, watchlistContainer)
        );
        watchlistContainer.append(...watchlistItems);
    } catch (error) {
        console.error("Lỗi khi hiển thị danh sách theo dõi:", error.message);
        watchlistContainer.innerHTML = `<p>${CONFIG.STRINGS.ERROR_MESSAGE}</p>`;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', initWatchlistPage);