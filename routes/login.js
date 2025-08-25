const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config(); // Loads variables from .env file

//imports from other files
const User = require("../Databases/models/userSchema");
const authenticateToken = require("../middleware");
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is not set in the .env file!");
  process.exit(1); // Stop the server if secret is missing
}

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const passmatch = await bcrypt.compare(password, user.password);
  if (!passmatch)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" } // optional: token expires in 1 hour
  );

  res.json({ token });
});

// POST /register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: Protected (requires token)
router.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: "🔒 This is protected data",
    user: req.user,
  });
});

//logout

router.post("/logout", authenticateToken, (req, res) => {
  // If you're storing tokens in a DB for blacklisting, remove it here
  // Otherwise, just instruct client to delete token
  jwt.
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
