const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const incomeTotal = document.getElementById("incomeTotal");
const expenseTotal = document.getElementById("expenseTotal");
const netTotal = document.getElementById("netTotal");

let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

form.addEventListener("submit", e => {
  e.preventDefault();
  const type = form.type.value;
  const amount = parseFloat(form.amount.value);
  const date = form.date.value;
  const category = form.category.value;
  const person = form.person.value;
  const note = form.note.value;

  if (!amount || !date || !category || !person || !type) return alert("Fill all fields");

  expenses.push({ type, amount, date, category, person, note });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  form.reset();
  updateUI();
});

function updateUI() {
  list.innerHTML = "";
  let thisMonth = new Date().toISOString().slice(0, 7);
  let incomeSum = 0, expenseSum = 0;
  let dailyTotals = {};
  let categoryTotals = {};

  expenses.forEach(e => {
    const li = document.createElement("li");
    li.className = "bg-gray-800 p-3 rounded shadow text-sm";
    li.textContent = `${e.type.toUpperCase()} - ₹${e.amount} - ${e.category} (${e.person}) ${e.date} ${e.note}`;
    list.appendChild(li);

    if (e.date.slice(0, 7) === thisMonth) {
      if (e.type === "income") incomeSum += e.amount;
      else expenseSum += e.amount;

      dailyTotals[e.date] = (dailyTotals[e.date] || 0) + (e.type === "expense" ? e.amount : 0);
      if (e.type === "expense") categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    }
  });

  incomeTotal.textContent = `Income: ₹${incomeSum}`;
  expenseTotal.textContent = `Expenses: ₹${expenseSum}`;
  netTotal.textContent = `Balance: ₹${incomeSum - expenseSum}`;

  drawBarChart(dailyTotals);
  drawPieChart(categoryTotals);
}

function drawBarChart(data) {
  const ctx = document.getElementById("barChart").getContext("2d");
  if (window.barChartInstance) window.barChartInstance.destroy();

  const labels = Object.keys(data).sort();
  const values = labels.map(k => data[k]);

  window.barChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Daily Expenses',
        data: values,
        backgroundColor: '#4caf50'
      }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

function drawPieChart(data) {
  const ctx = document.getElementById("pieChart").getContext("2d");
  if (window.pieChartInstance) window.pieChartInstance.destroy();

  const labels = Object.keys(data);
  const values = labels.map(k => data[k]);

  window.pieChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Category Split',
        data: values,
        backgroundColor: ['#ef4444', '#3b82f6', '#facc15', '#10b981', '#a855f7', '#ec4899']
      }]
    },
    options: { responsive: true }
  });
}

updateUI();
