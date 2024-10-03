const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String }, // Can be a URL or base64 string
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
