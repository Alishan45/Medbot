document.addEventListener("DOMContentLoaded", () => {
  // Login Form Validation
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const loginError = document.getElementById("loginError");

      // Clear previous error
      loginError.textContent = "";

      if (!email || !validateEmail(email)) {
        loginError.textContent = "Please enter a valid email.";
        return;
      }

      if (!password) {
        loginError.textContent = "Please enter your password.";
        return;
      }

      if (!passwordValidate(password)) {
        loginError.textContent = "Password must contain at least one letter, one digit, one special character, and must be at least 8 characters long.";
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
          alert("Login successful. Redirecting...");
          window.location.href = data.redirect_url;
        } else {
          loginError.textContent = data.error || "An error occurred. Please try again.";
        }
      } catch (error) {
        loginError.textContent = "Could not connect to the server. Please try again later.";
      }
    });
  }

  // Sign Up Form Validation
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document
        .getElementById("confirmPassword")
        .value.trim();
      const signupError = document.getElementById("signupError");

      // Clear previous error
      signupError.textContent = "";

      if (!name) {
        signupError.textContent = "Please enter your full name.";
        return;
      }

      if (!email || !validateEmail(email)) {
        signupError.textContent = "Please enter a valid email.";
        return;
      }

      if (!password || password.length < 8) {
        signupError.textContent = "Password must be at least 8 characters.";
        return;
      }

      if (!passwordValidate(password)) {
        signupError.textContent = "Password must contain at least one letter, one digit, one special character, and must be at least 8 characters long.";
        return;
      }

      if (password !== confirmPassword) {
        signupError.textContent = "Passwords do not match.";
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          signupError.textContent = data.error || "An error occurred.";
        } else {
          alert("Account created successfully. Please log in.");
          window.location.href = "login.html";
        }
      } catch (error) {
        signupError.textContent =
          "Could not connect to the server. Please try again later.";
      }
    });
  }

  // Forget Password Validation
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value.trim();
      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmNewPassword = document
        .getElementById("confirmNewPassword")
        .value.trim();
      const forgotPasswordError = document.getElementById(
        "forgotPasswordError"
      );

      // Clear previous error
      forgotPasswordError.textContent = "";

      if (!email || !validateEmail(email)) {
        forgotPasswordError.textContent = "Please enter a valid email.";
        return;
      }

      if (newPassword.length < 8) {
        forgotPasswordError.textContent =
          "Password must be at least 8 characters.";
        return;
      }

      if (!passwordValidate(newPassword)) {
        forgotPasswordError.textContent = "Password must contain at least one letter, one digit, one special character, and must be at least 8 characters long.";
        return;
      }

      if (newPassword !== confirmNewPassword) {
        forgotPasswordError.textContent = "Passwords do not match.";
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, new_password: newPassword }),
        });

        const data = await response.json();
        if (response.ok) {
          alert("Password reset successfully. Please log in.");
          window.location.href = "login.html";
        } else {
          forgotPasswordError.textContent = data.error || "An error occurred.";
        }
      } catch (error) {
        forgotPasswordError.textContent =
          "Could not connect to the server. Please try again later.";
      }
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function passwordValidate(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    return hasLetter && hasDigit && hasSpecialChar && hasMinLength;
  }
});
