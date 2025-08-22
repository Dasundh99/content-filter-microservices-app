const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const mongoose = require("mongoose");
const QueryPost = require("./models/Post");

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

// ✅ Connect to MongoDB (Docker-ready)
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/microservices";

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB (Query Service)"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit if DB not reachable
  });

// ✅ Event Handler
async function handleEvents(type, data) {
  switch (type) {
    case "postCreated":
      const post = new QueryPost({ id: data.id, title: data.title, comments: [] });
      await post.save();
      return;

    case "commentCreated":
      await QueryPost.updateOne(
        { id: data.postId },
        { $push: { comments: { id: data.id, content: data.content, status: data.status } } }
      );
      return;

    case "commentUpdated":
      await QueryPost.updateOne(
        { id: data.postId, "comments.id": data.id },
        { $set: { "comments.$.status": data.status, "comments.$.content": data.content } }
      );
      return;

    default:
      return;
  }
}

// ✅ Receive events
app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  await handleEvents(type, data);
  res.status(201).send({});
});

// ✅ Fetch all posts (with comments)
app.get("/posts", async (req, res) => {
  const posts = await QueryPost.find();
  res.status(200).json({ data: posts });
});

// ✅ Debug DB
app.get("/db", async (req, res) => {
  const posts = await QueryPost.find();
  res.status(200).send(`<p>Query Service DB</p><pre>${JSON.stringify(posts, null, "\t")}</pre>`);
});

// ✅ Sync missed events on startup
app.listen(8003, async () => {
  console.log("🚀 Query Service listening on http://localhost:8003");

  try {
    // Use Docker service name for Event Bus
    const { data } = await axios.get("http://event-bus:8005/events");
    for (let event of data) {
      await handleEvents(event.type, event.data);
    }
    console.log("📦 Synced missed events from Event Bus");
  } catch (error) {
    console.error("❌ Failed to fetch events on startup:", error.message);
  }
});

