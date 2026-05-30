// JS/proteger.js
// ayuda a verifica que el usuario esté logueado
// Si no hay sesión, redirige al login

function verificarSesion() {
    const token   = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!token || !usuario) {
        // Guardar la página actual para redirigir después del login
        localStorage.setItem('redirigir_a', window.location.href);

        alert('⚠️ Debes iniciar sesión para acceder a esta sección.');
        window.location.href = '/html/login.html';
        return false;
    }

    return true;
}

// Ejecutar inmediatamente al cargar la página
verificarSesion();