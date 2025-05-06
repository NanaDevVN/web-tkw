import {countdown, getDataJSON} from "./utils.js";
import {initProgressCircle} from './progressCircle.js'
import { saveToHistory} from "./historyManagement.js";

async function buildChapter() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const comicID = urlParams.get('comicID');
        const chapterID = urlParams.get('chapterID');
        if (!comicID || !chapterID) {
            throw new Error('Thiếu comic-code hoặc chapter-code trong URL');
        }

        const response = await fetch(`data/comic/${comicID}/chapters/${chapterID}/chapter.json`);
        if (!response.ok) {
            throw new Error(`Không thể tải dữ liệu chương: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        const CHAPTER_CONTAINER = document.getElementById('comic-chap-image');
        if (!CHAPTER_CONTAINER) {
            throw new Error('Không tìm thấy phần tử chứa chương');
        }

        CHAPTER_CONTAINER.innerHTML = '';

        if (!data.images || !Array.isArray(data.images)) {
            throw new Error('Danh sách ảnh không hợp lệ hoặc thiếu');
        }
        data.images.forEach((imagePath, index) => {
            const img = document.createElement('img');
            img.src = `data/comic/${comicID}/chapters/${chapterID}/${imagePath}`;
            img.alt = `Trang ${index + 1} của chương ${chapterID}`;
            img.loading = 'lazy';
            CHAPTER_CONTAINER.appendChild(img);
        });
        saveToHistory(comicID, chapterID)
    } catch (error) {
        console.error('Lỗi trong buildChapter:', error.message);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = 'Không thể tải chương. Vui lòng thử lại sau.';
        document.getElementById('comic-chap-image')?.appendChild(errorDiv);
    }
}

async function safeGetJSONData(url) {
    try {
        return await getDataJSON(url); // Return the data if it exists
    } catch (error) {
        // If the error is due to a 404, return null instead of throwing
        if (error.message.includes('404')) {
            return null;
        }
        // For other errors, rethrow to be caught by the main try/catch
        throw error;
    }
}

async function setNavLinks() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const comicID = urlParams.get('comicID');
        const chapterID = urlParams.get('chapterID');
        if (!comicID || !chapterID) {
            throw new Error('Thiếu comicID hoặc chapterID trong URL');
        }

        // Parse the hex chapterID to an integer
        const chapterNum = parseInt(chapterID, 16);
        if (isNaN(chapterNum)) {
            throw new Error('chapterID không hợp lệ, không thể parse hex');
        }

        // Get nav links
        const prevLink = document.getElementById('prev-chapter');
        const nextLink = document.getElementById('next-chapter');
        const detailsLink = document.getElementById('comic-details');

        // Set details link
        detailsLink.href = `detail.html?comicID=${comicID}`;

        // Calculate previous chapter code
        const prevChapNum = chapterNum - 1;
        const prevChapCode = prevChapNum.toString(16);
        if (prevChapNum >= 0) {
            const prevChapterData = await safeGetJSONData(`data/comic/${comicID}/chapters/${prevChapCode}/chapter.json`);
            if (prevChapterData) {
                prevLink.href = `read.html?comicID=${comicID}&chapterID=${prevChapCode}`;
            } else {
                prevLink.classList.add('disabled');
            }
        } else {
            prevLink.classList.add('disabled');
        }

        // Calculate next chapter code
        const nextChapNum = chapterNum + 1;
        const nextChapCode = nextChapNum.toString(16);
        const nextChapterData = await safeGetJSONData(`data/comic/${comicID}/chapters/${nextChapCode}/chapter.json`);
        if (nextChapterData) {
            nextLink.href = `read.html?comicID=${comicID}&chapterID=${nextChapCode}`;
        } else {
            nextLink.classList.add('disabled');
        }
    } catch (error) {
        console.error('Lỗi trong setNavLinks:', error.message);
        const prevLink = document.getElementById('prev-chapter');
        const nextLink = document.getElementById('next-chapter');
        prevLink.classList.add('disabled');
        nextLink.classList.add('disabled');
    }
}

// Initialize
buildChapter().then(r => {});
setNavLinks().then(r => {})
countdown(1, initProgressCircle)