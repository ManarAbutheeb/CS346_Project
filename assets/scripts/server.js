const express = require('express');
const mongoose = require('mongoose');
const app = express(); // Create Express app

const dbURI = 'mongodb+srv://haifa:<db_password>@cluster0.qhfhd.mongodb.net/';
const PORT = process.env.PORT || 4000; // Correct environment variable

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));
// Start server
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
