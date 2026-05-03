const User = require("../models/User");
console.log("User model:", User);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    console.log("User model:", User);

    // 🔥 ADD THIS
    const mongoose = require("mongoose");
    console.log("readyState:", mongoose.connection.readyState);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const normalizedRole = role && role.toString().toLowerCase() === "admin" ? "admin" : "user";

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role: normalizedRole,
    });

    const safeUser = newUser.toObject();
    delete safeUser.password;

    res.status(201).json(safeUser);

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};