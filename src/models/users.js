// requiere mongoose
const express = require('express');
const mongoose = require("mongoose");

// define el esquema de usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // puedes añadir otros campos que necesites, como email, nombre, rol, etc.
});

// define los métodos para cifrar y comparar la contraseña
// ...

// crea el modelo de usuario
const User = mongoose.model("User", userSchema);


const productoSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true },
    producto: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precio: { type: Number, required: true },
    imagen: String,
});

module.exports = mongoose.model('Producto', productoSchema);

// exporta el modelo de usuario
module.exports = User;
