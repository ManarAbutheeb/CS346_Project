const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://haifa:<db_password>@cluster0.qhfhd.mongodb.net/';
const PORT = process.env.PORT || 4000;
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(" MongoDB Connected"))
.catch(err => console.error(" MongoDB Connection Error:", err));