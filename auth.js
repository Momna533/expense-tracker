window.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    window.location.href = "index.html";
  }
  loadTheme();
});

//theme toggle and load
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", toggleTheme);

function toggleTheme() {
  if (document.body.classList.contains("dark_mode")) {
    document.body.classList.remove("dark_mode");
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.add("dark_mode");
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark_mode");
    themeToggle.textContent = "🌙";
  } else {
    document.body.classList.remove("dark_mode");
    themeToggle.textContent = "☀️";
  }
}

// //login and signup buttons
// const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
// //signup
function handleSignUp() {
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!username || !password || !confirmPassword) {
    showError("Please fill in all fields.");
    return;
  }

  if (username.length < 3) {
    showError("Username must be at least 3 characters long.");
    return;
  }
  if (password !== confirmPassword) {
    showError("Passwords do not match.");
    return;
  }

  if (password.length < 4) {
    showError("Password must be at least 4 characters long.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("expenseTrackerUsers")) || {};

  if (users[username]) {
    showError("Username already exists.");
    return;
  }

  users[username] = { password: password };

  localStorage.setItem("expenseTrackerUsers", JSON.stringify(users));
  showSuccess("Sign up successful! You can now log in.");

  setTimeout(() => {
    toggleForm();
    document.getElementById("loginUsername").value = username;
  }, 1500);
}

signupBtn.addEventListener("click", () => {
  handleSignUp();
});

// //login
// function handleLogin() {
//   const username = document.getElementById("loginUsername").value.trim();
//   const password = document.getElementById("loginPassword").value;

//   if (!username || !password) {
//     showError("Please fill in all fields.");
//     return;
//   }

//   const users = JSON.parse(localStorage.getItem("expenseTrackerUsers")) || {};

//   if (!users[username]) {
//     showError("User not found. Please sign up.");
//     return;
//   }
//   if (users[username].password !== password) {
//     showError("Incorrect password. Please try again.");
//     return;
//   }

//   localStorage.setItem("currentUser", username);
//   showSuccess("Login successful! Redirecting...");

//   setTimeout(() => {
//     window.location.href = "index.html";
//   }, 1000);
// }

// loginBtn.addEventListener("click", () => {
//   handleLogin();
// });

// //login form toggling
const toggleFormLink = document.querySelectorAll(".toggleForm");
function toggleForm() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const formTitle = document.getElementById("formTitle");

  document.getElementById("errorMsg").style.display = "none";
  document.getElementById("successMsg").style.display = "none";

  if (loginForm.style.display === "none") {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    formTitle.textContent = "Welcome Back!";
    clearInputs();
  } else {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    formTitle.textContent = "Create an account";
    clearInputs();
  }
}

toggleFormLink.forEach((link) => {
  link.addEventListener("click", toggleForm);
});

// //supporting funcs

function showMessage(elementId, message) {
  const msgElement = document.getElementById(elementId);
  msgElement.textContent = message;
  msgElement.style.display = "block";
  setTimeout(() => (msgElement.style.display = "none"), 3000);
}

function showError(message) {
  showMessage("errorMsg", message);
}
function showSuccess(message) {
  showMessage("successMsg", message);
}

function clearInputs() {
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
}

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const isLoginVisible =
      document.getElementById("loginForm").style.display !== "none";
    isLoginVisible ? handleLogin() : handleSignUp();
  }
});

// //inputs
// const loginPasswordInput = document.getElementById("loginPassword");
// const signupPasswordInput = document.getElementById("signupPassword");
// const confirmPasswordInput = document.getElementById("confirmPassword");
// //caps warning
// const signupCapsWarning = document.getElementById("signupCapsWarning");
// const loginCapsWarning = document.getElementById("loginCapsWarning");
// const confirmCapsWarning = document.getElementById("confirmCapsWarning");
// //password toggle buttons and icons
// const loginPasswordToggleBtn = document.getElementById("loginPasswordToggle");
// const loginPasswordIcon = loginPasswordToggleBtn.querySelector("svg");
// const signupPasswordToggleBtn = document.getElementById("signupPasswordToggle");
// const signupPasswordIcon = signupPasswordToggleBtn.querySelector("svg");
// const confirmPasswordToggleBtn = document.getElementById(
//   "confirmPasswordToggle",
// );
// const confirmPasswordIcon = confirmPasswordToggleBtn.querySelector("svg");
// function addCapsWarning(input, warningElement) {
//   input.addEventListener("keyup", (e) => {
//     warningElement.style.display =
//       e.getModifierState && e.getModifierState("CapsLock") ? "block" : "none";
//   });
// }

// addCapsWarning(loginPasswordInput, loginCapsWarning);
// addCapsWarning(signupPasswordInput, signupCapsWarning);
// addCapsWarning(confirmPasswordInput, confirmCapsWarning);

// function setupPasswordToggle(button, input, icon) {
//   button.addEventListener("click", () => {
//     input.type = input.type === "password" ? "text" : "password";
//     icon.innerHTML =
//       input.type === "password"
//         ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>'
//         : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
//   });
// }

// setupPasswordToggle(
//   loginPasswordToggleBtn,
//   loginPasswordInput,
//   loginPasswordIcon,
// );
// setupPasswordToggle(
//   signupPasswordToggleBtn,
//   signupPasswordInput,
//   signupPasswordIcon,
// );
// setupPasswordToggle(
//   confirmPasswordToggleBtn,
//   confirmPasswordInput,
//   confirmPasswordIcon,
// );

module.exports = {
  toggleTheme,
  loadTheme,
  handleSignUp,
  toggleForm,
  showError,
  showSuccess,
  // setupPasswordToggle,
  // handleLogin,
};
