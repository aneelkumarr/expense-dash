const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const todayTotal = document.getElementById("todayTotal");
const monthTotal = document.getElementById("monthTotal");

let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

function updateUI() {
  list.innerHTML = "";
  let today = new Date().toISOString().slice(0, 10);
  let month = today.slice(0, 7);
  let todaySum = 0;
  let monthSum = 0;

  expenses.forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.date} - ₹${e.amount} - ${e.category} (${e.person}) ${e.note}`;
    list.appendChild(li);

    if (e.date === today) todaySum += e.amount;
    if (e.date.slice(0, 7) === month) monthSum += e.amount;
  });

  todayTotal.textContent = `Today: ₹${todaySum}`;
  monthTotal.textContent = `This Month: ₹${monthSum}`;
}

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

updateUI();
