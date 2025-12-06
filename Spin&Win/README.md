# Spin & Win – Slot Machine Web Application

A full-stack web application built with **Angular**, **Node.js/Express**, and **MongoDB**.  
Spin&Win allows users to register, log in, recharge balance, play a slot machine, track their transaction history, and view a global leaderboard.

---

## 1. Project Overview

SpinWin is designed as a simple but complete full-stack system demonstrating user authentication, protected API routes, database persistence, and Angular frontend integration.  
The system includes:

- User registration and login
- Balance management and recharge
- Slot machine gameplay with dynamic results
- Transaction history (spin and recharge records)
- Leaderboard ranking users based on total winnings
- Protected pages that only logged-in users can access

This README explains how to set up the project from scratch.

---

## 2. Prerequisites

Before running the project, install the following tools:

### Required Software

- **Node.js** (version 18 or higher recommended)
- **npm** (bundled with Node.js)
- **Angular CLI** (version 17+):  
  Install globally using:

  ```
  npm install -g @angular/cli
  ```

- **MongoDB**
  - MongoDB Atlas

### Accounts / Keys Needed

- A **MongoDB connection URI**
- A **JWT secret key** (any secure random string)

---

## 3. Backend Setup (Node.js + Express + MongoDB)

### 3.1 Navigate to the backend folder

```
cd backend
```

### 3.2 Install backend dependencies

```
npm install
```

### 3.3 Environment Variables

Create a file named **.env** inside the backend folder: `Spin&Win/backend/.env`.

Your `.env` file must contain:

```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

### 3.4 Starting the backend server

Run the backend development server:

```
node server.js
```

The backend should start at:

```
http://localhost:5000
```

If successful, you should see a message confirming that the server is running and connected to MongoDB.

---

## 4. Frontend Setup (Angular)

### 4.1 Navigate to the frontend folder

```
cd frontend
```

### 4.2 Install frontend dependencies

```
npm install
```

### 4.3 Start the Angular development server

Run:

```
ng serve
```

The frontend will be available at:

```
http://localhost:4200
```

The app will automatically reload when you modify any frontend files.

---

## 5. Logging In and Using the App

After both servers are running:

1. Open the Angular app in your browser at `http://localhost:4200`
2. Register a new account
3. Log in to access protected pages
4. Recharge your balance (New accounts have `$100` recharged)
5. Spin the slot machine
6. View your transaction history
7. Explore the leaderboard

All gameplay, balance updates, and records are synchronized with your backend database.

---

## 6. Folder Structure

```
root/
│
├── backend/             # Node.js + Express + MongoDB API
│
├── frontend/            # Angular application
│
├── User Guide.pdf/      # A brief guide to walk through the app
|
├── Final Report.pdf/    # Project report and reflection
|
└── README.md            # Project documentation
```

---

## 7. Troubleshooting

### Common issues:

- **Backend cannot connect to MongoDB**

  - Recheck your `MONGO_URI`
  - Ensure IP whitelist is correct (Atlas)
  - Ensure MongoDB service is running (local)

- **Frontend cannot reach backend**

  - Verify backend is running on the correct port
  - Check API URL in Angular service files
  - Ensure CORS is enabled in the backend

- **JWT errors**
  - Check that the token is saved in localStorage
  - Make sure your interceptor is attaching `Authorization: Bearer <token>`

## 8. License

This project is submitted as part of an academic requirement and is intended for educational use.

## 9. Author

Htet Aung Hlaing  
Spin&Win Project – Final Year Coursework
