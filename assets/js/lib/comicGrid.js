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
    <a href="detail.html?comicID=${comicID}">
        <div class="story" data-comic-code="${comicID}">
            ${rankLabel}
            <img src="data/comic/${comicID}/${coverImage}" alt="${title}" />
            <div class="info">
                <p class="title">${title}</p>
                <p class="author">${author}</p>
            </div>
            <div class="detail">
                ${descriptionHTML}
            </div>
        </div>
    </a>
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