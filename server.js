// Import dependencies
const express = require("express");
require("dotenv").config(); // Loads variables from .env file
const cors = require("cors");

//custom imports from other files
const connectMongoDB = require("./Databases/Config/dbconfig");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const authenticateToken = require("./middleware");

// Initialize app
const app = express();
// Middleware to parse JSON
// It tells your Express app to automatically parse incoming
//requests with JSON payloads, and make that data available under: req.body
//parses the body of any incoming request with Content-Type: application/json.
app.use(express.json());

// MongoDB connection
connectMongoDB();

app.use(cors());
//to restrict CORS to specific frontend origins:
// app.use(cors({
//   origin: "http://localhost:5173", // your frontend origin
//   credentials: true, // if you're sending cookies
// }));
app.use("/api/users", authenticateToken, userRouter);
app.use("/api/auth", loginRouter);

// Route: Home
app.get("/", (req, res) => {
  res.send("👋 Hello from USERS API");
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
