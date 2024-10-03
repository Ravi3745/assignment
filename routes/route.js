const express = require('express');
const Post = require('../models/post');
const Tag = require('../models/tag');
const router = express.Router();
const multer = require('multer');

// Setup Multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to get all posts with sorting, filtering, pagination
router.get('/posts', async (req, res) => {
  const { sortBy, order, keyword, tag, page = 1, limit = 10 } = req.query;

  try {
    let query = {};

    // Filter by keyword in title or description
    if (keyword) {
      query.$or = [
        { title: new RegExp(keyword, 'i') },
        { desc: new RegExp(keyword, 'i') }
      ];
    }

    // Filter by tag
    if (tag) {
      const tagDoc = await Tag.findOne({ name: tag });
      if (tagDoc) {
        query.tags = tagDoc._id;
      }
    }

    // Pagination and Sorting
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy || 'createdAt']: order === 'desc' ? -1 : 1 }
    };

    const posts = await Post.paginate(query, options);
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: 'Invalid query parameters' });
  }
});

// Endpoint to insert a new post
router.post('/posts', upload.single('image'), async (req, res) => {
  const { title, desc, tags } = req.body;
  const image = req.file ? req.file.buffer.toString('base64') : null; // Store image in base64

  try {
    // Process tags
    const tagIds = [];
    for (const tagName of tags) {
      let tag = await Tag.findOne({ name: tagName });
      if (!tag) {
        tag = new Tag({ name: tagName });
        await tag.save();
      }
      tagIds.push(tag._id);
    }

    const newPost = new Post({
      title,
      desc,
      image, // Can be saved as base64 or uploaded to a cloud service
      tags: tagIds
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
