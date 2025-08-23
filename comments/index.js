const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const Comment = require('./models/Comment');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: '*' })); // Allow all origins for simplicity

// MongoDB connection (Docker-ready)
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/microservices';
mongoose.connect(mongoUri)
  .then(() => console.log(`✅ Connected to MongoDB (${process.env.SERVICE_NAME || 'Comments Service'})`))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit if DB is unreachable
  });

// Routes

// Get comments for a post
app.get('/posts/:id/comments', async (req, res) => {
  const postId = req.params.id;
  const comments = await Comment.find({ postId });
  res.status(200).json(comments);
});

// Create a comment
app.post('/posts/:id/comments', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { content } = req.body;
  const postId = req.params.id;

  const comment = new Comment({ id, content, status: 'pending', postId });
  await comment.save();

  // Emit commentCreated event to Event Bus
  try {
    await axios.post('http://event-bus:8005/events', {
      type: 'commentCreated',
      data: { id, content, status: 'pending', postId },
    });
  } catch (e) {
    console.log("❌ Failed to emit commentCreated event:", e.message);
  }

  res.status(201).json({ message: "Comment created successfully", data: comment });
});

// Receive events
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'commentModerated') {
    const { postId, id, status } = data;
    const comment = await Comment.findOne({ id, postId });

    if (comment) {
      comment.status = status;
      await comment.save();

      // Emit commentUpdated event to Event Bus
      try {
        await axios.post('http://event-bus:8005/events', {
          type: 'commentUpdated',
          data: comment,
        });
      } catch (e) {
        console.log("❌ Failed to emit commentUpdated event:", e.message);
      }
    }
  }

  res.send({});
});

// Optional debug route
app.get('/db', async (req, res) => {
  const comments = await Comment.find();
  res.status(200).send(`
    <p>Comments Service DB</p>
    <pre>${JSON.stringify(comments, null, "\t")}</pre>
  `);
});

// Start server
app.listen(8002, () => {
  console.log('Comments Service listening on http://localhost:8002');
});

