const express = require('express');
const router = express.Router(); // Utilizar express.Router() para crear un enrutador
const Producto = require('../models/producto');

// Cambiar la ruta de la solicitud POST para crear un nuevo producto
router.post('/producto', async (req, res) => {
  try {
    // Verificar que los campos requeridos están presentes en el cuerpo de la solicitud
    if (!req.body.producto || !req.body.cantidad || !req.body.precio) {
      return res.status(400).json({ error: 'Los campos producto, cantidad y precio son requeridos.' });
    }

    // Extraer los datos del cuerpo de la solicitud
    const { producto, cantidad, precio, imagen } = req.body;

    // Crear un nuevo objeto Producto
    const nuevoProducto = new Producto({ producto, cantidad, precio, imagen });

    // Guardar el nuevo producto en la base de datos
    await nuevoProducto.save();

    // Responder con el nuevo producto creado
    res.status(201).json(nuevoProducto);
  } catch (error) {
    // Manejar errores
    console.error('Error al crear un nuevo producto:', error);
    res.status(500).send('Error interno del servidor al crear un nuevo producto');
  }
});

// Exportar el enrutador para que pueda ser utilizado en otra parte de tu aplicación
module.exports = router;
