const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const Post = require("./models/Post");

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: "*" })); // Allow all origins for Docker

// ✅ MongoDB connection (Docker-ready)
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/microservices";

mongoose.connect(mongoUri)
  .then(() => console.log(`✅ Connected to MongoDB (${process.env.SERVICE_NAME || 'Post Service'})`))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // exit if DB not reachable
  });

// Welcome Route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Post Service</h1>");
});

// Create a Post
app.post("/post/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" }).end();
  }

  const post = new Post({ id, title });
  await post.save();

  try {
    await axios.post("http://event-bus:8005/events", { // <-- use Docker service name
      type: "postCreated",
      data: { id, title },
    });
    console.log(`📢 Sent postCreated event for ID: ${id}`);
  } catch (e) {
    console.error("❌ Failed to send event to Event Bus:", e.message);
    return res.status(500).json({ error: "Failed to broadcast event" }).end();
  }

  res.status(201).json({ message: "Post created successfully", data: { id, title } }).end();
});

// Fetch All Posts
app.get("/post", async (req, res) => {
  const posts = await Post.find();
  res.status(200).json({ data: posts }).end();
});

// Debug DB Route
app.get("/db", async (req, res) => {
  const posts = await Post.find();
  res.status(200).send(`
    <p>Post Service DB</p>
    <pre>${JSON.stringify(posts, null, "\t")}</pre>
  `);
});

// Receive Events (for future expansions)
app.post("/events", (req, res) => {
  res.send({}).end();
});

app.listen(8001, () => {
  console.log("🚀 Post Service listening on http://localhost:8001");
});

