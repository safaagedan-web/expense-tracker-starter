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

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=postgres
DB_PASSWORD=  
```

5. Open the terminal inside the backend folder.
6. Run `npm install` to install the required packages.
7. Start the backend server using `node server.js`.
8. The backend will run on `http://localhost:3000`.


**Frontend**

1. Open the project in VS Code.
2. Make sure the backend server is running.
3. Open `index.html` using Live Server.
4. The application will open in the browser.

## GitHub Repository

[View the project on GitHub](https://github.com/safaagedan-web/expense-tracker-starter)


## Demo Video

[Watch the project demo] (https://drive.google.com/file/d/1XzqrCGfj3h-p8fe4wZY5dHa95wajaCJF/view?usp=drive_link)
## Features



- [x] Add an expense with validation
- [x] View all expenses
- [x] Edit an expense
- [x] Delete an expense with confirmation modal
- [x] Filter expenses by category
- [x] Search expenses by title
- [x] Search and filter by category at the same time
- [x] Summary cards (total, count, highest expense)
- [x] Bootstrap loading spinner
- [x] Bootstrap success and error alerts
- [x] Clear message when the backend server is unavailable
- [x] Responsive design for mobile and desktop
- [x] Dark Mode with localStorage
- [x] PostgreSQL database integration
## Screenshots
![Desktop Screenshot](screenshots\Readmescreenshot\Desktop.png)

![Mobile Screenshot](screenshots\Readmescreenshot\Mobile.png)

![Edit Modal Screenshot](screenshots\Readmescreenshot\Modal.png)
## What was the hardest part?

The hardest part was connecting the frontend with the backend and making sure the API requests worked correctly. I solved the issues by testing the endpoints and fixing the CORS configuration.
