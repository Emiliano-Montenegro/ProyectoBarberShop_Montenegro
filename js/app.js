// Array para almacenar los productos seleccionados
let carrito = [];

// Función para agregar un producto al carrito
function agregarAlCarrito(nombreProducto, cantidad, precio) {
    const productoExistente = carrito.find(producto => producto.nombre === nombreProducto);

    if (productoExistente) {
        // Actualizar cantidad y subtotal del producto existente
        productoExistente.cantidad += parseInt(cantidad);
        productoExistente.subtotal = productoExistente.cantidad * parseFloat(precio);
    } else {
        // Agregar nuevo producto al carrito
        const producto = {
            nombre: nombreProducto,
            cantidad: parseInt(cantidad),
            precio: parseFloat(precio),
            subtotal: parseFloat(cantidad) * parseFloat(precio)
        };
        carrito.push(producto);
    }

    guardarCarritoEnStorage(); // Guardar carrito en el almacenamiento local
    actualizarTablaProductos();
    actualizarTotal();
}

// Función para actualizar la tabla de productos
function actualizarTablaProductos() {
    const tablaProductos = document.getElementById('tablaBody');
    tablaProductos.innerHTML = '';

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

    // Calcular y agregar fila del total
    const filaTotal = document.createElement('tr');
    const total = carrito.reduce((acumulador, producto) => acumulador + producto.subtotal, 0);
    filaTotal.innerHTML = `
        <td><strong>Total</strong></td>
        <td></td>
        <td><strong>$${total.toFixed(2)}</strong></td>
    `;
    tablaProductos.appendChild(filaTotal);
}

// Función para actualizar el total de los productos en el carrito
function actualizarTotal() {
    const totalElemento = document.getElementById('total');
    const total = carrito.reduce((acumulador, producto) => acumulador + producto.subtotal, 0);
    totalElemento.innerText = `$${total.toFixed(2)}`;
}

// Función para guardar el carrito en el almacenamiento local
function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para obtener los productos del archivo "productos.json" usando fetch
function obtenerProductos() {
    return fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            carrito = data;
            actualizarTablaProductos();
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
        });
}

// Función para vaciar el carrito
function vaciarCarrito() {
    // Mostrar alerta de confirmación utilizando SweetAlert2
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminarán todos los productos del carrito.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Vaciar el carrito si el usuario confirma la acción
            carrito = [];
            guardarCarritoEnStorage();
            actualizarTablaProductos();

            // Mostrar una alerta de éxito después de vaciar el carrito
            Swal.fire('Carrito vaciado', 'El carrito ha sido vaciado correctamente.', 'success');
        }
    });
}

// Agregar evento de clic al botón "Vaciar Carrito"
const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');
btnVaciarCarrito.addEventListener('click', vaciarCarrito);

// Agregar evento de clic al botón "Finalizar Compra"
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
btnFinalizarCompra.addEventListener('click', finalizarCompra);

// Función para finalizar la compra
function finalizarCompra() {
    // Mostrar alerta de confirmación utilizando SweetAlert2
    Swal.fire({
        title: '¿Deseas finalizar la compra?',
        text: 'Una vez finalizada la compra, no podrás agregar más productos al carrito.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, finalizar compra',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Compra finalizada', '¡Gracias por tu compra!', 'success');
        }
    });
}

// Función para manejar el evento de agregar al carrito
function handleAgregarCarrito(event) {
    const card = event.target.closest('.card');
    const nombreProducto = card.querySelector('.card-title').innerText;
    const cantidad = card.querySelector('select').value;
    const precio = card.querySelector('.card-text').innerText.slice(1);

    agregarAlCarrito(nombreProducto, cantidad, precio);
}

// Agregar evento de clic a todos los botones "Agregar al carrito"
const botonesAgregar = document.querySelectorAll('.card .btn');
botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', handleAgregarCarrito);
});

// Al cargar la página, obtener los productos del archivo "productos.json"
document.addEventListener('DOMContentLoaded', obtenerProductos);
