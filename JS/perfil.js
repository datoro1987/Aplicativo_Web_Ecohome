// JS/perfil.js
const API_URL = 'http://localhost:3000';

// ─────────────────────────────────────────────
//  Verificar sesión — si no hay login, redirigir
// ─────────────────────────────────────────────
const token   = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!token || !usuario) {
    alert('Debes iniciar sesión para ver tu perfil');
    window.location.href = 'login.html';
}

// ─────────────────────────────────────────────
//  Cargar datos del usuario en la página
// ─────────────────────────────────────────────
async function cargarPerfil() {
    try {
        const respuesta = await fetch(`${API_URL}/api/auth/usuarios/${usuario.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const datos = await respuesta.json();

        if (datos.ok) {
            const u = datos.usuario;

            // Avatar con iniciales
            const iniciales = u.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            document.getElementById('avatar-iniciales').textContent = iniciales;

            // Datos en pantalla
            document.getElementById('perfil-nombre').textContent      = u.nombre_completo;
            document.getElementById('perfil-email').textContent       = u.email;

            // Formulario prellenado
            document.getElementById('edit-nombre').value   = u.nombre_completo;
            document.getElementById('edit-email').value    = u.email;
            document.getElementById('edit-telefono').value = u.telefono || '';
            document.getElementById('edit-fecha').value    = new Date(u.fecha_registro).toLocaleDateString('es-CO', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        }

        // Cargar estadísticas del sidebar
        const respStats = await fetch(`${API_URL}/api/estadisticas/usuario/${usuario.id}`);
        const stats     = await respStats.json();

        if (stats.ok) {
            document.getElementById('perfil-total-registros').textContent = stats.resumen.total_registros;
            document.getElementById('perfil-total-kg').textContent        = stats.resumen.total_kg.toLocaleString('es-CO');
            document.getElementById('perfil-registros-mes').textContent   = stats.resumen.registros_mes;
        }

        // Cargar historial de residuos
        cargarHistorial();

    } catch (error) {
        console.error('Error al cargar perfil:', error);
    }
}

// ─────────────────────────────────────────────
//  Historial de residuos del usuario
// ─────────────────────────────────────────────
async function cargarHistorial() {
    try {
        const respuesta = await fetch(`${API_URL}/api/residuos`);
        const datos     = await respuesta.json();

        const lista = document.getElementById('lista-registros');

        // Filtrar solo los del usuario actual
        const misResiduos = datos.residuos.filter(r => r.nombre_completo === usuario.nombre_completo).slice(0, 10);

        if (misResiduos.length === 0) {
            lista.innerHTML = '<p class="cargando-texto">Aún no tienes registros de residuos.</p>';
            return;
        }

        lista.innerHTML = misResiduos.map(r => `
            <div class="historial-item">
                <div class="historial-icono">${iconoResiduos(r.tipo_residuo)}</div>
                <div class="historial-info">
                    <strong>${capitalizar(r.tipo_residuo)}</strong>
                    <span>${r.cantidad} ${r.unidad} — ${new Date(r.fecha).toLocaleDateString('es-CO')}</span>
                    ${r.descripcion ? `<em>${r.descripcion}</em>` : ''}
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error al cargar historial:', error);
    }
}

// ─────────────────────────────────────────────
//  Guardar cambios del perfil
// ─────────────────────────────────────────────
document.getElementById('form-perfil').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre   = document.getElementById('edit-nombre').value;
    const email    = document.getElementById('edit-email').value;
    const telefono = document.getElementById('edit-telefono').value;
    const btn      = e.target.querySelector('button');

    btn.textContent = 'Guardando...';
    btn.disabled    = true;

    try {
        const respuesta = await fetch(`${API_URL}/api/auth/usuarios/${usuario.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nombre_completo: nombre, email, telefono })
        });

        const datos = await respuesta.json();

        if (datos.ok) {
            // Actualizar localStorage con los nuevos datos
            const usuarioActualizado = { ...usuario, nombre_completo: nombre, email };
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

            alert('✅ Perfil actualizado correctamente');
            document.getElementById('perfil-nombre').textContent = nombre;
            document.getElementById('perfil-email').textContent  = email;
        } else {
            alert(`❌ ${datos.mensaje}`);
        }

    } catch (error) {
        alert('❌ Error al guardar los cambios');
    } finally {
        btn.textContent = '💾 Guardar cambios';
        btn.disabled    = false;
    }
});

// ─────────────────────────────────────────────
//  Cambiar contraseña
// ─────────────────────────────────────────────
document.getElementById('form-password').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nueva     = document.getElementById('nueva-password').value;
    const confirmar = document.getElementById('confirmar-password').value;
    const btn       = e.target.querySelector('button');

    if (nueva !== confirmar) {
        alert('❌ Las contraseñas no coinciden');
        return;
    }
    if (nueva.length < 6) {
        alert('❌ La contraseña debe tener al menos 6 caracteres');
        return;
    }

    btn.textContent = 'Actualizando...';
    btn.disabled    = true;

    try {
        const respuesta = await fetch(`${API_URL}/api/auth/usuarios/${usuario.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password: nueva })
        });

        const datos = await respuesta.json();

        if (datos.ok) {
            alert('✅ Contraseña actualizada correctamente');
            e.target.reset();
        } else {
            alert(`❌ ${datos.mensaje}`);
        }

    } catch (error) {
        alert('❌ Error al actualizar la contraseña');
    } finally {
        btn.textContent = '🔒 Actualizar contraseña';
        btn.disabled    = false;
    }
});

// ─────────────────────────────────────────────
//  Sistema de tabs
// ─────────────────────────────────────────────
function mostrarTab(tab) {
    document.querySelectorAll('.tab-contenido').forEach(t => t.classList.remove('activo'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('activo'));

    document.getElementById(`tab-${tab}`).classList.add('activo');
    event.target.classList.add('activo');
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function iconoResiduos(tipo) {
    const iconos = {
        plastico:    '🧴',
        papel:       '📄',
        vidrio:      '🍾',
        metal:       '🥫',
        organico:    '🌿',
        electronico: '💻',
        textil:      '👕'
    };
    return iconos[tipo] || '♻️';
}

// Iniciar
cargarPerfil();