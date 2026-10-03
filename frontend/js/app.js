const API_URL = "http://localhost:3000/api/expenses";


const form = document.getElementById("expenseForm");
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    try {

        const title = document.getElementById("title").value;
        const amount = document.getElementById("amount").value;
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;

        if (!title || !amount || !category || !date) {
            alert("All fields are required");
            return;
        }

        const expense = {
            title: title,
            amount: amount,
            category: category,
            date: date
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        });

        if (!response.ok) {
            throw new Error("Failed to add expense");
        }



        alert("Expense added successfully");
        form.reset();
        getExpenses();
    } catch (error) {
        console.error(error);
        alert("Failed to add expense");
    }
});

async function getExpenses(category = "All", searchText = "") {
    const spinner = document.getElementById("loadingSpinner");
    try {

        spinner.classList.remove("d-none");
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch expenses");
        }
        const allExpenses = await response.json();

        let expenses = allExpenses;

        updateSummary(allExpenses);

        if (category !== "All") {
            expenses = expenses.filter(expense => expense.category === category);
        }
        if (searchText) {
    expenses = expenses.filter(expense =>
        expense.title.toLowerCase().includes(searchText.toLowerCase())
    );
}
        const table = document.getElementById("expensesTable");
        table.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
        <td>${expense.id}</td>
        <td>${expense.title}</td>
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
        <td>
        <button class="btn btn-warning btn-sm" onclick="editExpense(${expense.id})">
         Edit
         </button>
         
        <button class="btn btn-danger btn-sm" onclick="deleteExpense(${expense.id})">
        Delete
        </button>
        </td>
    `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        alert("Failed to load expenses");
    }
    finally {
        spinner.classList.add("d-none");
    }
}
getExpenses();

document.getElementById("categoryFilter").addEventListener("change", function () {
    const category = this.value;
 const searchText = document.getElementById("titleSearch").value;

    getExpenses(category, searchText);
});
    document.getElementById("titleSearch").addEventListener("input", function () {
    const searchText = this.value.toLowerCase();

     const category = document.getElementById("categoryFilter").value;

    getExpenses(category, searchText);
});

//Summary
function updateSummary(expenses) {
    const total = expenses.reduce((sum, expense) => {
        return sum + Number(expense.amount);
    }, 0);
    document.getElementById("totalExpenses").textContent = total.toFixed(2);
    const count = expenses.length;
    document.getElementById("expenseCount").textContent = count;
    const highest = expenses.length > 0
        ? Math.max(...expenses.map(expense => Number(expense.amount)))
        : 0; document.getElementById("highestExpense").textContent = highest.toFixed(2);
}
async function deleteExpense(id) {
    const confirmed = confirm("Are you sure you want to delete this expense?");

    if (!confirmed) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("Failed to delete expense");
        }
        alert("Expense deleted successfully");
        getExpenses();
    } catch (error) {
        console.error(error);
        alert("Failed to delete expense");
    }
}
//Edit Expense
async function editExpense(id) {
    try {

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch expense");
        }
        const expense = await response.json();
        document.getElementById("editId").value = expense.id;
        document.getElementById("editTitle").value = expense.title;
        document.getElementById("editAmount").value = expense.amount;
        document.getElementById("editCategory").value = expense.category;
        const [day, month, year] = expense.date.split("-");
        document.getElementById("editDate").value = `${year}-${month}-${day}`;
        const modal = new bootstrap.Modal(document.getElementById("editModal"));
        modal.show();

    } catch (error) {
        console.error(error);
        alert("Failed to load expense");
    }



}
document.getElementById("saveEditBtn").addEventListener("click", updateExpense);

// update Expense
async function updateExpense() {
    try {
        const id = document.getElementById("editId").value;
        const title = document.getElementById("editTitle").value;
        const amount = document.getElementById("editAmount").value;
        const category = document.getElementById("editCategory").value;
        const date = document.getElementById("editDate").value;

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                amount: amount,
                category: category,
                date: date
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update expense");
        }
        alert("Expense updated successfully");

        const modalElement = document.getElementById("editModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();


        getExpenses();

    } catch (error) {
        console.error(error);
        alert("Failed to update expense");
    }
}

//darkmode
const darkModeBtn = document.getElementById("darkModeBtn");

if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeBtn.textContent = "☀️ Light Mode";
}

darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.textContent = "☀️ Light Mode";
        localStorage.setItem("darkMode", "enabled");
    } else {
        darkModeBtn.textContent = "🌙 Dark Mode";
        localStorage.setItem("darkMode", "disabled");
    }
});