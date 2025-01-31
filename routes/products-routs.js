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
    res.status(201).json(newProduct);  
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});


router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, branch } = req.body;
  let imageUrl;


  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, quantity, branch, imageUrl: imageUrl || undefined },
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct); 
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' }); // Respond with success message
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;
