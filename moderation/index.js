const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const ModerationLog = require('./models/ModerationLog'); // optional

const app = express();
app.use(bodyParser.json());

// ✅ Connect to MongoDB (Docker-ready)
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/microservices";

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB (Moderation Service - optional logging)"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

app.post('/events', async (req, res) => {
  const event = req.body;

  if (event.type === 'commentCreated') {
    const status = event.data.content.includes('orange') ? 'rejected' : 'approved';

    // Optional: log moderated comment to MongoDB
    const log = new ModerationLog({
      commentId: event.data.id,
      postId: event.data.postId,
      content: event.data.content,
      status,
    });
    await log.save();

    try {
      // ✅ Use Docker Event Bus URL
      await axios.post('http://event-bus:8005/events', {
        type: 'commentModerated',
        data: { ...event.data, status }
      });
    } catch (e) {
      console.log("Failed to emit commentModerated event:", e.message);
    }
  }

  res.send({});
});

app.listen(8004, () => {
  console.log('Moderation Service started on http://localhost:8004');
});

