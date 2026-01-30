const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String,
  }, // Image stored in MongoDB as binary
});

module.exports = mongoose.model("Project", ProjectSchema);
