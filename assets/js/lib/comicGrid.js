import { getDataJSON } from "./utils.js";

function generateStoryHTML(comicData, index) {
    const comicID = comicData.comicID;
    const coverImage = comicData.cover;
    const title = comicData.name;
    const author = comicData.author;
    const descriptionArray = comicData.description; // Description is an array of sentences
    const rankLabel = index !== undefined ? `<span class="label">Top ${index + 1}</span>` : '';

    // Generate <p> tags for each item in the description array
    const descriptionHTML = descriptionArray.map(sentence => `<p>${sentence}</p>`).join('');

    return `
    <div class="story" data-comic-code="${comicID}">
        ${rankLabel}
        <img src="data/comic/${comicID}/${coverImage}" alt="${title}" />
        <div class="info">
            <p class="title">${title}</p>
            <p class="author">${author}</p>
        </div>
        <div class="detail">
            ${descriptionHTML}
            <div>
                <button onclick="window.open('read.html?comicID=${comicID}&chapterID=1', '_blank')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book" viewBox="0 0 16 16">
                        <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                    </svg>
                    <span>Đọc</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-right-circle" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.854 10.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707z"/>
                    </svg>
                </button>
                <button onclick="window.location.href = 'detail.html?comicID=${comicID}'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
  `;
}

function buildComicGrid(data) {
    let html = `
        <div class="section-title mask-icon ${data.type}-icon">
            <p>${data.type}</p>
        </div>
        <div class="story-grid">
            ${data.data.map((e) => { return generateStoryHTML(e) }).join('')}
        </div>
    `;
    document.querySelector('main').insertAdjacentHTML('beforeend', html);
}

async function initPage() {
    const data1 = await getDataJSON('test-data/hot.json');
    const data2 = await getDataJSON('test-data/recommend.json');
    buildComicGrid(data1)
    buildComicGrid(data2)
}

initPage().catch((error) => {});