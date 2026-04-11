const themeToggle = document.getElementById("themeToggle");
const loginPasswordInput = document.getElementById("loginPassword");
const signupPasswordInput = document.getElementById("signupPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const loginPasswordToggleBtn = document.getElementById("loginPasswordToggle");
const signupPasswordToggleBtn = document.getElementById("signupPasswordToggle");
const confirmPasswordToggleBtn = document.getElementById(
  "confirmPasswordToggle",
);
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const toggleFormLink = document.querySelectorAll(".toggleForm");
console.log(toggleFormLink);

themeToggle.addEventListener("click", () => {
  console.log("theme toggled");
});

loginPasswordInput.addEventListener("keyup", () => {
  console.log("checking for caps lock login");
});
signupPasswordInput.addEventListener("keyup", () => {
  console.log("checking for caps lock signup");
});

confirmPasswordInput.addEventListener("keyup", () => {
  console.log("checking for caps lock confirm");
});
loginPasswordToggleBtn.addEventListener("mousedown", () => {
  console.log("show login password");
});

loginPasswordToggleBtn.addEventListener("mouseup", () => {
  console.log("hide login password");
});

loginPasswordToggleBtn.addEventListener("mouseleave", () => {
  console.log("hide login password");
});
signupPasswordToggleBtn.addEventListener("mousedown", () => {
  console.log("show signup password");
});

signupPasswordToggleBtn.addEventListener("mouseup", () => {
  console.log("hide signup password");
});

signupPasswordToggleBtn.addEventListener("mouseleave", () => {
  console.log("hide signup password");
});

confirmPasswordToggleBtn.addEventListener("mousedown", () => {
  console.log("show confirm password");
});

confirmPasswordToggleBtn.addEventListener("mouseup", () => {
  console.log("hide confirm password");
});

confirmPasswordToggleBtn.addEventListener("mouseleave", () => {
  console.log("hide confirm password");
});

loginBtn.addEventListener("click", () => {
  console.log("login button clicked");
});

signupBtn.addEventListener("click", () => {
  console.log("signup button clicked");
});

toggleFormLink.forEach((link) => {
  link.addEventListener("click", () => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const formTitle = document.getElementById("formTitle");

    if (loginForm.style.display === "none") {
      loginForm.style.display = "block";
      signupForm.style.display = "none";
      formTitle.textContent = "Welcome Back!";
    } else {
      loginForm.style.display = "none";
      signupForm.style.display = "block";
      formTitle.textContent = "Create an account";
    }
  });
});
