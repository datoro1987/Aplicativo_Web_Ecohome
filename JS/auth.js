// Conecta los formularios de login y registro con la API

const API_URL = 'http://localhost:3000';

// ─────────────────────────────────────────────
//  LOGIN
// ─────────────────────────────────────────────
const formLogin = document.getElementById('form-login');

if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const email    = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btnLogin = formLogin.querySelector('button[type="submit"]');

        // Mostrar que está cargando
        btnLogin.textContent = 'Ingresando...';
        btnLogin.disabled    = true;

        try {
            const respuesta = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const datos = await respuesta.json();

            if (datos.ok) {
                // Guardar token y datos del usuario
                localStorage.setItem('token',   datos.token);
                localStorage.setItem('usuario', JSON.stringify(datos.usuario));

                alert(`¡Bienvenido, ${datos.usuario.nombre_completo}!`);

                // Redirigir a la página principal
            const redirigir = localStorage.getItem('redirigir_a');
            localStorage.removeItem('redirigir_a');
            window.location.href = redirigir || '../index.html';
            
            } else {
                alert(`❌ ${datos.mensaje}`);
                btnLogin.textContent = 'Iniciar Sesión';
                btnLogin.disabled    = false;
            }

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('❌ No se pudo conectar con el servidor. ¿Está corriendo el backend?');
            btnLogin.textContent = 'Iniciar Sesión';
            btnLogin.disabled    = false;
        }
    });
}

// ─────────────────────────────────────────────
//  REGISTRO DE USUARIO
// ─────────────────────────────────────────────
const formRegistro = document.getElementById('form-registro-usuario');

if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre           = document.getElementById('nombre').value;
        const email            = document.getElementById('email').value;
        const password         = document.getElementById('password').value;
        const confirmPassword  = document.getElementById('confirm-password').value;
        const telefono         = document.getElementById('telefono').value;
        const btnRegistrar     = formRegistro.querySelector('button[type="submit"]');

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert('❌ Las contraseñas no coinciden');
            return;
        }

        // Validar longitud mínima de contraseña
        if (password.length < 6) {
            alert('❌ La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Mostrar que está cargando
        btnRegistrar.textContent = 'Creando cuenta...';
        btnRegistrar.disabled    = true;

        try {
            const respuesta = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_completo: nombre,
                    email,
                    password,
                    telefono: telefono || null
                })
            });

            const datos = await respuesta.json();

            if (datos.ok) {
                alert(`✅ Cuenta creada exitosamente. ¡Ya puedes iniciar sesión!`);
                // Redirigir al login
                window.location.href = 'login.html';

            } else {
                alert(`❌ ${datos.mensaje}`);
                btnRegistrar.textContent = 'Crear Cuenta';
                btnRegistrar.disabled    = false;
            }

        } catch (error) {
            console.error('Error al registrar:', error);
            alert('❌ No se pudo conectar con el servidor. ¿Está corriendo el backend?');
            btnRegistrar.textContent = 'Crear Cuenta';
            btnRegistrar.disabled    = false;
        }
    });
}