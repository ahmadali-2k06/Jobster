# Jobster - Job Application Tracker

## Description

Jobster is a full-stack web application designed to help users track their job applications. It provides a dashboard to add, edit, and view job applications, as well as a stats page to visualize application status. This project is built with Node.js, Express, and MongoDB on the backend, using EJS for server-side rendering, and vanilla JavaScript (ES6+) on the client-side. It also features a secure JWT-based authentication system with refresh tokens.

-----

## Features

  * **User Authentication**: Secure user registration and login system.
  * **JWT Authentication**: Uses JSON Web Tokens (Access and Refresh tokens) for session management. Refresh tokens are stored in `HttpOnly` cookies for security.
  * **CRUD Operations**: Users can Create, Read, Update, and Delete their job applications.
  * **Statistics Dashboard**: Dynamically generated charts (using Chart.js) and statistics to visualize job application status (e.g., pending, interview, declined) and monthly application trends.
  * **Search and Filtering**: Users can search for specific jobs and filter them by status, type, and sort order.
  * **User Profile**: Users can view and update their profile information (name, email, location).
  * **Demo User**: A "Demo User" feature allows users to explore the application with read-only permissions, preventing any changes to the database.
  * **Responsive Design**: A clean, responsive UI that works on both desktop and mobile devices.

-----

## Folder Structure

```
├── controllers/
│   ├── auth.js         # Handles registration, login, logout, and token refresh logic
│   ├── jobs.js         # Handles all CRUD logic for jobs and stats generation
│   └── user.js         # Handles user profile updates and retrieval
├── db/
│   └── connect.js      # Configures and connects to the MongoDB database
├── errors/
│   ├── AuthenticationError.js # Custom 401 Unauthorized error
│   ├── BadRequestError.js     # Custom 400 Bad Request error
│   ├── CustomError.js         # Base custom error class
│   └── NotFoundError.js       # Custom 404 Not Found error
├── middlewares/
│   ├── authentication.js # Verifies JWT access tokens for protected routes
│   ├── blockdemoWrites.js # Prevents demo user from making changes (POST, PATCH, DELETE)
│   └── errorHandler.js   # Global error handling middleware
├── models/
│   ├── job.js          # Mongoose schema for Jobs
│   └── user.js         # Mongoose schema for Users (with password hashing)
├── public/
│   ├── assets/
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   └── mainImage.svg
│   ├── chart.umd.min.js  # Chart.js library
│   ├── dashboard.css   # Styles for the main application dashboard
│   ├── dashboard.html  # (Note: This file appears to be a static HTML version, the app uses dashboard.ejs)
│   ├── dashboard.js    # Client-side JavaScript for dashboard interactivity (fetching data, chart.js)
│   ├── helpers/
│   │   └── getAccessToken.js # Client-side helper for handling JWT access tokens and refresh logic
│   ├── login.css       # Styles for the login/register page
│   ├── login.js        # Client-side JavaScript for login/register/demo functionality
│   └── style.css       # Styles for the landing page
├── routes/
│   ├── api/
│   │   ├── auth.js         # Defines authentication routes (/register, /login, etc.)
│   │   ├── jobs.js         # Defines API routes for jobs (CRUD, stats)
│   │   ├── refreshToken.js # Defines route for refreshing access tokens
│   │   └── user.js         # Defines API routes for user operations
│   └── views/
│       ├── dashboard.js  # Defines view route for the main dashboard page
│       ├── landingPage.js# Defines view route for the home page
│       └── login.js      # Defines view route for the login/register page
├── views/
│   ├── dashboard.ejs   # EJS template for the main application dashboard
│   ├── home.ejs        # EJS template for the landing page
│   └── login.ejs       # EJS template for the login/register page
├── .gitignore          # Specifies files to be ignored by Git (e.g., node_modules, .env)
├── app.js              # Main server file (entry point)
├── jobs.json           # Sample data for populating the database
├── package.json        # Project metadata and dependencies
└── populateDB.js       # Script to populate the database with sample data
```

-----

## Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ahmadali-2k06/jobster.git
    cd jobster
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables:

    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET_ACCESS=your_access_token_secret
    JWT_SECRET_REFRESH=your_refresh_token_secret
    ```

      * `MONGO_URI`: Your connection string for a MongoDB database.
      * `JWT_SECRET_ACCESS`: A long, random string for signing access tokens.
      * `JWT_SECRET_REFRESH`: A different long, random string for signing refresh tokens.

4.  **(Optional) Populate the database with sample data:**
    This will delete all existing jobs associated with the demo user and add the jobs from `jobs.json`.

    ```bash
    node populateDB.js
    ```

5.  **Run the application:**

    ```bash
    npm start
    ```

The application will be running on `http://localhost:5000`.
