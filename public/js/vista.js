// vista.js

// Obtén el inventario almacenado en sessionStorage o inicialízalo si no existe
const inventario = JSON.parse(sessionStorage.getItem('inventario')) || [];

// Función para mostrar el inventario en la tabla de la vista
function mostrarInventarioEnTabla(inventario) {
    const tablaInventario = document.getElementById('tablaInventario');

    // Limpiar la tabla antes de actualizar
    tablaInventario.innerHTML = '';

    // Crear encabezados de la tabla si la tabla está vacía
    if (inventario.length > 0) {
        const headerRow = tablaInventario.insertRow();
        headerRow.insertCell(0).textContent = 'Producto';
        headerRow.insertCell(1).textContent = 'Cantidad';
        headerRow.insertCell(2).textContent = 'Precio';
        headerRow.insertCell(3).textContent = 'Imagen';
        headerRow.insertCell(4).textContent = 'Solicitar';
    }

    // Iterar sobre los productos y actualizar la tabla
    inventario.forEach(item => {
        const row = tablaInventario.insertRow();
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

        // Agregar botón de solicitud
        const solicitarCell = row.insertCell(4);
        const btnSolicitar = document.createElement('button');
        btnSolicitar.textContent = 'Solicitar';
        btnSolicitar.classList.add('acciones');
        btnSolicitar.onclick = () => solicitarProducto(item.producto);
        solicitarCell.appendChild(btnSolicitar);
    });
}

// Función para solicitar un producto desde la vista
function solicitarProducto(nombreProducto) {
    const cantidadSolicitud = parseInt(prompt(`¿Cuántas unidades de "${nombreProducto}" deseas solicitar?`, 1));

    // Validar que la cantidad sea un número positivo
    if (!isNaN(cantidadSolicitud) && cantidadSolicitud > 0) {
        // Puedes implementar aquí la lógica para solicitar el producto
        alert(`Solicitud realizada: ${cantidadSolicitud} unidades de ${nombreProducto}`);
    } else {
        alert('Cantidad no válida. Por favor, ingresa un número mayor a 0.');
    }
}

// Mostrar el inventario en la tabla al cargar la página
mostrarInventarioEnTabla(inventario);
