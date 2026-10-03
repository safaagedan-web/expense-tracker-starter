// Expense Tracker - backend (Express API + PostgreSQL)
//
// PHASE 1
// Setup:
//   1. Create a database named expense_tracker and run schema.sql on it.
//   2. Copy .env.example to a new file named .env and write your PostgreSQL password.
//   3. npm install express cors pg dotenv
// Run:    node server.js   (restart it every time you change this file)
//
// Endpoints you need to build:
//   GET    /api/expenses        return all expenses
//   GET    /api/expenses/:id    return one expense (404 if not found)
//   POST   /api/expenses        add an expense (201, or 400 if the data is invalid)
//   PUT    /api/expenses/:id    update an expense (200, 400, or 404)
//   DELETE /api/expenses/:id    delete an expense (200, or 404)
//
// Tips:
//   - Create one Pool (from the "pg" library) with the values from .env,
//     and use pool.query(...) in every route.
//   - ALWAYS send the values as parameters: pool.query("... WHERE id = $1", [id]).
//     NEVER build the SQL text by joining strings with data from the user.
//   - Use RETURNING to get the new (or updated) row back from INSERT and UPDATE.
//   - The database creates the id. The client never sends one.
//   - pg returns NUMERIC as text and DATE as a JavaScript Date, so fix both in your SELECT.
//     Hint: amount::float8 and to_char(date, 'YYYY-MM-DD').
//   - Validate the data before the query, and answer 400 with a message that explains the problem.
//   - Check the id before the query. A text like "abc" makes PostgreSQL throw an error.
//   - Enable CORS so the frontend can talk to the server.
//   - Test every endpoint with Thunder Client BEFORE you connect the frontend.

require("dotenv").config();

const { Pool } = require("pg");
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});


const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());
// GET all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, amount, category,
              TO_CHAR(date, 'YYYY-MM-DD') AS date
       FROM expenses
       ORDER BY date DESC`
    );

    const expenses = result.rows.map(expense => {
      const [year, month, day] = expense.date.split("-");

      return {
        ...expense,
        date: `${day}-${month}-${year}`
      };
    });

    res.json(expenses);

  } catch (error) {
    res.status(500).json({
      error: "Database error"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// GET one expense by ID
app.get("/api/expenses/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      `SELECT id, title, amount, category,
              TO_CHAR(date, 'YYYY-MM-DD') AS date
       FROM expenses
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Expense not found"
      });
    }

    const expense = result.rows[0];

    const [year, month, day] = expense.date.split("-");

    expense.date = `${day}-${month}-${year}`;

    res.json(expense);

  } catch (error) {
    res.status(500).json({
      error: "Database error"
    });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// POST - Add new expense
app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // Check required fields
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    // Allowed categories
    const allowedCategories = [
      "Food",
      "Transport",
      "Bills",
      "Entertainment",
      "Other"
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        error: "Invalid category"
      });
    }

    // Amount must be greater than 0
    if (amount <= 0) {
      return res.status(400).json({
        error: "Amount must be greater than 0"
      });
    }

    // Insert expense
    const result = await pool.query(
      `INSERT INTO expenses (title, amount, category, date)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, amount, category,
                 TO_CHAR(date, 'YYYY-MM-DD') AS date`,
      [title, amount, category, date]
    );

    // Format date as DD-MM-YYYY
    const expense = result.rows[0];

    const [year, month, day] = expense.date.split("-");

    expense.date = `${day}-${month}-${year}`;

    // Return new expense
    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({
      error: "Database error"
    });
  }
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// PUT - Update expense
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { title, amount, category, date } = req.body;

    // Check required fields
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    // Allowed categories
    const allowedCategories = [
      "Food",
      "Transport",
      "Bills",
      "Entertainment",
      "Other"
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        error: "Invalid category"
      });
    }

    // Amount must be greater than 0
    if (amount <= 0) {
      return res.status(400).json({
        error: "Amount must be greater than 0"
      });
    }

    // Update expense
    const result = await pool.query(
      `UPDATE expenses
       SET title = $1,
           amount = $2,
           category = $3,
           date = $4
       WHERE id = $5
       RETURNING id, title, amount, category,
                 TO_CHAR(date, 'YYYY-MM-DD') AS date`,
      [title, amount, category, date, id]
    );

    // Check if expense exists
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Expense not found"
      });
    }

    // Format date as DD-MM-YYYY
    const expense = result.rows[0];

    const [year, month, day] = expense.date.split("-");

    expense.date = `${day}-${month}-${year}`;

    // Return updated expense
    res.json(expense);

  } catch (error) {
    res.status(500).json({
      error: "Database error"
    });
  }
});

// DELETE - expense
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "DELETE FROM expenses WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Expense not found"
      });
    }

    res.json({
      message: "Expense deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: "Database error"
    });
  }
});