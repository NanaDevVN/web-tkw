function prependStickyHeaderToBody() {
    const stickyHeaderHTML = `
    <div class="stick-on-top">
        <header>
            <div class="logo">
                <a href="index.html">
                    <img src="assets/logo.png" alt="Web Truyện Logo" />
                </a>
            </div>
            <div class="search-box" id="searchBox">
                <form action="">
                    <input type="text" placeholder="Nhập tên truyện muốn tìm" name="q"/>
                </form>
                <img src="assets/icon/search.svg" alt="Tìm kiếm" />
            </div>
            <div class="user-profile has-logged" id="userProfile">
                <div class="user-avatar">
                    <img src="user/test/user-test-profile.gif" alt="User Avatar" />
                </div>
                <div class="user-action hidden">
                    <ul>
                        <li action-tag="user-name">Xin chào <a href="#">test</a></li>
                        <hr />
                        <li action-tag="logout"><a href="#">Đăng Xuất</a></li>
                        <li action-tag="register"><a href="register.html">Đăng Ký</a></li>
                        <li action-tag="login"><a href="login.html">Đăng Nhập</a></li>
                    </ul>
                </div>
            </div>
        </header>
        <nav>
            <a href="watchlist.html">Theo Dõi</a>
            <a href="history.html">Lịch Sử</a>
        </nav>
    </div>
  `;

    document.body.insertAdjacentHTML('afterbegin', stickyHeaderHTML);
}

function appendFooterToBody() {
    const footerHTML = `
    <footer>
        <div class="footer-left">
            <img src="assets/logo.png" alt="Footer Logo">
        </div>
        <div class="footer-right">
            <p class="copyright">This website utilizes data provided by MangaDex. We assert no ownership over any of the data, which is being used to demonstrate website development for a specific subject.</p>
            <br>
            <div class="tech-icons">
                <span>Built with:</span>
                <a href="#"><img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/html-light.png" alt="HTML5"></a>
                <a href="#"><img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/css-light.png" alt="CSS3"></a>
                <a href="#"><img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/javascript.png" alt="JavaScript"></a>
                <a href="#"><img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/git.png" alt="Git"></a>
                <a href="#"><img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/github-light.png" alt="Github"></a>
            </div>
            <p class="copyright">&copy; 2025 - WebTruyen</p>
        </div>
    </footer>
  `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

prependStickyHeaderToBody();
appendFooterToBody();