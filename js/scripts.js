document.addEventListener("DOMContentLoaded", function() {
  // Handle form submission for login
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
      alert("Login successful!");
      // Redirect to the homepage after login (optional)
      window.location.href = "index.html";
  });

  // Handle form submission for signup
  const signupForm = document.getElementById("signupForm");
  signupForm.addEventListener("submit", function(event) {
      event.preventDefault();
      alert("Account created successfully!");
      window.location.href = "login.html";  // Redirect to login page
  });

  // Handle form submission for contact
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", function(event) {
      event.preventDefault();
      alert("Message sent successfully!");
  });
});
