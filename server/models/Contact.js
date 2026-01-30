const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    city: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);
