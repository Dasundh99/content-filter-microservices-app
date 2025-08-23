const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

// CORS setup
const corsOptions = {
  origin: "http://localhost:3000", // React app origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight requests

// Connect to MongoDB (with retry for Docker)
const connectWithRetry = () => {
  mongoose.connect("mongodb://mongo:27017/auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("MongoDB connected"))
    .catch(err => {
      console.error("MongoDB connection error, retrying in 5s", err);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

// User model
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const User = mongoose.model("User", UserSchema);

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user to DB
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in DB
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ id: user._id, username }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(8006, () => console.log("Auth service running on port 8006"));

