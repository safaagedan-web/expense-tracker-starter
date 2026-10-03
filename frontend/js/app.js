const API_URL = "http://localhost:3000/api/expenses";


const form = document.getElementById("expenseForm");
function showAlert(message, type) {
    const alertMessage = document.getElementById("alertMessage");

    alertMessage.textContent = message;
    alertMessage.className = `alert alert-${type}`;
}
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    try {

        const title = document.getElementById("title").value;
        const amount = document.getElementById("amount").value;
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;

        if (!title || !amount || !category || !date) {
          showAlert("All fields are required", "danger");
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



       showAlert("Expense added successfully", "success");
        form.reset();
        getExpenses();
    } catch (error) {
        console.error(error);
       showAlert("Failed to add expense", "danger");
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
       <button class="btn btn-sm edit-btn me-1" onclick="editExpense(${expense.id})">
    Edit
</button>
         
       <button class="btn btn-sm delete-btn me-1" onclick="deleteExpense(${expense.id})">
    Delete
</button>
        </td>
    `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        showAlert("Unable to connect to the server. Please make sure the backend is running.", "danger");
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

// Delete Expense
let deleteId = null;
function deleteExpense(id) {
    deleteId = id;

    const modal = new bootstrap.Modal(
        document.getElementById("deleteModal")
    );

    modal.show();
}
document.getElementById("confirmDeleteBtn").addEventListener("click", async function () {
    try {
        const response = await fetch(`${API_URL}/${deleteId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete expense");
        }

        showAlert("Expense deleted successfully", "success");

        getExpenses();

        const modalElement = document.getElementById("deleteModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

    } catch (error) {
        console.error(error);
        showAlert("Failed to delete expense", "danger");
    }
});
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
        showAlert("Failed to load expense", "danger");
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
      showAlert("Expense updated successfully", "success");

        const modalElement = document.getElementById("editModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();


        getExpenses();

    } catch (error) {
        console.error(error);
        showAlert("Failed to update expense", "danger");
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