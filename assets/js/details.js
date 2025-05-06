import { getDataJSON } from "./utils.js";
import { saveToFollowedList, isComicFollowed, removeFromFollowedList } from "./followManagement.js";

// Config
const COMIC_DETAIL_ENDPOINT = 'data/comic/';
const STRINGS = {
    DESCRIPTION_LABEL: "Mô tả:",
    CHAPTER_LABEL: "Ch.",
    FOLLOW_BUTTON: "Theo dõi",
    UNFOLLOW_BUTTON: "Bỏ theo dõi",
    ERROR_MESSAGE: "Có lỗi xảy ra khi tải chi tiết truyện. Vui lòng thử lại sau.",
};

/**
 * Updates the follow button state based on whether the comic is followed
 * @param {string} comicID - The hex-based comic ID
 * @param {HTMLInputElement} followButton - The follow button DOM element
 */
function updateFollowButtonState(comicID, followButton) {
    const isFollowed = isComicFollowed(comicID);
    followButton.value = isFollowed ? STRINGS.UNFOLLOW_BUTTON : STRINGS.FOLLOW_BUTTON;
    followButton.classList.toggle('has-followed', isFollowed);
}

/**
 * Initializes the comic detail page
 */
async function initPage() {
    const comicCover = document.getElementById('comic-cover');
    const comicTitle = document.getElementById('comic-title');
    const comicAuthor = document.getElementById('comic-author');
    const comicTags = document.getElementById('comic-tags');
    const comicDescription = document.getElementById('comic-description');
    const comicChapters_DOM = document.getElementById('comic-chapters');
    const followButton = document.getElementById("followed-button");
    const main_DOM = document.querySelector('main');

    // Validate DOM elements
    if (!comicCover || !comicTitle || !comicAuthor || !comicTags || !comicDescription || !comicChapters_DOM || !followButton) {
        console.error("Lỗi: Một hoặc nhiều phần tử DOM không tồn tại");
        document.body.innerHTML = `<p>${STRINGS.ERROR_MESSAGE}</p>`;
        return;
    }

    try {
        // Get comicID from URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        const comicID = searchParams.get("comicID");
        if (!comicID) {
            throw new Error("Không có comicID trong URL");
        }

        // Fetch comic details and chapters
        const [comicDetails, comicChapters] = await Promise.all([
            getDataJSON(`${COMIC_DETAIL_ENDPOINT}${comicID}/details.json`),
            getDataJSON(`${COMIC_DETAIL_ENDPOINT}${comicID}/chapters.json`)
        ]);

        if (!comicDetails) {
            throw new Error("Không thể tải chi tiết truyện");
        }
        if (!comicChapters) {
            throw new Error("Không thể tải danh sách chương");
        }

        // Update page title
        document.title = comicDetails.comic.name;

        // Populate DOM elements
        comicCover.src = `${COMIC_DETAIL_ENDPOINT}${comicID}/${comicDetails.comic.cover}`;
        comicCover.alt = "comic cover";
        comicTitle.textContent = comicDetails.comic.name;
        comicAuthor.textContent = comicDetails.comic.author;

        // Populate tags
        const tagElements = comicDetails.comic.tags.map(tag => {
            const p = document.createElement("p");
            p.textContent = tag;
            return p;
        });
        comicTags.append(...tagElements);

        // Populate description
        comicDescription.innerHTML = `<strong>${STRINGS.DESCRIPTION_LABEL}</strong>`;
        const descElements = comicDetails.comic.description.map(item => {
            const p = document.createElement("p");
            p.textContent = item;
            return p;
        });
        comicDescription.append(...descElements);

        // Populate chapters
        const chapterElements = comicChapters.chapters.map(chapter => {
            const a = document.createElement("a");
            a.href = `read.html?comicID=${comicID}&chapterID=${chapter.id}`;
            const chapterNumber = parseInt(chapter.id, 16); // Parse hex-based chapter ID to decimal
            a.innerHTML = `<p>${STRINGS.CHAPTER_LABEL} ${chapterNumber}: ${chapter.title}</p>`;
            return a;
        });
        comicChapters_DOM.append(...chapterElements);

        // Set up follow button
        updateFollowButtonState(comicID, followButton);
        followButton.addEventListener('click', () => {
            const isFollowed = isComicFollowed(comicID);
            if (!isFollowed) {
                saveToFollowedList(comicID);
            } else {
                removeFromFollowedList(comicID);
            }
            updateFollowButtonState(comicID, followButton);
        });
    } catch (error) {
        console.error("Lỗi khi khởi tạo trang chi tiết truyện:", error.message);
        main_DOM.innerHTML = `<p>${STRINGS.ERROR_MESSAGE}</p>`;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', initPage);