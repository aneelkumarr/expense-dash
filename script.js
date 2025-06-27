const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const todayTotal = document.getElementById("todayTotal");
const monthTotal = document.getElementById("monthTotal");

let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

form.addEventListener("submit", e => {
  e.preventDefault();
  const amount = parseFloat(form.amount.value);
  const date = form.date.value;
  const category = form.category.value;
  const person = form.person.value;
  const note = form.note.value;

  if (!amount || !date || !category || !person) return alert("Fill all fields");

  expenses.push({ amount, date, category, person, note });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  form.reset();
  updateUI();
});

function updateUI() {
  list.innerHTML = "";
  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = today.slice(0, 7);
  let todaySum = 0, monthSum = 0;
  let dailyTotals = {};

  expenses.forEach(e => {
    const li = document.createElement("li");
    li.className = "bg-gray-800 p-3 rounded shadow text-sm";
    li.textContent = `${e.date} - ₹${e.amount} - ${e.category} (${e.person}) ${e.note}`;
    list.appendChild(li);

    if (e.date === today) todaySum += e.amount;
    if (e.date.slice(0, 7) === thisMonth) {
      monthSum += e.amount;
      dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
    }
  });

  todayTotal.textContent = `Today: ₹${todaySum}`;
  monthTotal.textContent = `This Month: ₹${monthSum}`;

  drawBarChart(dailyTotals);
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
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

updateUI();
