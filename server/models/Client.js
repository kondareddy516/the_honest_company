const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  designation: { type: String, required: true },
  // Store image binary in MongoDB with content type
  image: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Client", ClientSchema);
