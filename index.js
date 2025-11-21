require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Mentor = require("./models/Mentor");
const CodingQuestion = require("./models/CodingQuestion");
const Job = require("./models/Job");
const User = require("./models/User");
const UserDetails = require("./models/UserDetails");
const Announcement = require("./models/Announcement");

const app = express();
app.use(express.json());
app.use(cors());

const InitializeDbAndServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("❌ Error:", err.message);
    process.exit(1);
  }
};


app.get("/mentors-details", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.send(mentors);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/add-mentor", async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).send({ message: "Mentor added successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.get("/coding-questions", async (req, res) => {
  try {
    const questions = await CodingQuestion.find();
    res.send(questions);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/add-coding-question", async (req, res) => {
  try {
    const question = new CodingQuestion(req.body);
    await question.save();
    res.status(201).send({ message: "Coding question added" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.send(jobs);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/add-jobs", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).send({ message: "Job added successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.post("/add-users", async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).send({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
      mentor_username: req.body.mentor_username
    });

    await UserDetails.create({
      username,
      full_name: req.body.full_name,
      address: req.body.address,
      phone: req.body.phone,
      photo: req.body.photo,
      highest_study: req.body.highest_study,
      college: req.body.college,
      graduation_year: req.body.graduation_year,
      expertise: req.body.expertise
    });

    res.status(201).send({ message: "User added successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json(username);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/frontend-user-details", async (req, res) => {
  try {
    const details = await UserDetails.findOne({ username: req.body.username });
    if (!details) return res.status(404).send({ message: "Not found" });
    res.send(details);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.get("/announcements", async (req, res) => {
  try {
    const list = await Announcement.find();
    res.send(list);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/add-announcements", async (req, res) => {
  try {
    await Announcement.create(req.body);
    res.status(201).send({ message: "Announcement added" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

InitializeDbAndServer();
