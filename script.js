let salary = 0;
let expenses = [];
let chart;

window.onload = function () {
  const savedSalary = localStorage.getItem("salary");
  const savedExpenses = localStorage.getItem("expenses");

  if (savedSalary) {
    salary = Number(savedSalary);
  }

  if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
  }

  updateUI();
};

document.getElementById("setSalaryBtn").onclick = function () {
  const value = document.getElementById("salaryInput").value;

  if (!value || value <= 0) {
    alert("Please enter valid salary");
    return;
  }

  salary = Number(value);
  localStorage.setItem("salary", salary);

  updateUI();
};

document.getElementById("addExpenseBtn").onclick = function () {
  const name = document.getElementById("expenseName").value;
  const amount = document.getElementById("expenseAmount").value;

  if (!name || !amount || amount <= 0) {
    alert("Please enter valid details");
    return;
  }

  const expense = {
    id: Date.now(),
    name: name,
    amount: Number(amount)
  };

  expenses.push(expense);

  localStorage.setItem("expenses", JSON.stringify(expenses));

  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";

  updateUI();
};

function deleteExpense(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateUI();
}

function updateUI() {
  document.getElementById("salaryDisplay").innerText = salary;

  let total = 0;
  expenses.forEach(exp => total += exp.amount);
  document.getElementById("totalExpense").innerText = total;

  const balance = salary - total;
  document.getElementById("balance").innerText = balance;

  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  expenses.forEach(exp => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${exp.name} - ₹${exp.amount}
      <span class="delete" onclick="deleteExpense(${exp.id})">🗑</span>
    `;

    list.appendChild(li);
  });

  drawChart(total, balance);
}

function drawChart(total, balance) {
  const ctx = document.getElementById("chart");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Expenses", "Balance"],
      datasets: [{
        data: [total, balance]
      }]
    }
  });
}