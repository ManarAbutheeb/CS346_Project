const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products-routs');  
const Product = require('./models/Product');
const multer = require('multer');

require('dotenv').config();  

const mongoURI = "mongodb+srv://manarm018998:vPfyd1z7yzf74spR@cluster0.nbk70.mongodb.net/"; // Your MongoDB URI



mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const app = express();
const port = 4000;



app.use(express.json());
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.get('/', (req, res) => {
    res.render('landing');  
});

app.get('/about', (req, res) => {
    res.render('about');  
});

app.get('/shop', async (req, res) => {
    try {
      const products = await Product.find();
      res.render('shop', { products });  // Pass products to the view
    } catch (err) {
      res.status(500).json({ message: 'Error fetching products' });
    }
});

app.get('/cart', (req, res) => {
    res.render('cart');  // Render cart.ejs
});

app.get('/checkout', (req, res) => {
    res.render('checkout');  // Render checkout.ejs
});

app.get('/policy', (req, res) => {
    res.render('policy');  // Render policy.ejs
});


app.use('/api/products', productRoutes);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
