// Local caches for details.json and chapters.json data, keyed by comicID
const detailsCache = {};
const chaptersCache = {};

/**
 * Fetches details.json data with caching
 * @param {string} comicID - Hex-based comic ID
 * @returns {Promise<Object|null>} - The details data or null if fetch fails
 */
async function fetchDetailsData(comicID) {
    if (detailsCache[comicID]) {
        return detailsCache[comicID];
    }

    try {
        const response = await fetch(`data/comic/${comicID}/details.json`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        detailsCache[comicID] = data;
        return data;
    } catch (error) {
        console.error(`Lỗi khi tải details.json cho comic ${comicID}: ${error.message}`);
        return null;
    }
}

/**
 * Fetches chapters.json data with caching
 * @param {string} comicID - Hex-based comic ID
 * @returns {Promise<Object|null>} - The chapters data or null if fetch fails
 */
async function fetchChaptersData(comicID) {
    if (chaptersCache[comicID]) {
        return chaptersCache[comicID];
    }

    try {
        const response = await fetch(`data/comic/${comicID}/chapters.json`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        chaptersCache[comicID] = data;
        return data;
    } catch (error) {
        console.error(`Lỗi khi tải chapters.json cho comic ${comicID}: ${error.message}`);
        return null;
    }
}

/**
 * Gets the comic name from details.json data
 * @param {Object} detailsData - The details.json data
 * @param {string} comicID - Hex-based comic ID
 * @returns {string} - The comic name or comic ID if not found
 */
function getComicName(detailsData, comicID) {
    return detailsData?.comic?.name ?? comicID;
}

/**
 * Gets the chapter title from chapters.json data
 * @param {Object} chaptersData - The chapters.json data
 * @param {string} chapterID - Hex-based chapter ID
 * @returns {string} - The chapter title or chapter ID if not found
 */
function getChapterTitle(chaptersData, chapterID) {
    if (!chaptersData || !Array.isArray(chaptersData.chapters)) {
        return chapterID;
    }
    const chapter = chaptersData.chapters.find(ch => ch['id'] === chapterID);
    return chapter ? (chapter.chapterTitle || chapter.title || chapterID) : chapterID;
}

export { fetchDetailsData, fetchChaptersData, getComicName, getChapterTitle };