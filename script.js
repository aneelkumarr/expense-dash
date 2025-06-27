document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("expenseForm");
  let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const entry = {
      type: form.type.value,
      amount: parseFloat(form.amount.value),
      date: form.date.value,
      category: form.category.value,
      person: form.person.value,
      note: form.note.value
    };

    if (!entry.amount || !entry.date || !entry.category || !entry.person || !entry.type) {
      alert("Please fill all fields");
      return;
    }

    expenses.push(entry);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    alert("Saved!");
    location.href = "index.html";
  });
});
