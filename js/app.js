// Array para almacenar los productos seleccionados
let carrito = [];

// Función para agregar un producto al carrito
function agregarAlCarrito(nombreProducto, cantidad, precio) {
    const producto = {
        nombre: nombreProducto,
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio),
        subtotal: parseFloat(cantidad) * parseFloat(precio)
    };

    carrito.push(producto);
    guardarCarritoEnStorage(); // Guardar carrito en el almacenamiento local
    actualizarTablaProductos();
    actualizarTotal();
}

// Función para actualizar el total en la tabla de productos
function actualizarTotal() {
    const total = carrito.reduce((sum, producto) => sum + producto.subtotal, 0);
    const filaTotal = document.getElementById('filaTotal');

    // Verificar si hay productos en el carrito
    if (carrito.length > 0) {
        filaTotal.innerHTML = `
        <td colspan="2" class="text-end fw-bold">Total:</td>
        <td>$${total.toFixed(2)}</td>
    `;
        filaTotal.style.display = 'table-row'; // Mostrar la fila del total
    } else {
        filaTotal.style.display = 'none'; // Ocultar la fila del total si no hay productos
    }
}

// Función para actualizar la tabla de productos en el HTML
function actualizarTablaProductos() {
    const tablaProductos = document.getElementById('tablaBody');
    tablaProductos.innerHTML = ''; // Limpiar contenido actual

    // Crear filas de productos
    carrito.forEach((producto) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.subtotal.toFixed(2)}</td>
        `;
        tablaProductos.appendChild(fila);
    });

    actualizarTotal();
}

// Función para guardar el carrito en el almacenamiento local
function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para obtener el carrito del almacenamiento local
function obtenerCarritoDeStorage() {
    const carritoJSON = localStorage.getItem('carrito');
    if (carritoJSON) {
        carrito = JSON.parse(carritoJSON);
        actualizarTablaProductos();
    }
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnStorage();
    actualizarTablaProductos();
}

// Agregar evento de click al botón "Vaciar Carrito"
const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');
btnVaciarCarrito.addEventListener('click', vaciarCarrito);

// Función para manejar el evento de agregar al carrito
function handleAgregarCarrito(event) {
    const card = event.target.closest('.card');
    const nombreProducto = card.querySelector('.card-title').innerText;
    const cantidad = card.querySelector('select').value;
    const precio = card.querySelector('.card-text').innerText.slice(1);

    agregarAlCarrito(nombreProducto, cantidad, precio);
}

// Agregar evento de click a todos los botones "Agregar al carrito"
const botonesAgregar = document.querySelectorAll('.card .btn');
botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', handleAgregarCarrito);
});

// Al cargar la página, obtener el carrito del almacenamiento local
document.addEventListener('DOMContentLoaded', obtenerCarritoDeStorage);


