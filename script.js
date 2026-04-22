//analytics tab
// budget tabs
//summary tab
let expenses = [];
let maxFilterAmount = 0;
let enteredBudget = 0;

//on dom content load
//set max date on the expenses date div to today
//load theme
//load expenses to show expenses in all tabs
//load the expenses in transactions
//load the expenses in transactions filters
//load the expenses in budget
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("expenseDate").setAttribute("max", today);
  loadTheme();
  loadExpenses();
  updateTransactions();
  // updateFilters();
  // updateBudget();
});

const currentUser = localStorage.getItem("currentUser");
//logout

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", handleLogout);
function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("currentUser");
    window.location.href = "loginPage.html";
  }
}

//theme

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

//tabs

function showTab(tabName) {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".content");

  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.id === `${tabName}Tab`);
  });
  contents.forEach((content) => {
    content.classList.toggle("active", content.id === tabName);
  });

  if (tabName === "analytics") {
    console.log("Analytics data loaded");
  } else if (tabName === "summary") {
    console.log("Summary data loaded");
  }
}

//expenses tab

//the date div showing date format

function formatDateToDisplay(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}
const expenseDateInput = document.getElementById("expenseDate");
expenseDateInput.addEventListener("change", handleDateChange);
function handleDateChange(e) {
  const dateDisplayDiv = document.getElementById("dateDisplay");
  if (e.target.value) {
    dateDisplayDiv.textContent = `Selected Date: ${formatDateToDisplay(e.target.value)}`;
  } else {
    dateDisplayDiv.textContent = "";
  }
}

// clear expenses form
function clearExpenseForm() {
  document.getElementById("expenseName").value = "";
  document.getElementById("expenseCategory").value = "";
  document.getElementById("expenseAmount").value = "";
  document.getElementById("expenseDate").value = "";
  document.getElementById("expenseDescription").value = "";
  document.getElementById("dateDisplay").textContent = "";
}

//add expense
//save expenses to local storage
//clear expenses form
//add expenses to transactions and update transactions filters depending on the expenses
//add expenses to budget and update budget accordingly

const addExpenseBtn = document.getElementById("addExpenseBtn");
addExpenseBtn.addEventListener("click", handleAddExpense);
function handleAddExpense() {
  const nameInput = document.getElementById("expenseName").value;
  const categoryInput = document.getElementById("expenseCategory").value;
  const amountInput = parseFloat(
    document.getElementById("expenseAmount").value,
  );
  const dateInput = document.getElementById("expenseDate").value;
  const descriptionInput = document.getElementById("expenseDescription").value;

  if (!nameInput || !amountInput || !dateInput) {
    alert("Please fill in all required fields (Name, Amount, Date).");
    return;
  }
  const expense = {
    id: Date.now(),
    name: nameInput,
    category: categoryInput,
    amount: amountInput,
    date: dateInput,
    displayDate: formatDateToDisplay(dateInput),
    description: descriptionInput,
  };

  expenses.push(expense);
  saveExpenses();
  clearExpenseForm();

  updateTransactions();
  updateFilters();
  updateBudget();

  alert("Expense added successfully!");
}

//save expenses to local storage
function saveExpenses() {
  if (currentUser) {
    localStorage.setItem("expenses_" + currentUser, JSON.stringify(expenses));
  }
}

//load expenses from local storage
function loadExpenses() {
  if (currentUser) {
    const savedExpenses = localStorage.getItem("expenses_" + currentUser);
    if (savedExpenses) {
      expenses = JSON.parse(savedExpenses);
    }
  }
}

//transactions tab

//show total expenses in transactions tab
//show expenses by each expense in details

const categoryColors = {
  Food: "#FF6384",
  Transport: "#36A2EB",
  Shopping: "#FFCE56",
  Bills: "#4BC0C0",
  Entertainment: "#9966FF",
  Health: "#FF9F40",
  Education: "#FF6384",
  Other: "#C9CBCF",
};

const categoryIcons = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "💡",
  Entertainment: "🎮",
  Health: "🏥",
  Education: "📚",
  Other: "📦",
};
function updateTransactions() {
  const expensesList = document.getElementById("transactionList");
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  document.getElementById("totalExpense").textContent =
    Math.round(totalExpenses * 100) / 100;

  if (expenses.length === 0) {
    expensesList.innerHTML =
      '<p style="text-align: center; color: #666; padding: 40px;">No transactions yet. Add your first expense!</p>';
    return;
  }

  const sortedExpenses = [...expenses].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  expensesList.innerHTML = sortedExpenses
    .map((expense) => {
      return `
  <div class="transaction_item">
    <div class="transaction_info">
      <h3>${expense.name}</h3>
      <span class="category">${expense.category}</span>
      <p style="margin: 5px 0; color: #666;">
        ${categoryIcons[expense.category]}  ${expense.description}
      </p>
      <p class="date">📅 ${expense.displayDate}</p>
    </div>
    <div style="display: flex; align-items: center;">
      <div class="transaction_amount">
        Rs. ${(Math.round(expense.amount * 100) / 100).toFixed(2)}
      </div>
      <button class="delete_btn" onclick="deleteExpense(${expense.id})">
        Delete
      </button>
    </div>
  </div>
  `;
    })
    .join();
}

//delete expense in transactions list
//update saved expense
//update charts
//update transactions list
//update filters in transactions
//update budget
function deleteExpense(id) {
  if (confirm("Are you sure you want to delete this expense?")) {
    expenses = expenses.filter((expense) => {
      return expense.id !== id;
    });
    saveExpenses();
    updateTransactions();
    updateBudget();
    updateFilters();
  }
}
//downlaod pdf report for expenses
const downloadPDFBtn = document.getElementById("downloadPDF");
downloadPDFBtn.addEventListener("click", downloadPDF);
function downloadPDF() {
  console.log("downalod pdf");
  try {
    const { jsPDF } = window.jspdf;

    if (!jsPDF) {
      alert("PDF library not loaded. Downloading as text file instead.");
      downloadAsText();
      return;
    }
    const doc = new jsPDF();

    //title
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    doc.text("EXPENSE TRACKER REPORT", 105, 20, { align: "center" });

    //date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Generated:" + new Date().toLocaleString(), 105, 28, {
      align: "center",
    });

    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("SUMMARY", 20, 40);

    doc.setFontSize(11);
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    doc.text("Total Expenses: Rs. " + total.toFixed(2), 20, 48);
    doc.text("Total Transactions: " + expenses.length, 20, 55);

    doc.setFontSize(14);
    doc.text("TRANSACTIONS", 20, 70);

    const sortedExpenses = [...expenses].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });

    //saving doc as pdf
    doc.save(
      "Expense_Report_" + new Date().toISOString().split("T")[0] + ".pdf",
    );
  } catch (error) {
    console.log("PDF Error:", error);
    alert("Error generating PDF. Downloading as a text file instead.");
    downloadAsText();
  }
}

function downloadAsText() {
  console.log("downlaoding as text");
}
//search expenses

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchExpenses);
function searchExpenses() {
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();

  if (searchValue === "") {
    updateTransactions();
    return;
  }

  const filteredExpenses = expenses.filter((expense) => {
    return (
      expense.name.toLowerCase().includes(searchValue) ||
      expense.description.toLowerCase().includes(searchValue)
    );
  });

  const transactionList = document.getElementById("transactionList");

  if (filteredExpenses.length === 0) {
    transactionList.innerHTML =
      '<p style="text-align: center; color: #666; padding: 40px;">No transactions match the selected filters.</p>';
    return;
  }

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  transactionList.innerHTML = sortedExpenses
    .map((expense) => {
      return `
  <div class="transaction_item">
    <div class="transaction_info">
      <h3>${expense.name}</h3>
      <span class="category">${expense.category}</span>
      <p style="margin: 5px 0; color: #666;">
        ${categoryIcons[expense.category]}  ${expense.description}
      </p>
      <p class="date">📅 ${expense.displayDate}</p>
    </div>
    <div style="display: flex; align-items: center;">
      <div class="transaction_amount">
        Rs. ${(Math.round(expense.amount * 100) / 100).toFixed(2)}
      </div>
      <button class="delete_btn" onclick="deleteExpense(${expense.id})">
        Delete
      </button>
    </div>
  </div>
  `;
    })
    .join();
}

//show expenses in filter range input

function updateFilters() {
  if (expenses.length === 0) {
    document.getElementById("amountSlider").max = 0;
    document.getElementById("sliderMax").textContent = "Rs.0";
    document.getElementById("maxAmount").textContent = "0";

    maxFilterAmount = 0;
    return;
  }

  const maxExpense = Math.max(...expenses.map((expense) => expense.amount));
  const roundedMax = Math.ceil(maxExpense / 10000) * 10000;
  maxFilterAmount = roundedMax || 10000;

  document.getElementById("amountSlider").max = roundedMax;
  document.getElementById("amountSlider").value = roundedMax;
  document.getElementById("sliderMax").textContent = "Rs. " + roundedMax;
  document.getElementById("maxAmount").textContent = roundedMax;
}

//filter transactions by range input
//filter transactions by month
//reset filters

function updateBudget() {
  enteredBudget =
    parseFloat(document.getElementById("monthlyBudget").value) || 0;
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const remaining = enteredBudget - totalExpenses;
  const percentage =
    enteredBudget > 0 ? (totalExpenses / enteredBudget) * 100 : 0;

  const display = document.getElementById("budgetDisplay");

  if (enteredBudget === 0) {
    display.innerHTML = "";
    return;
  }
  let progressColor = "#4CAF50";
  if (percentage > 100) progressColor = "#f44336";
  else if (percentage > 80) progressColor = "#FFC107";

  let warningHtml = "";
  if (totalExpenses > enteredBudget) {
    warningHtml =
      '<div class="warning"><strong>Warning:</strong> You have exceeded your budget by Rs.' +
      (Math.round((totalExpenses - enteredBudget) * 100) / 100).toFixed(2) +
      "</div>";
  }
  display.innerHTML = `
  <div class="budget_display">
    <div class="budget_item">
      <span>Budget Limit</span>
      <span>Rs.${(Math.round(enteredBudget * 100) / 100).toFixed(2)}</span>
    </div>
    <div class="budget_item">
      <span>Total Spent</span>
      <span>Rs.${(Math.round(totalExpenses * 100) / 100).toFixed(2)}</span>
    </div>
    <div class="budget_item">
      <span>Remaining</span>
      <span>Rs.${(Math.round(remaining * 100) / 100).toFixed(2)}</span>
    </div>
    <div class="progress_bar">
      <div class="progress_fill" 
           style="width: ${Math.min(percentage, 100)}%; background: ${progressColor};">
      </div>
    </div>
    <p style="text-align: center; margin-top: 15px; font-size: 14px;">
      ${percentage.toFixed(1)}% of budget used
    </p>
    ${warningHtml}
  </div>
`;

  console.log("Budget updated with", expenses.length, "expenses");
}
