const express = require("express");
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });


router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, quantity, branch} = req.body;
    const imageUrl = `/uploads/${req.file.filename}`; 
    const newProduct = new Product({
      name,
      price,
      quantity,
      branch,
      imageUrl
    });

    await newProduct.save();
    res.status(201).json(newProduct);  // Respond with the newly created product
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});



module.exports = router;
