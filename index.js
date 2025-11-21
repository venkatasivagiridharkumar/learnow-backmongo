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
    const mentor = new Mentor({
      ...req.body,
      joined_date: new Date(),  
    });

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



app.get("/frontend-coding-questions", async (req, res) => {
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


app.get("/frontend-jobs", async (req, res) => {
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



app.delete("/delete-jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Job.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).send({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully", deletedId: id });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.post("/add-users", async (req, res) => {
  try {
    const { username, password, mentor_username } = req.body;
const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).send({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

     await User.create({
      username,
      password: hashedPassword,
      mentor_username: mentor_username,
    });

    const {
      full_name = "",
      address = "",
      phone = "",
      photo = "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Images-HD.png",
      highest_study = "",
      college = "",
      graduation_year = 2026,
      expertise = "",
      joined_date = new Date()
    } = req.body;

    await UserDetails.create({
      username,
      full_name,
      address,
      phone,
      photo,
      highest_study,
      college,
      graduation_year,
      expertise,
      joined_date
    });

    res.status(201).send({
      message: "User added successfully",
      username,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck)
      return res.status(401).json({ message: "Invalid password" });

    res.status(200).json(username);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.get("/user-details", async (req, res) => {
  try {
    const list = await UserDetails.find();
    res.send(list);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.post("/frontend-user-details", async (req, res) => {
  try {
    const { username } = req.body;
    const details = await UserDetails.findOne({ username });

    if (!details) {
      return res.status(404).json({ message: "User details not found" });
    }

    res.json(details);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/frontend-mentor-details", async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });
    if (!user || !user.mentor_username) {
      return res
        .status(404)
        .json({ message: "Mentor not found for this user" });
    }

    const mentor = await Mentor.findOne({
      username: user.mentor_username,
    });

    if (!mentor) {
      return res
        .status(404)
        .json({ message: "Mentor not found for this user" });
    }

    res.json({
      user_username: user.username,
      mentor_username: mentor.username,
      mentor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/update-user-details", async (req, res) => {
  try {
    const {
      username,
      full_name,
      address,
      phone,
      photo,
      highest_study,
      college,
      graduation_year,
      expertise,
    } = req.body;

    await UserDetails.updateOne(
      { username },
      {
        $set: {
          full_name,
          address,
          phone,
          photo,
          highest_study,
          college,
          graduation_year,
          expertise,
        },
      }
    );

    res.send({ message: "User Details Updated Successfully." });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.post("/frontend-update-user-details", async (req, res) => {
  try {
     const { username } = req.body;
    const {
      full_name,
      address,
      phone,
      photo,
      highest_study,
      college,
      graduation_year,
      expertise,
    } = req.body;

    await UserDetails.updateOne(
      { username },
      {
        $set: {
          full_name,
          address,
          phone,
          photo,
          highest_study,
          college,
          graduation_year,
          expertise,
        },
      }
    );

    res.send({ message: "User Details Updated Successfully." });
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

app.get("/frontend-announcements", async (req, res) => {
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
    res.status(201).send({ message: "Announcement Added Successfully." });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.delete("/delete-announcements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Announcement.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).send({ message: "Announcement not found" });
    }

    res.status(200).send({ message: "Announcement Deleted Successfully." });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

InitializeDbAndServer();
