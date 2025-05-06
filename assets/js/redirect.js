import { countdown } from './utils.js';
const actionCodeElement = document.getElementById('action-code');
console.log(location);
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
actionCodeElement.textContent = params.get('action');

countdown(3, () => {
    location.href = "index.html"
});