const express = require("express");
const router = express.Router();
const User = require("../Databases/models/userSchema");

router.get("/", (req, res) => {
  res.status(200).json({ msg: "ALL GOOD" });
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (er) {
    res.send(er);
  }
});

//get one user with username
router.get("/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const matchedUsers = await User.findOne({ username: user });
    if (!matchedUsers || matchedUsers.length === 0) {
      return res.status(401).json("User Not Available");
    }
    res.status(200).json({ users: matchedUsers });
  } catch (er) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//update user with username
router.put("/update/:username", authenticateToken, async (req, res) => {
  try {
    const { Newusername, email, password } = req.body;
    const { username } = req.params;

    const matchedUsers = await User.findOne({ username: username });
    if (!matchedUsers) {
      return res.status(401).json("User Not Available");
    }
    const updatedData = {};
    if (Newusername) updatedData.username = Newusername;
    if (email) updatedData.email = email;
    if (password) updatedData.password = password; // Ideally hash it here

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;
