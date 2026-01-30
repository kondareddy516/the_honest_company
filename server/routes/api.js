const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Models
const Project = require("../models/Project");
const Client = require("../models/Client");
const Contact = require("../models/Contact");
const Subscriber = require("../models/Subscriber");

// Multer Config - use memory storage so uploaded files are available as buffers to store in MongoDB
const storage = multer.memoryStorage();
// Limit uploaded image file size to 5MB to avoid excessive memory usage
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// --- Simple Auth (server-side) ---
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "23BQ5A0516";

// POST /api/auth/login -> set httpOnly cookie with JWT
router.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing credentials" });
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: "admin", user: ADMIN_USER }, JWT_SECRET, {
      expiresIn: "2h",
    });
    // httpOnly cookie
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    return res.json({ message: "Logged in" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// GET /api/auth/verify -> verify cookie token
router.get("/auth/verify", (req, res) => {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ ok: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// POST /api/auth/logout -> clear cookie
router.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// --- Projects ---
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    // Convert image field to a URL for the client (supports both new binary storage and legacy '/uploads/...' strings)
    const projectsMapped = projects.map((p) => {
      const obj = p.toObject();
      if (obj.image) {
        if (obj.image.data) {
          obj.image = `/api/projects/${obj._id}/image`;
        } else if (typeof obj.image === "string") {
          // legacy path (e.g., /uploads/...) - leave as-is
        } else {
          obj.image = "";
        }
      } else {
        obj.image = "";
      }
      return obj;
    });
    res.json(projectsMapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/projects", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    let imageData = null;
    if (req.file) {
      imageData = { data: req.file.buffer, contentType: req.file.mimetype };
    }
    const newProject = new Project({ name, description, image: imageData });
    await newProject.save();
    const obj = newProject.toObject();
    obj.image = imageData ? `/api/projects/${obj._id}/image` : "";
    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/projects/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const updateData = { name, description };
    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    const obj = updatedProject.toObject();
    if (obj.image && obj.image.data) {
      obj.image = `/api/projects/${obj._id}/image`;
    } else if (typeof obj.image === "string") {
      // keep existing path
    } else {
      obj.image = "";
    }
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve project image bytes
router.get("/projects/:id/image", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || !project.image || !project.image.data) {
      return res.status(404).send("Image not found");
    }
    res.contentType(project.image.contentType);
    res.send(project.image.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Clients ---
router.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find();
    const clientsMapped = clients.map((c) => {
      const obj = c.toObject();
      if (obj.image) {
        if (obj.image.data) {
          obj.image = `/api/clients/${obj._id}/image`;
        } else if (typeof obj.image === "string") {
          // legacy path - leave as-is
        } else {
          obj.image = "";
        }
      } else {
        obj.image = "";
      }
      return obj;
    });
    res.json(clientsMapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/clients", upload.single("image"), async (req, res) => {
  try {
    const { name, description, designation } = req.body;
    let imageData = null;
    if (req.file) {
      imageData = { data: req.file.buffer, contentType: req.file.mimetype };
    }
    const newClient = new Client({
      name,
      description,
      designation,
      image: imageData,
    });
    await newClient.save();
    const obj = newClient.toObject();
    obj.image = imageData ? `/api/clients/${obj._id}/image` : "";
    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/clients/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, designation } = req.body;
    const updateData = { name, description, designation };
    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    const obj = updatedClient.toObject();
    if (obj.image && obj.image.data) {
      obj.image = `/api/clients/${obj._id}/image`;
    } else if (typeof obj.image === "string") {
      // keep existing path
    } else {
      obj.image = "";
    }
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve client image bytes
router.get("/clients/:id/image", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client || !client.image || !client.image.data) {
      return res.status(404).send("Image not found");
    }
    res.contentType(client.image.contentType);
    res.send(client.image.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/clients/:id", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Contact Form ---
router.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/contact", async (req, res) => {
  try {
    const { fullName, email, mobile, city } = req.body;
    const newContact = new Contact({ fullName, email, mobile, city });
    await newContact.save();
    res.status(201).json({ message: "Contact saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Newsletter ---
router.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    // Check if exists
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }
    const newSub = new Subscriber({ email });
    await newSub.save();
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multer error handler for upload limit and other multer-specific errors
router.use((err, req, res, next) => {
  if (err && err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Max size is 5MB." });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
