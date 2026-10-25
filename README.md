
# Authentication System

## Project Overview
A web-based authentication system that allows users to register, log in, access a protected profile, and log out securely.

## Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MySQL
- bcrypt
- JSON Web Token (JWT)

## Features
- User registration with username, email, and password
- Password hashing using bcrypt
- Login with credential validation
- JWT-based authentication
- Protected profile route
- Logout with revoked-token checking
- Responsive registration and login pages

## Database Setup
1. Create a MySQL database named `authentication_db`.
2. Create a `users` table with username, email, password_hash, and created_at fields.
3. Create a `revoked_tokens` table for revoked token hashes and expiry times.

## Installation
1. Install Node.js and MySQL.
2. Open the project folder in VS Code.
3. Run:

   npm install

4. Create a `.env` file in the project root with your own values:

   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your_long_random_secret

5. Start the server:

   node server.js

6. Open http://localhost:3000/register.html

## API Endpoints
- POST /register — Register a new user
- POST /login — Log in and receive a JWT
- GET /profile — Access a protected profile
- POST /logout — Revoke the current JWT

## Security Notes
- Passwords are hashed using bcrypt.
- SQL queries use parameterized values.
- JWTs expire after one hour.
- The `.env` file must not be uploaded to GitHub.
- This is a learning project; production applications need additional security controls.
