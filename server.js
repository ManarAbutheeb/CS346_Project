const express = require('express');
const path = require('path');
const app = express();
const port = 4000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Set the directory for EJS views
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'assets', 'styles')));
app.use(express.static(path.join(__dirname, 'assets','img')));


app.get('/', (req, res) => {
    res.render('landing');  // Assuming 'landing' is your EJS file
});


app.get('/about', (req, res) => {
    res.render('about');  
});


app.get('/shop', (req, res) => {
    res.render('shop'); 
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



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});