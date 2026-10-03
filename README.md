# Expense Tracker

Expense Tracker is a web application that allows users to manage and track their daily expenses.

## How to run

<!-- Write the exact steps someone needs to run your project from scratch.
     Assume they have Node.js, PostgreSQL, and VS Code, and nothing else.
     Include: creating the database, running schema.sql, writing the .env file,
     starting the backend, and opening the frontend. -->

**Backend**



1. Create a PostgreSQL database named `expense_tracker`.
2. Open `schema.sql` in pgAdmin and run it.
3. Create a `.env` file inside the backend folder.
4. Add the database configuration to the `.env` file.
5. Open the terminal inside the backend folder.
6. Run `npm install` to install the required packages.
7. Start the backend server using `node server.js`.
8. The backend will run on `http://localhost:3000`.


**Frontend**

1. Open the project in VS Code.
2. Make sure the backend server is running.
3. Open `index.html` using Live Server.
4. The application will open in the browser.

## Features


- [x] Add an expense (with validation)
- [x] Delete an expense
- [x] Edit an expense
- [x] Filter by category
- [x] Summary cards (total, count, highest)
- [x] Data is saved in a PostgreSQL database

## Screenshots
Desktop Screenshot:(screenshots\Readmescreenshot\Desktop Screenshot.png)

Mobile Screenshot:(screenshots\Readmescreenshot\Mobile Screenshot.png)

Modal Screenshot:(screenshots\Readmescreenshot\Modal Screenshot.png)
## What was the hardest part?


The hardest part was connecting the frontend with the backend and making sure the API requests worked correctly. I solved the issues by testing the endpoints and fixing the CORS configuration.
