// JS/navbar.js

//  NAVBAR DINÁMICO — sesión activa o no

function actualizarNavbar() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const btnSesion    = document.querySelector('.btn-iniciar-sesion');
    const btnRegistrar = document.querySelector('.btn-registrarse');

    if (usuario && btnSesion && btnRegistrar) {
        // Usuario logueado — mostrar nombre y cerrar sesión
        btnSesion.textContent = `👤 ${usuario.nombre_completo.split(' ')[0]}`;
        btnSesion.href        = '/html/perfil.html';
        btnSesion.style.background = 'rgba(255,255,255,0.3)';

        btnRegistrar.textContent = 'Cerrar Sesión';
        btnRegistrar.href        = '#';
        btnRegistrar.style.background = 'rgba(220,53,69,0.8)';
        btnRegistrar.style.borderColor = 'rgba(220,53,69,0.8)';

        btnRegistrar.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Deseas cerrar sesión?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                window.location.href = determinarRuta('index.html');
            }
        });
    }
}

// ─────────────────────────────────────────────
//  MENÚ HAMBURGUESA
// ─────────────────────────────────────────────
function iniciarMenuHamburguesa() {
    const nav = document.querySelector('.nav-menu');
    if (!nav) return;

    // Crear botón hamburguesa
    const hamburguesa = document.createElement('button');
    hamburguesa.classList.add('hamburguesa');
    hamburguesa.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    nav.appendChild(hamburguesa);

    const ul = nav.querySelector('ul');

    hamburguesa.addEventListener('click', () => {
        hamburguesa.classList.toggle('activo');
        ul.classList.toggle('menu-abierto');
    });

    // Cerrar menú al hacer click en un enlace
    ul.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', () => {
            hamburguesa.classList.remove('activo');
            ul.classList.remove('menu-abierto');
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) {
            hamburguesa.classList.remove('activo');
            ul.classList.remove('menu-abierto');
        }
    });
}

// ─────────────────────────────────────────────
//  Detectar ruta relativa según la página
// ─────────────────────────────────────────────
function determinarRuta(archivo) {
    const ruta = window.location.pathname;
    if (ruta.includes('/html/')) return `../${archivo}`;
    return archivo;
}

// Iniciar todo
actualizarNavbar();
iniciarMenuHamburguesa();