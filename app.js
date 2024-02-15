// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./src/bin/router');
const corsOptions = require('./cors-config');  // Importa la configuración CORS
const cors = require('cors');
const dotenv = require('dotenv');
const Producto = require('./src/models/producto'); // Importa el modelo de Producto
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Configuración de CORS para permitir solicitudes desde localhost
// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Configurar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos
const mongoUrl = process.env.MONGO_URL;

// Configurar opciones de conexión de Mongoose
const mongooseOptions = {};

// Llamar una sola vez a la función connect
mongoose.connect(mongoUrl, mongooseOptions)
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error de conexión a la base de datos:', error);
  });

// Manejar eventos de conexión
mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a la base de datos:', err);
});


// Rutas
app.use('/api', routes);

// Permitir CORS para la impresión de facturas
app.use('/api/facturas', cors());

// Configuración para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));


// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});


app.get('/api/inventario', async (req, res) => {
  try {
      const inventario = await Producto.find();
      res.json(inventario);
  } catch (error) {
      console.error('Error al obtener el inventario:', error);
      res.status(500).send('Error interno del servidor al obtener el inventario');
  }
});

// Ruta para manejar las solicitudes POST para crear un nuevo producto
app.post('/producto', async (req, res) => {
  try {
    const { producto, cantidad, precio, imagen } = req.body;
    const nuevoProducto = new Producto({ producto, cantidad, precio, imagen });
    await nuevoProducto.save();
    // Envía una respuesta con el producto guardado
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear un nuevo producto:', error);
    res.status(500).send('Error interno del servidor al crear un nuevo producto');
  }
});





// Manejo de errores (colocado después de las rutas)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocurrió un error en el servidor');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;
