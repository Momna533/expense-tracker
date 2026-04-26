let expenses = [];
let maxFilterAmount = 0;
let enteredBudget = 0;
let selectedMonths = [];

let pieChart, lineChart, barChart;

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
  initializeMonthCheckboxes();
  loadTheme();
  loadExpenses();
  updateTransactions();
  updateFilters();
  loadBudget();
  updateBudget();

  const slider = document.getElementById("amountSlider");
  if (slider) {
    slider.addEventListener("input", applyFilters);
  }
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
    setTimeout(() => updateCharts(), 100);
  } else if (tabName === "monthlySummary") {
    updateMonthlySummary();
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

//show total expenses in transactions tab in start card
//show expenses by each expense in details in bottom list in transactions tab

const categoryColors = {
  Food: "#FF6384",
  Transport: "#36A2EB",
  Entertainment: "#FFCE56",
  Utilities: "#4BC0C0",
  Healthcare: "#9966FF",
  Shopping: "#FF9F40",
  Other: "#C9CBCF",
};

const categoryIcons = {
  Food: "🍔",
  Transport: "🚗",
  Entertainment: "🎮",
  Utilities: "💡",
  Shopping: "🛍️",
  Healthcare: "🏥",
  Other: "📦",
};

function updateTransactions() {
  const totalExpensesDiv = document.getElementById("totalExpense");
  const totalExpensesList = document.getElementById("transactionList");

  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);

  totalExpensesDiv.textContent = "$" + totalExpenses.toFixed(2);

  if (expenses.length === 0) {
    totalExpensesList.innerHTML =
      '<p style="text-align: center; color: #666; padding: 40px;">No transactions yet. Add your first expense!</p>';
    return;
  }

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  totalExpensesList.innerHTML = sortedExpenses
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
    updateCharts();
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

    let yPos = 80;
    doc.setFontSize(9);

    sortedExpenses.forEach((expense, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setTextColor(102, 126, 234);
      doc.text(index + 1 + "." + expense.name, 20, yPos);

      doc.setTextColor(0, 0, 0);
      yPos += 5;
      doc.text(
        " Category: " +
          categoryIcons[expense.category] +
          " " +
          expense.category,
        20,
        yPos,
      );

      yPos += 5;
      doc.text(" Amount: Rs. " + expense.amount.toFixed(2), 20, yPos);

      yPos += 5;
      doc.text("   Date: " + expense.displayDate, 20, yPos);
      yPos += 5;
      doc.text("   Description: " + (expense.description || "N/A"), 20, yPos);
      yPos += 8;
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
  let reportContent = "=== EXPENSE TRACKER REPORT ===\n\n";
  reportContent += "Generated: " + new Date().toLocaleString() + "\n\n";
  reportContent += "SUMMARY\n";
  reportContent += "------------------------\n";
  reportContent +=
    "Total Expenses: Rs." +
    expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2) +
    "\n";
  reportContent += "Total Transactions: " + expenses.length + "\n\n";
  reportContent += "TRANSACTIONS\n";
  reportContent += "------------------------\n\n";

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  sortedExpenses.forEach((expense) => {
    reportContent += "Name: " + expense.name + "\n";
    reportContent +=
      "Category: " +
      categoryIcons[expense.category] +
      " " +
      expense.category +
      "\n";
    reportContent += "Amount: Rs." + expense.amount.toFixed(2) + "\n";
    reportContent += "Date: " + expense.displayDate + "\n";
    reportContent += "Description: " + expense.description + "\n";
    reportContent += "------------------------\n";
  });

  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    "Expense_Report_" + new Date().toISOString().split("T")[0] + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
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

  displayFilteredTransactions(filteredExpenses);
}

//show expenses in filter range input

function updateFilters() {
  if (expenses.length === 0) {
    document.getElementById("maxAmount").textContent = "0";
    document.getElementById("amountSlider").max = 0;
    document.getElementById("sliderMax").textContent = "Rs.0";

    maxFilterAmount = 0;
    return;
  }

  const maxExpense = Math.max(...expenses.map((expense) => expense.amount));
  const roundedMax = Math.ceil(maxExpense / 10000) * 10000;
  maxFilterAmount = roundedMax || 10000;

  document.getElementById("maxAmount").textContent = roundedMax;
  document.getElementById("amountSlider").max = roundedMax;
  document.getElementById("amountSlider").value = roundedMax;
  document.getElementById("sliderMax").textContent = "Rs. " + roundedMax;
}

//filter transactions by range input
//filter transactions by month

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function initializeMonthCheckboxes() {
  const container = document.getElementById("monthCheckboxes");
  let html = "";
  monthNames.forEach((month, index) => {
    html += `
    <div class="month_checkbox_item">
      <input 
        type="checkbox" 
        id="month${index}"
        value= "${index}"
        onchange="applyFilters()"
        >
      <label for="month${index}">
        ${month}
      </label>
      </div>
    `;
  });
  container.innerHTML = html;
}

function applyFilters() {
  const maxAmount = parseFloat(document.getElementById("amountSlider").value);
  document.getElementById("maxAmount").textContent = maxAmount.toFixed();

  selectedMonths = [];
  monthNames.forEach((month, index) => {
    const checkbox = document.getElementById("month" + index);
    if (checkbox && checkbox.checked) {
      selectedMonths.push(index);
    }
  });

  let filteredExpenses = expenses.filter(
    (expense) => expense.amount <= maxAmount,
  );

  if (selectedMonths.length > 0) {
    filteredExpenses = filteredExpenses.filter((expense) => {
      const expesneDate = new Date(expense.date);
      return selectedMonths.includes(expesneDate.getMonth());
    });
  }
  displayFilteredTransactions(filteredExpenses);
}
function displayFilteredTransactions(filteredExpenses) {
  const expensesList = document.getElementById("transactionList");

  if (filteredExpenses.length === 0) {
    expensesList.innerHTML =
      '<p style="text-align: center; color: #666; padding: 40px;">No transactions match the selected filters.</p>';
    return;
  }

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

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

//reset filters

document.getElementById("resetFilters").addEventListener("click", resetFilters);
function resetFilters() {
  document.getElementById("amountSlider").value = maxFilterAmount;
  document.getElementById("maxAmount").textContent = maxFilterAmount.toFixed(0);

  monthNames.forEach((month, index) => {
    const checkbox = document.getElementById("month" + index);
    if (checkbox) checkbox.checked = false;
  });

  selectedMonths = [];
  updateTransactions();
}

//analytics tab

function updateCharts() {
  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Shopping",
    "Other",
  ];
  const categoriesData = categories
    .map((category) => ({
      name: category,
      value: expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }))
    .filter((item) => item.value > 0);

  const pieCtx = document.getElementById("pieChart");
  if (pieCtx) {
    const ctx = pieCtx.getContext("2d");
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: categoriesData.map((d) => d.name),
        datasets: [
          {
            data: categoriesData.map((d) => d.value),
            backgroundColor: categoriesData.map((d) => categoryColors[d.name]),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ": Rs." + context.parsed.toFixed(2);
              },
            },
          },
        },
      },
    });
  }

  const monthlyData = {};
  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.date);
    const monthYear = expenseDate.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    const sortKey =
      expenseDate.getFullYear() +
      "-" +
      String(expenseDate.getMonth() + 1).padStart(2, "0");

    if (!monthlyData[sortKey]) {
      monthlyData[sortKey] = {
        label: monthYear,
        amount: 0,
      };
    }

    monthlyData[sortKey].amount += expense.amount;
  });

  const sortedMonthlyData = Object.keys(monthlyData)
    .sort()
    .map((key) => ({
      month: monthlyData[key].label,
      amount: monthlyData[key].amount,
    }));

  const lineCtx = document.getElementById("lineChart");
  if (lineCtx) {
    const ctx = lineCtx.getContext("2d");
    if (lineChart) lineChart.destroy();
    lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: sortedMonthlyData.map((d) => d.month),
        datasets: [
          {
            label: "Monthly Expenses (Rs.)",
            data: sortedMonthlyData.map((d) => d.amount),
            borderColor: "#667eea",
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#667eea",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return "Expenses: Rs." + context.parsed.y.toFixed(2);
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "Rs." + value.toFixed(0);
              },
            },
          },
        },
      },
    });
  }

  const barCtx = document.getElementById("barChart");
  if (barCtx) {
    const ctx = barCtx.getContext("2d");
    if (barChart) barChart.destroy();
    barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: categoriesData.map((d) => d.name),
        datasets: [
          {
            label: "Amount (Rs.)",
            data: categoriesData.map((d) => d.value),
            backgroundColor: categoriesData.map((d) => categoryColors[d.name]),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ": Rs." + context.parsed.y.toFixed(2);
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "Rs." + value.toFixed(0);
              },
            },
          },
        },
      },
    });
  }
}

// budget tabs

//when window loads update budget func runs

document
  .getElementById("monthlyBudget")
  .addEventListener("change", updateBudget);
function updateBudget() {
  console.log("updated");
  enteredBudget =
    parseFloat(document.getElementById("monthlyBudget").value) || 0;

  //update budget func saves budget to local storage

  saveBudget();
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const remaining = enteredBudget - totalExpenses;
  const percentage =
    enteredBudget > 0 ? (totalExpenses / enteredBudget) * 100 : 0;

  //inside budgetdisplay div show total expenses used, remaining onces and the percentage

  const display = document.getElementById("budgetDisplay");

  if (enteredBudget === 0) {
    display.innerHTML = "";
    return;
  }

  let progressColor = "#4CAF50";
  if (percentage > 100) progressColor = "#f44336";
  else if (percentage > 80) progressColor = "#FFC107";

  //show warning only if the budget is less and expenses are more

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
}

function saveBudget() {
  if (currentUser) {
    localStorage.setItem(
      "budget_" + currentUser,
      JSON.stringify(enteredBudget),
    );
  }
}
//load budget everytime window runs

function loadBudget() {
  if (currentUser) {
    const savedBudget = localStorage.getItem("budget_" + currentUser);
    if (savedBudget) enteredBudget = JSON.parse(savedBudget);
    document.getElementById("monthlyBudget").value =
      enteredBudget > 0 ? enteredBudget : "";
  }
}

//summary tab

//run this func in showtabs if tabname is summary
function updateMonthlySummary() {
  const now = new Date();

  //current month and year
  const currentMonthName = now.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  document.getElementById("currentMonth").textContent = currentMonthName;

  //show sum of total expenses for current month
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    );
  });

  //calculate monthly total
  const monthlyTotal = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  //show average expenses per day

  const dailyAvg =
    currentMonthExpenses.length > 0 ? monthlyTotal / now.getDate() : 0;

  //show monthly total
  document.getElementById("monthlyTotal").textContent = (
    Math.round(monthlyTotal * 100) / 100
  ).toFixed(2);
  //show total number of transactions
  document.getElementById("monthlyCount").textContent =
    currentMonthExpenses.length;
  //show daily average
  document.getElementById("dailyAverage").textContent = (
    Math.round(dailyAvg * 100) / 100
  ).toFixed(2);

  //category breakdown
  //showing each category, total amount spent on that category and percentage of it out of total expenses
  //and a bar showing that percentage with fill
  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Shopping",
    "Other",
  ];

  const breakdownContainer = document.getElementById("categoryBreakdown");
  let breakdownHTML = "";
  let hasCategoryData = false;

  console.log(currentMonthExpenses);
  categories.forEach((category) => {
    const categoryTotal = currentMonthExpenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);

    console.log(categoryTotal);
    if (categoryTotal > 0) {
      hasCategoryData = true;
      const percentage =
        monthlyTotal > 0 ? (categoryTotal / monthlyTotal) * 100 : 0;
      breakdownHTML += `
  <div class="category_item">
    <div class="category_header">
      <span>${categoryIcons[category]} ${category}</span>
      <span>Rs.${(Math.round(categoryTotal * 100) / 100).toFixed(2)} (${percentage.toFixed(1)}%)</span>
    </div>
    <div class="category_bar">
      <div class="category_bar_fill" 
           style="width: ${percentage}%; background: ${categoryColors[category]}"></div>
    </div>
  </div>
`;
    }
  });

  if (!hasCategoryData) {
    breakdownHTML +=
      '<p style="text-align: center; color: #666; padding: 20px;">No expenses this month yet.</p>';
  }
  breakdownContainer.innerHTML = breakdownHTML;
}
