// ===============================
// Toggle Password Visibility
// ===============================

document.querySelectorAll(".toggle-password").forEach((icon) => {

    icon.addEventListener("click", () => {

        const input = icon.previousElementSibling;

        if (input.type === "password") {

            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

});

// ===============================
// Register
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const email =
            registerForm.querySelector("input[type='email']").value.trim();

        const username =
            registerForm.querySelector("input[type='text']").value.trim();

        const password =
            document.getElementById("password").value;

        const confirm =
            document.getElementById("confirmPassword").value;

        if (password !== confirm) {

            alert("Passwords do not match.");
            return;

        }

        const user = {

            email,
            username,
            password

        };

        localStorage.setItem("clarityUser", JSON.stringify(user));

        alert("Registration Successful!");

        window.location.href = "index.html";

    });

}

// ===============================
// Login
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const user =
            JSON.parse(localStorage.getItem("clarityUser"));

        if (!user) {

            alert("No account found.");
            return;

        }

        if (
            email === user.email &&
            password === user.password
        ) {

            window.location.href = "dashboard.html";

        } else {

            alert("Incorrect Email or Password.");

        }

    });

}

// ===============================
// Guest Login
// ===============================

const guestButton = document.querySelector(".secondary-btn");

if (guestButton) {

    guestButton.addEventListener("click", () => {

        window.location.href = "dashboard.html";

    });

}