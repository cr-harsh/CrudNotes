const express = require("express");
const jwt = require("jsonwebtoken");

const { Note } = require("./model");

const router = express.Router();


// Check JWT
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Login required"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();

  } catch {
    res.status(401).json({
      message: "Invalid token"
    });
  }
}


// GET - all notes
router.get("/", auth, async (req, res) => {
  const notes = await Note.find({
    user: req.userId
  }).sort({ createdAt: -1 });

  res.json(notes);
});


// POST - create note
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required"
    });
  }

  const note = await Note.create({
    title,
    content,
    user: req.userId
  });

  res.status(201).json(note);
});


// PUT - update note
router.put("/:id", auth, async (req, res) => {
  const { title, content } = req.body;

  const note = await Note.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.userId
    },
    {
      title,
      content
    },
    {
      new: true
    }
  );

  if (!note) {
    return res.status(404).json({
      message: "Note not found"
    });
  }

  res.json(note);
});


// DELETE - delete note
router.delete("/:id", auth, async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.userId
  });

  if (!note) {
    return res.status(404).json({
      message: "Note not found"
    });
  }

  res.json({
    message: "Note deleted"
  });
});


module.exports = router;