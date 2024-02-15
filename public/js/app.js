//app.js

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente
    
        // Obtiene los valores de usuario y contraseña del formulario
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Simulamos una solicitud de autenticación al servidor (aquí puedes hacer una solicitud real)
            const isAuthenticated = await authenticateUser(username, password);

            if (isAuthenticated) {
                // Credenciales válidas
                errorMessage.textContent = 'Acceso Permitido'; // Muestra "Acceso Permitido"
                errorMessage.style.color = 'green'; // Establece el color del texto en verde
                errorMessage.style.fontSize = '24px'; // Establece el tamaño de la fuente en 24px
                window.location.href = '/dashboard.html'; // Redirige al usuario a la página de inicio
            } else {
                // Credenciales inválidas
                errorMessage.textContent = 'Acceso Denegado'; // Muestra "Acceso Denegado"
                errorMessage.style.color = 'red'; // Establece el color del texto en rojo
                errorMessage.style.fontSize = '24px'; // Establece el tamaño de la fuente en 24px
            }
        } catch (error) {
            // Error al autenticar
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred. Please try again later.';
        }
    });

    // Función para simular autenticación de usuario (puedes reemplazarla con una solicitud HTTP real)
    async function authenticateUser(username, password) {
        return new Promise((resolve, reject) => {
            // Simula una solicitud de autenticación (puedes reemplazar esto con tu lógica de autenticación real)
            setTimeout(() => {
                if (username === 'admin' && password === 'password') {
                    resolve(true); // Credenciales válidas
                } else {
                    resolve(false); // Credenciales inválidas
                }
            }, 1000); // Simula un retraso de 1 segundo
        });
    }
    function validarCredenciales(username, password) {
        // Realiza la validación de las credenciales del usuario
        if (username.trim() === '' || password.trim() === '') {
            // Si el nombre de usuario o la contraseña están en blanco, muestra un mensaje de error
            errorMessage.textContent = 'Por favor, ingresa el nombre de usuario y la contraseña.';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '16px';
            return false; // Devuelve false para indicar que las credenciales son inválidas
        } else {
            return true; // Devuelve true para indicar que las credenciales son válidas y el formulario debe enviarse
        }
    }

  // Variables globales
  let inventario = [];
  let totalVentas = 0;

  // Obtener el botón "Ver Inventario"
  const verInventarioBtn = document.getElementById('verInventarioBtn');

  // Agregar un evento de clic al botón "Ver Inventario"
  verInventarioBtn.addEventListener('click', function () {
      // Llamar a la función para mostrar el inventario
      verInventario();
  });

  function verInventarioTabla() {
    fetch("/api/inventario")
        .then(response => response.json())
        .then(data => {
            const tablaInventario = document.getElementById("tablaInventario").getElementsByTagName("tbody")[0];
            tablaInventario.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

            data.forEach(producto => {
                const nuevaFila = tablaInventario.insertRow();
                const celdaNombre = nuevaFila.insertCell(0);
                const celdaCantidad = nuevaFila.insertCell(1);
                const celdaPrecio = nuevaFila.insertCell(2);
                const celdaImagen = nuevaFila.insertCell(3); // Agregar celda para imagen
                const celdaAcciones = nuevaFila.insertCell(4); // Agregar celda para acciones

                celdaNombre.textContent = producto.nombre;
                celdaCantidad.textContent = producto.cantidad;
                celdaPrecio.textContent = producto.precio;

                // Mostrar la imagen del producto
                if (producto.imagen) {
                    const imagen = document.createElement("img");
                    imagen.src = producto.imagen;
                    imagen.alt = "Imagen de " + producto.nombre;
                    imagen.style.maxWidth = "100px"; // Ajusta el tamaño de la imagen según sea necesario
                    celdaImagen.appendChild(imagen);
                } else {
                    celdaImagen.innerHTML = "No disponible"; // Si no hay imagen, muestra un mensaje alternativo
                }

                // Agregar acciones
                const btnModificar = document.createElement("button");
                btnModificar.textContent = "Modificar";
                btnModificar.classList.add("btn", "btn-primary", "mr-2");
                btnModificar.onclick = () => mostrarFormularioModificacion(producto.id);
                celdaAcciones.appendChild(btnModificar);

                const btnBorrar = document.createElement("button");
                btnBorrar.textContent = "Borrar";
                btnBorrar.classList.add("btn", "btn-danger");
                btnBorrar.onclick = () => borrarProducto(producto.id);
                celdaAcciones.appendChild(btnBorrar);
            });
        })
        .catch(error => {
            console.error("Error al obtener el inventario:", error);
        });
}




function actualizarTablaInventario(productos = inventario, esVistaCliente = false) {
    const tabla = document.getElementById('tablaInventario');

    // Verificar si la tabla existe en el DOM
    if (!tabla) {
        console.error('La tabla de inventario no se encontró en el DOM');
        return;
    }

    // Limpiar la tabla antes de actualizar
    tabla.innerHTML = '';

    // Crear encabezados de la tabla si la tabla está vacía
    if (productos.length > 0) {
        const headerRow = tabla.insertRow();
        headerRow.insertCell(0).textContent = 'Producto';
        headerRow.insertCell(1).textContent = 'Cantidad';
        headerRow.insertCell(2).textContent = 'Precio';
        headerRow.insertCell(3).textContent = 'Imagen';

        if (!esVistaCliente) {
            // Agregar columna de acciones solo si no es vista de cliente
            headerRow.insertCell(4).textContent = 'Acciones';
        }
    }

    // Iterar sobre los productos y actualizar la tabla
    productos.forEach(item => {
        const row = tabla.insertRow();
        row.insertCell(0).textContent = item.producto;
        row.insertCell(1).textContent = item.cantidad;
        row.insertCell(2).textContent = `$${Number(item.precio).toLocaleString()}`;

        // Agregar imagen a la celda de la tabla
        const imgCell = row.insertCell(3);
        const img = document.createElement('img');
        img.src = item.imagen || 'placeholder.jpg';  // Usar placeholder si no hay imagen
        img.alt = 'Imagen del Producto';
        img.width = 50;  // Ajustar el tamaño de la imagen según sea necesario
        imgCell.appendChild(img);

        if (!esVistaCliente) {
            // Resaltar en rojo si la cantidad es 3 o menor, solo si no es vista de cliente
            if (item.cantidad <= 3) {
                row.classList.add('alerta');
            }

            // Agregar botones de acciones solo si no es vista de cliente
            const accionesCell = row.insertCell(4);
            const btnModificar = document.createElement('button');
            btnModificar.textContent = 'Modificar';
            btnModificar.classList.add('acciones');
            btnModificar.onclick = () => mostrarFormularioModificacion(item.producto);
            accionesCell.appendChild(btnModificar);

            const btnBorrar = document.createElement('button');
            btnBorrar.textContent = 'Borrar';
            btnBorrar.classList.add('acciones');
            btnBorrar.onclick = () => borrarProducto(item.producto);
            accionesCell.appendChild(btnBorrar);
        }
    });
}

    // Función para inicializar la tabla de ventas
    function inicializarTablaVentas() {
        const tablaVentas = document.getElementById('ventasRegistradas');

        // Verificar si la tabla existe antes de intentar modificarla
        if (tablaVentas) {
            // Verificar si la tabla está vacía antes de insertar el encabezado
            if (tablaVentas.getElementsByTagName('tr').length === 0) {
                const headerRow = tablaVentas.insertRow();
                headerRow.insertCell(0).textContent = 'Producto';
                headerRow.insertCell(1).textContent = 'Cantidad Vendida';
                headerRow.insertCell(2).textContent = 'Total Venta';
            }
        }
    }
// ...



// Función para registrar un nuevo producto
// Función para registrar un nuevo producto
async function registrarNuevoProducto() {
    const nombreProductoInput = document.getElementById('modalNombreProducto');
    const cantidadProductoInput = document.getElementById('modalCantidadProducto');
    const precioProductoInput = document.getElementById('modalPrecioProducto');
    const imagenProductoInput = document.getElementById('modalImagenProducto');

    const nombreProducto = nombreProductoInput.value;
    const cantidadProducto = parseInt(cantidadProductoInput.value);
    const precioProducto = parseInt(precioProductoInput.value.replace(/,/g, '')); // Convertir a número eliminando las comas
    const imagenProducto = imagenProductoInput.files[0]; // Obtener el objeto de la imagen

    if (nombreProducto && cantidadProducto > 0 && !isNaN(precioProducto) && precioProducto > 0) {
        // Crear un objeto FormData para enviar los datos del formulario, incluida la imagen
        const formData = new FormData();
        formData.append('producto', nombreProducto);
        formData.append('cantidad', cantidadProducto);
        formData.append('precio', precioProducto);
        formData.append('imagen', imagenProducto);

        try {
            // Realizar la solicitud POST al servidor
            const response = await fetch('/producto', {
                method: 'POST',
                body: formData,
            });

            // Verificar si la respuesta es exitosa
            if (response.ok) {
                // Actualizar la tabla de inventario después de registrar el producto
                verInventarioTabla();
                
                // Mostrar mensaje de confirmación
                alert('El producto se ha registrado exitosamente.');

                // Limpiar campos del formulario después de registrar el producto
                nombreProductoInput.value = '';
                cantidadProductoInput.value = '';
                precioProductoInput.value = '';
                imagenProductoInput.value = '';
            } else {
                // Si hay un error en la respuesta, mostrar un mensaje de error
                const errorMessage = await response.text();
                alert(`Error al guardar el producto: ${errorMessage}`);
            }
        } catch (error) {
            // Si ocurre un error durante la solicitud, mostrar un mensaje de error
            console.error('Error:', error);
            alert('Ocurrió un error al procesar la solicitud');
        }
    } else {
        // Si algún campo del formulario está vacío o es inválido, mostrar un mensaje de alerta
        alert('Por favor, completa todos los campos correctamente.');
    }
}


// Función para borrar un producto
function borrarProducto(nombreProducto) {
    const confirmacion = confirm(`¿Estás seguro de borrar el producto "${nombreProducto}"?`);

    if (confirmacion) {
        // Filtrar el producto a borrar
        inventario = inventario.filter(item => item.producto !== nombreProducto);

        // Actualizar la tabla de inventario
        actualizarTablaInventario();

        // Ocultar el formulario de modificación
        cancelarModificacion();
    }
}


function registrarVenta() {
    // Obtener los valores de los campos de entrada
    const producto = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);

    // Buscar el producto en el inventario
    const productoEncontrado = inventario.find(item => item.producto === producto);

    if (productoEncontrado && cantidad > 0 && cantidad <= productoEncontrado.cantidad) {
        // Actualizar inventario
        productoEncontrado.cantidad -= cantidad;

        // Calcular total de la venta
        const totalVenta = cantidad * productoEncontrado.precio;

        // Calcular la ganancia multiplicando la cantidad por el precio del producto
        const ganancia = cantidad * productoEncontrado.precio;

        // Mostrar la ganancia en grande y en verde
        const gananciaPorVentaElement = document.getElementById('gananciaPorVenta');
        gananciaPorVentaElement.textContent = `$${ganancia.toLocaleString()}`;
        gananciaPorVentaElement.style.fontSize = '24px';
        gananciaPorVentaElement.style.color = ganancia >= 0 ? 'green' : 'red'; // Cambiar a rojo si la ganancia es negativa

        // Actualizar total de ventas acumuladas
        totalVentas += totalVenta;
        document.getElementById('totalVentas').textContent = `$${totalVentas.toLocaleString()}`;

        // Actualizar la tabla de ventas
        const tablaVentas = document.getElementById('ventasRegistradas');
        const row = tablaVentas.insertRow();
        row.insertCell(0).textContent = producto;
        row.insertCell(1).textContent = cantidad;
        row.insertCell(2).textContent = `$${totalVenta.toLocaleString()}`;

        // Actualizar la tabla de inventario y resaltar en rojo si es necesario
        actualizarTablaInventario();

        // Limpiar cajas de entrada
        document.getElementById('producto').value = '';
        document.getElementById('cantidad').value = '';
    } else {
        alert('Producto no encontrado o cantidad no válida');
    }
}


// Función para imprimir factura de venta
function imprimirFactura(venta) {
    // Aquí puedes construir el formato de la factura, por ejemplo:
    const factura = `
      Factura de Venta
  
      Producto: ${venta.producto}
      Cantidad: ${venta.cantidad}
      Precio Unitario: $${venta.precio}
      Total: $${venta.cantidad * venta.precio}
  
      Gracias por tu compra!
    `;
  
    // Muestra la factura en una ventana de impresión
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write('<html><head><title>Factura de Venta</title></head><body>');
    ventanaImpresion.document.write(`<pre>${factura}</pre>`);
    ventanaImpresion.document.write('</body></html>');
  
    // Espera a que se cargue el contenido y luego imprime
    ventanaImpresion.document.addEventListener('DOMContentLoaded', () => {
      ventanaImpresion.print();
    });
  }
  
// Función para buscar un producto en el inventario
function buscarProducto() {
    const buscadorInput = document.getElementById('buscador');
    const filtro = buscadorInput.value.toLowerCase();

    const productosFiltrados = inventario.filter(item => item.producto.toLowerCase().includes(filtro));

    // Actualizar la tabla de inventario con los productos filtrados
    actualizarTablaInventario(productosFiltrados);
}

// Función para borrar un producto
function borrarProducto(nombreProducto) {
    const confirmacion = confirm(`¿Estás seguro de borrar el producto "${nombreProducto}"?`);

    if (confirmacion) {
        // Filtrar el producto a borrar
        inventario = inventario.filter(item => item.producto !== nombreProducto);

        // Actualizar la tabla de inventario
        actualizarTablaInventario();

        // Ocultar el formulario de modificación
        cancelarModificacion();
    }
}

// Función para modificar un producto
function modificarProducto() {
    const nombreProductoMod = document.getElementById('nombreProductoMod').value;
    const cantidadProductoMod = parseInt(document.getElementById('cantidadProductoMod').value);
    const precioProductoMod = parseInt(document.getElementById('precioProductoMod').value.replace(/,/g, ''));

    // Buscar el producto en el inventario
    const productoEncontrado = inventario.find(item => item.producto === nombreProductoMod);

    if (productoEncontrado) {
        // Modificar el producto
        productoEncontrado.cantidad = cantidadProductoMod;
        productoEncontrado.precio = precioProductoMod;

        // Actualizar la tabla de inventario
        actualizarTablaInventario();
        cancelarModificacion();
    } else {
        alert('Producto no encontrado');
    }
}

// Función para cancelar la modificación
function cancelarModificacion() {
    document.getElementById('formularioModificacion').style.display = 'none';
}

// Función para mostrar el formulario de modificación
function mostrarFormularioModificacion(nombreProducto) {
    const productoEncontrado = inventario.find(item => item.producto === nombreProducto);

    if (productoEncontrado) {
        document.getElementById('nombreProductoMod').value = productoEncontrado.producto;
        document.getElementById('cantidadProductoMod').value = productoEncontrado.cantidad;
        document.getElementById('precioProductoMod').value = productoEncontrado.precio;
        document.getElementById('formularioModificacion').style.display = 'block';
    } else {
        alert('Producto no encontrado');
    }
}

// Inicializar las tablas al cargar la página
actualizarTablaInventario(inventario, true);
inicializarTablaVentas();


});

