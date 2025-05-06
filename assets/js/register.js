document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form form');
    const submitButton = registerForm.querySelector('input[type="submit"]');
    const emailInput = registerForm.querySelector('input[name="email"]');
    const usernameInput = registerForm.querySelector('input[name="username"]');
    const passwordInput = registerForm.querySelector('input[name="password"]');
    const confirmPasswordInput = registerForm.querySelector('input[name="confirm_password"]');
    const toLoginButton = document.getElementById("toLoginButon");
    const exitButton = document.getElementById("formExitButton");

    exitButton.addEventListener("click", (e) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        const pathParts = url.pathname.split("/").filter(Boolean); // Remove empty segments
        pathParts[pathParts.length - 1] = "index.html"; // Replace last segment
        url.pathname = `/${pathParts.join("/")}`; // Reconstruct pathname
        window.location.href = url.toString(); // Redirect
    });

    toLoginButton.addEventListener("click", (e) => {
        e.preventDefault();
        location.href = "login.html"
    })

    // Initialize the users object (in a real scenario, this might come from a server or local storage)
    const users = JSON.parse(localStorage.getItem('users')) || {};

    submitButton.addEventListener('click', (e) => {
        function areAllRequiredFilled(formElement) {
            const requiredInputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
            for (const input of requiredInputs) {
                if (input.value.trim() === '') {
                    return false;
                }
            }
            return true;
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        if (!areAllRequiredFilled(registerForm)) {
            e.preventDefault();
            alert("Vui lòng điền đầy đủ tất cả các trường bắt buộc.");
        } else if (emailInput && !isValidEmail(emailInput.value.trim())) {
            e.preventDefault();
            alert("Vui lòng nhập địa chỉ email hợp lệ.");
        } else if (passwordInput && confirmPasswordInput && passwordInput.value !== confirmPasswordInput.value) {
            e.preventDefault();
            alert("Mật khẩu và mật khẩu xác nhận không khớp.");
        } else if (users[`${usernameInput.value}+${escape(confirmPasswordInput.value)}`]) {
            e.preventDefault();
            alert("Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.");
        } else {
            // Create the key with username and escaped password
            const userKey = `${usernameInput.value}+${escape(confirmPasswordInput.value)}`;

            // Add the new user to the users object
            users[userKey] = {
                email: emailInput.value,
                // In a real scenario, you would hash the password before saving
                password: confirmPasswordInput.value
            };

            // Save the updated users object to local storage
            localStorage.setItem('users', JSON.stringify(users));

            alert("Đăng ký thành công. Tài khoản đã được lưu.");
            // In a real application, you would redirect to a login page.
        }
    });
});