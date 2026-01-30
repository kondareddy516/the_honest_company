const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Models
const Project = require('../models/Project');
const Client = require('../models/Client');
const Contact = require('../models/Contact');
const Subscriber = require('../models/Subscriber');

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- Simple Auth (server-side) ---
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || '23BQ5A0516';

// POST /api/auth/login -> set httpOnly cookie with JWT
router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing credentials' });
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ role: 'admin', user: ADMIN_USER }, JWT_SECRET, { expiresIn: '2h' });
        // httpOnly cookie
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
        return res.json({ message: 'Logged in' });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
});

// GET /api/auth/verify -> verify cookie token
router.get('/auth/verify', (req, res) => {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ ok: true, user: decoded });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

// POST /api/auth/logout -> clear cookie
router.post('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

// --- Projects ---
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/projects', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        const newProject = new Project({ name, description, image });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/projects/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const updateData = { name, description };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/projects/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Clients ---
router.get('/clients', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/clients', upload.single('image'), async (req, res) => {
    try {
        const { name, description, designation } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        const newClient = new Client({ name, description, designation, image });
        await newClient.save();
        res.status(201).json(newClient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/clients/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description, designation } = req.body;
        const updateData = { name, description, designation };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedClient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/clients/:id', async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.json({ message: 'Client deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Contact Form ---
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/contact', async (req, res) => {
    try {
        const { fullName, email, mobile, city } = req.body;
        const newContact = new Contact({ fullName, email, mobile, city });
        await newContact.save();
        res.status(201).json({ message: 'Contact saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Newsletter ---
router.get('/subscribers', async (req, res) => {
    try {
        const subscribers = await Subscriber.find();
        res.json(subscribers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        // Check if exists
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }
        const newSub = new Subscriber({ email });
        await newSub.save();
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
