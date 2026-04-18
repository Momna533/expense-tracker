describe("auth.js functions", () => {
  let toggleTheme;

  beforeEach(() => {
    document.body.innerHTML = `
     <button id="themeToggle"></button>
    `;
    themeToggle = document.getElementById("themeToggle");
    localStorage.clear();

    jest.resetModules();

    ({ toggleTheme } = require("./auth.js"));
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
