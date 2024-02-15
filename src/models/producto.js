// productoModel.js
const mongoose = require('mongoose');

// Define the Producto schema
const productoSchema = new mongoose.Schema({
  producto: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String } // Assuming the image file name is stored as a string
});

// Create the Producto model
const Producto = mongoose.model('Producto', productoSchema);

// Export the model
module.exports = Producto;
