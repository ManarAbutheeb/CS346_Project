const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products-routs');  
const Product = require('./models/Product');
const ClientPhoto = require('./models/clients');

const multer = require('multer');
const session = require('express-session'); 
const userRoutes = require('./routes/user-routs');
const clientRoutes = require('./routes/client-routs'); 
require('dotenv').config();  

const mongoURI = "mongodb+srv://manarm018998:vPfyd1z7yzf74spR@cluster0.nbk70.mongodb.net/"; // Your MongoDB URI



mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const app = express();
const port = 4000;

app.use(session({
    secret: process.env.SESSION_SECRET || '1010', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use(express.json());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/login'); 
    }
    res.render('register');
});


app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login');
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.redirect('/login'); 
    });
});


app.use(userRoutes);

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('landing');  
});

app.get('/about', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    res.render('about');  
});

app.get('/shop', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    try {
      const products = await Product.find();
      res.render('shop', { products });  
    } catch (err) {
      res.status(500).json({ message: 'Error fetching products' });
    }
});

app.get('/cart', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    res.render('cart');  
});
app.get('/checkout', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    res.render('checkout');  
});

app.get('/policy', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    res.render('policy');  
});

app.use('/api/client-photos', clientRoutes);

app.get('/modeling', async (req, res) => {
    try {
      const images = await ClientPhoto.find(); // Fetch images from the database, or you can use an array if using static images
      res.render('modeling', { images: images.map(image => image.imageUrl) }); // Pass the image URLs to the template
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).send('Error loading images');
    }
  });
  

app.use('/api/products', productRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
