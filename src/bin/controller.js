const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users').User;
const express = require ('express');

// Controlador para el login
exports.login = async (req, res) => {
  try {
    // Obtener el email y la contraseña del cuerpo de la petición
    const { email, password } = req.body;

    // Buscar el usuario por el email
    const user = await User.findOne({ email });
    // Si no existe el usuario, enviar un error
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Comparar la contraseña con la almacenada en la base de datos
    const match = await bcrypt.compare(password, user.password);

    // Si no coincide, enviar un error
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar un token de autenticación con el id del usuario
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar el token como respuesta
    res.json({ token });
  } catch (err) {
    // Enviar un error genérico
    res.status(500).json({ error: 'Algo salió mal' });
  }
};

// Controlador para el registro
exports.register = async (req, res) => {
  try {
    // Obtener el nombre, el email y la contraseña del cuerpo de la petición
    const { name, email, password } = req.body;

    // Validar que no falten datos
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    // Validar que el email sea válido
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Buscar el usuario por el email
    const user = await User.findOne({ email });

    // Si ya existe el usuario, enviar un error
    if (user) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Encriptar la contraseña
    const hash = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario con el nombre, el email y la contraseña encriptada
    const newUser = new User({ name, email, password: hash });

    // Guardar el usuario en la base de datos
    await newUser.save();

    // Enviar una respuesta exitosa
    res.json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    // Enviar un error genérico
    res.status(500).json({ error: 'Algo salió mal' });
  }
};

// Controlador para obtener el perfil del usuario
exports.profile = async (req, res) => {
  try {
    // Obtener el token de autenticación de la cabecera de la petición
    const token = req.headers['authorization'];

    // Si no hay token, enviar un error
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // Verificar el token y obtener el id del usuario
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario por el id
    const user = await User.findById(id);

    // Si no existe el usuario, enviar un error
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Enviar el perfil del usuario como respuesta
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    // Enviar un error genérico
    res.status(500).json({ error: 'Algo salió mal' });
  }
};
