// Config
const CLASSES = {
    HIDDEN: 'hidden',
    HAS_LOGGED: 'has-logged'
};

const SELECTORS = {
    SEARCH_BOX: 'searchBox',
    USER_PROFILE: 'userProfile',
    USER_ACTION: '.user-action',
    LOGOUT_BUTTON: 'li[action-tag="logout"] a',
    LOGIN_BUTTON: 'li[action-tag="login"] a'
};

/**
 * Sets up the search box functionality to focus the input when clicking the container
 */
function setupSearchBox() {
    const searchBox = document.getElementById(SELECTORS.SEARCH_BOX);
    const searchInput = searchBox?.querySelector('input');

    if (!searchBox || !searchInput) {
        console.error("Lỗi: Không tìm thấy searchBox hoặc searchInput");
        return;
    }

    searchBox.addEventListener('click', (e) => {
        if (e.target !== searchInput) {
            searchInput.focus();
        }
    });
}

/**
 * Handles clicks outside the user profile to hide the user action dropdown
 * @param {Event} event - The click event
 * @param {HTMLElement} userProfile - The user profile element
 * @param {HTMLElement} userAction - The user action dropdown element
 */
function handleClickOutside(event, userProfile, userAction) {
    if (!userProfile.contains(event.target)) {
        userAction.classList.add(CLASSES.HIDDEN);
        document.removeEventListener('click', handleClickOutside);
    }
}

/**
 * Sets up the user profile dropdown functionality
 */
function setupUserProfile() {
    const userProfile = document.getElementById(SELECTORS.USER_PROFILE);
    const userAction = userProfile?.querySelector(SELECTORS.USER_ACTION);

    if (!userProfile || !userAction) {
        console.error("Lỗi: Không tìm thấy userProfile hoặc userAction");
        return;
    }

    userProfile.addEventListener('click', (e) => {
        const clickedElement = e.target;

        // Allow navigation for 'a' tags inside userAction
        if (userAction.contains(clickedElement) && clickedElement.tagName.toLowerCase() === 'a') {
            return;
        }

        e.preventDefault(); // Prevent default action for other clicks

        userAction.classList.toggle(CLASSES.HIDDEN);

        // Bind the outside click handler with the current userProfile and userAction
        const boundHandleClickOutside = (event) => handleClickOutside(event, userProfile, userAction);

        // Only add the outside click listener if the user-action is now visible
        if (!userAction.classList.contains(CLASSES.HIDDEN)) {
            document.removeEventListener('click', boundHandleClickOutside);
            document.addEventListener('click', boundHandleClickOutside);
        }
    });
}

/**
 * Sets up the login/logout simulation
 */
function setupAuthActions() {
    const userProfile = document.getElementById(SELECTORS.USER_PROFILE);
    const logoutButton = document.querySelector(SELECTORS.LOGOUT_BUTTON);
    const loginButton = document.querySelector(SELECTORS.LOGIN_BUTTON);

    if (!userProfile || !logoutButton || !loginButton) {
        console.error("Lỗi: Không tìm thấy userProfile, logoutButton hoặc loginButton");
        return;
    }

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        userProfile.classList.remove(CLASSES.HAS_LOGGED);
    });

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        userProfile.classList.add(CLASSES.HAS_LOGGED);
    });
}

/**
 * Initializes the navigation functionality
 */
function initNav() {
    try {
        setupSearchBox();
        setupUserProfile();
        setupAuthActions();
    } catch (error) {
        console.error("Lỗi khi khởi tạo navigation:", error.message);
    }
}

// Initialize the navigation
document.addEventListener('DOMContentLoaded', initNav);