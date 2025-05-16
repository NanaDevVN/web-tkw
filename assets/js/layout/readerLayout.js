function appendReaderNav() {
    const HTML = `
    <div class="reader-nav">
        <a id="prev-chapter" href="#">← Chap Trước</a>
        <a id="comic-details" href="#">📚 Chi tiết truyện</a>
        <a id="next-chapter" href="#">Chap Sau →</a>
    </div>
  `;
    document.querySelector('.stick-on-top').insertAdjacentHTML('beforeend', HTML);
}

appendReaderNav();