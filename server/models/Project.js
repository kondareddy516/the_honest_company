const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true } // Path to image
});

module.exports = mongoose.model('Project', ProjectSchema);
