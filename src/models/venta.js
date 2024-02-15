// Importa el modelo Venta si estás trabajando en un entorno de frontend
import { Venta } from './models'; 

// Datos de la venta a registrar
const ventaData = {
  producto: 'Nombre del Producto',
  cantidad: 5,
  totalVenta: 100,
};

// Crear una nueva instancia del modelo Venta con los datos
const nuevaVenta = new Venta(ventaData);

// Guardar la venta en la base de datos
nuevaVenta.save((err) => {
  if (err) {
    console.error('Error al guardar la venta:', err);
  } else {
    console.log('Venta registrada exitosamente');
  }
});
