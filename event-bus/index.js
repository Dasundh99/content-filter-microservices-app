const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const Event = require('./models/Event');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

// ✅ Connect to MongoDB (Docker-ready)
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/microservices";

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB (Event Bus)"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

app.post('/events', async (req, res) => {
  const event = req.body;

  // Save event to MongoDB
  const newEvent = new Event(event);
  await newEvent.save();

  console.log("Incoming Event:", event.type);

  try {
    // ✅ Use Docker service names for inter-service communication
    await Promise.all([
      axios.post('http://posts-service:8001/events', event),
      axios.post('http://comments-service:8002/events', event),
      axios.post('http://query-service:8003/events', event),
      axios.post('http://moderation-service:8004/events', event),
    ]);
    res.send({}).end();
  } catch (e) {
    console.error(e.message);
    res.status(500).end();
  }
});

// Fetch all events (for service sync)
app.get("/events", async (req, res) => {
  const allEvents = await Event.find();
  res.send(allEvents);
});

app.listen(8005, () => {
  console.log('Event Bus listening on http://localhost:8005');
});

