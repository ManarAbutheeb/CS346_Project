const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ClientPhoto = require('../models/clients');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/client-photos/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });


router.post('/upload', upload.single('imageUrl'), async (req, res) => {
  try {
    const imageUrl = `/uploads/client-photos/${req.file.filename}`;

    const newPhoto = new ClientPhoto({ imageUrl }); 
    await newPhoto.save();

    res.status(201).json(newPhoto); 
  } catch (error) {
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
});

module.exports = router;
