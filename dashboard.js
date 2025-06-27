document.addEventListener("DOMContentLoaded", () => {
  const incomeTotal = document.getElementById("incomeTotal");
  const expenseTotal = document.getElementById("expenseTotal");
  const netTotal = document.getElementById("netTotal");

  const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
  const thisMonth = new Date().toISOString().slice(0, 7);
  let incomeSum = 0, expenseSum = 0;
  let dailyTotals = {};
  let categoryTotals = {};

  expenses.forEach(e => {
    if (e.date.slice(0, 7) === thisMonth) {
      if (e.type === "income") incomeSum += e.amount;
      else expenseSum += e.amount;

      if (e.type === "expense") {
        dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      }
    }
  });

  incomeTotal.textContent = `Income: ₹${incomeSum}`;
  expenseTotal.textContent = `Expenses: ₹${expenseSum}`;
  netTotal.textContent = `Balance: ₹${incomeSum - expenseSum}`;

  const barCtx = document.getElementById("barChart").getContext("2d");
  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(dailyTotals),
      datasets: [{
        label: 'Daily Expenses',
        data: Object.values(dailyTotals),
        backgroundColor: '#4caf50'
      }]
    }
  });

  const pieCtx = document.getElementById("pieChart").getContext("2d");
  new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        label: 'Category Split',
        data: Object.values(categoryTotals),
        backgroundColor: ['#ef4444', '#3b82f6', '#facc15', '#10b981', '#a855f7', '#ec4899']
      }]
    }
  });
});
