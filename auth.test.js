describe("auth.js functions", () => {
  let toggleTheme, showError, showSuccess;

  beforeEach(() => {
    document.body.innerHTML = `
    <button id="themeToggle"></button>

    <button id="signupBtn"></button>

    <input id="signupUsername" />
    <input id="signupPassword" />
    <input id="confirmPassword" />

    <span id="errorMsg" style="display:none"></span>
    <span id="successMsg" style="display:none"></span>

    <a class="toggleForm"></a>
    <div id="loginForm" style="display:block"></div>
    <div id="signupForm" style="display:none"></div>
    <h2 id="formTitle"></h2>
    
    <input id="loginUsername" />
    `;

    themeToggle = document.getElementById("themeToggle");
    signupBtn = document.getElementById("signupBtn");
    username = document.getElementById("signupUsername");
    password = document.getElementById("signupPassword");
    confirmPassword = document.getElementById("confirmPassword");
    errorMsg = document.getElementById("errorMsg");
    successMsg = document.getElementById("successMsg");
    toggleForm = document.querySelectorAll(".toggleForm");
    loginForm = document.getElementById("loginForm");
    signupForm = document.getElementById("signupForm");
    formTitle = document.getElementById("formTitle");
    loginUsername = document.getElementById("loginUsername");

    localStorage.clear();

    jest.resetModules();

    ({
      toggleTheme,
      handleSignUp,
      toggleForm,
      showError,
      showSuccess,
    } = require("./auth.js"));
  });

  test("adds dark_mode and sets 🌙 when toggled from light", () => {
    toggleTheme();
    expect(document.body.classList.contains("dark_mode")).toBe(true);
    expect(themeToggle.textContent).toBe("🌙");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  test("removes dark_mode and sets ☀️ when toggled from dark", () => {
    document.body.classList.add("dark_mode");
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");

    toggleTheme();
    expect(document.body.classList.contains("dark_mode")).toBe(false);
    expect(themeToggle.textContent).toBe("☀️");
    expect(localStorage.getItem("theme")).toBe("light");
  });
});

test("shows error when signup fields are empty", () => {
  username.value = "";
  password.value = "";
  confirmPassword.value = "";

  handleSignUp();
  expect(errorMsg.textContent).toBe("Please fill in all fields.");
});

test("shows error when username is too short", () => {
  username.value = "ab";
  password.value = "1234";
  confirmPassword.value = "1234";

  handleSignUp();
  expect(errorMsg.textContent).toBe(
    "Username must be at least 3 characters long.",
  );
});
test("shows error when passwords do not match", () => {
  username.value = "abcd";
  password.value = "1234";
  confirmPassword.value = "5678";

  handleSignUp();
  expect(errorMsg.textContent).toBe("Passwords do not match.");
});
test("shows error when password too short", () => {
  username.value = "user";
  password.value = "123";
  confirmPassword.value = "123";

  handleSignUp();
  expect(errorMsg.textContent).toBe(
    "Password must be at least 4 characters long.",
  );
});

test("successful signup stores user and shows success", () => {
  jest.useFakeTimers();

  username.value = "newuser";
  password.value = "1234";
  confirmPassword.value = "1234";

  handleSignUp();

  expect(successMsg.textContent).toBe(
    "Sign up successful! You can now log in.",
  );

  const users = JSON.parse(localStorage.getItem("expenseTrackerUsers"));
  expect(users["newuser"].password).toBe("1234");

  jest.advanceTimersByTime(1500);
  expect(loginUsername.value).toBe("newuser");
});
test("shows error if username already exists", () => {
  localStorage.setItem(
    "expenseTrackerUsers",
    JSON.stringify({ user1: { password: "1234" } }),
  );
  username.value = "user1";
  password.value = "1234";
  confirmPassword.value = "1234";

  handleSignUp();
  expect(errorMsg.textContent).toBe("Username already exists.");
});
test("toggleForm switches between login and signup", () => {
  expect(loginForm.style.display).toBe("none");
  expect(signupForm.style.display).toBe("block");
  expect(formTitle.textContent).toBe("Create an account");

  toggleForm();
  expect(loginForm.style.display).toBe("block");
  expect(signupForm.style.display).toBe("none");
  expect(formTitle.textContent).toBe("Welcome Back!");
});
