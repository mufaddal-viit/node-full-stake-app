## 🚀 JWT Auth API with Node.js, Express, MongoDB & React

This project is a full-stack implementation of user authentication using Node.js, Express, JWT, and MongoDB on the backend, with a React frontend to consume the API.

It includes:
Register/Login using JWT
Protected routes with token verification
User update and deletion
Token-based logout
Demo react app which uses Context API to manage authentication state.

## 🔐 API Features
Auth (/auth)
POST /auth/register – Create a new user
POST /auth/login – Authenticate user and return JWT
POST /auth/logout – Invalidate client-side token (stateless)
GET /auth/protected – Demo protected route (requires token)
Users (/api/users) – Protected
GET /api/users – Get all users (JWT required)
GET /api/users/:username – Get user by username
PUT /api/users/update/:username – Update user info
DELETE /api/users/delete – Delete currently authenticated user

## 🔑 JWT Authentication
JWT tokens are issued on successful login
Tokens are stored and sent via headers:
Authorization: Bearer <token>
Middleware authenticateToken protects sensitive routes
Tokens expire (configurable via expiresIn)

## 🔐 React Auth Flow
Manage the token and auth state using React Context API. A complete example is outlined in our documentation and includes:
AuthProvider
useAuth hook
login, logout, isAuthenticated

Token persistence with localStorage

## 🛡 Security Best Practices Implemented
Passwords are hashed using bcryptjs
Tokens expire after configurable time (1h, 2m, etc.)
Sensitive routes are protected using middleware
Environment variables for secrets (.env)

## 📌 Future Improvements
Refresh token implementation
Role-based authorization (e.g., admin vs user)
Email verification
Password reset via email
Rate limiting and brute-force protection


#Thank you :)
