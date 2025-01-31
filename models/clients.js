const mongoose = require('mongoose');

const clientPhotoSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  }
});

const ClientPhoto = mongoose.model('ClientPhoto', clientPhotoSchema);
module.exports = ClientPhoto;