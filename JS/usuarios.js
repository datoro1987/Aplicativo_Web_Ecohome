// JS/usuarios.js
console.log(" usuarios.js cargado");

async function cargarUsuarios() {
    try {
        // Realizamos la petición al backend para obtener los usuarios
        const respuesta = await fetch("http://localhost:3000/api/auth/usuarios");
        const datos     = await respuesta.json();

        console.log("Respuesta del servidor:", datos);

        const tabla = document.getElementById("tablaUsuarios");
        tabla.innerHTML = "";

        datos.usuarios.forEach(usuario => {
            const fila = `
                <tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre_completo}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefono || '—'}</td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });

    } catch (error) {
        console.error(" Error al cargar usuarios:", error);
    }
}

cargarUsuarios();