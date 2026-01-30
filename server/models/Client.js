const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, required: true } // Path to image
});

module.exports = mongoose.model('Client', ClientSchema);
