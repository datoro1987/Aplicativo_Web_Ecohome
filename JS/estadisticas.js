// JS/estadisticas.js
const API_URL = 'http://localhost:3000';

// Obtener usuario logueado del localStorage
const usuario = JSON.parse(localStorage.getItem('usuario'));

// ─────────────────────────────────────────────
//  Cargar estadísticas del usuario logueado
// ─────────────────────────────────────────────
async function cargarEstadisticasUsuario() {
    try {
        // Si no hay sesión, mostrar mensaje
        if (!usuario) {
            document.getElementById('stat-kg').textContent       = '—';
            document.getElementById('stat-mes').textContent      = '—';
            document.getElementById('stat-total').textContent    = '—';
            document.getElementById('nombre-usuario').textContent = 'Invitado';
            document.getElementById('aviso-sesion').style.display = 'block';
            return;
        }

        // Mostrar nombre del usuario
        document.getElementById('nombre-usuario').textContent = usuario.nombre_completo;

        const respuesta = await fetch(`${API_URL}/api/estadisticas/usuario/${usuario.id}`);
        const datos     = await respuesta.json();

        if (datos.ok) {
            const { total_kg, total_registros, registros_mes } = datos.resumen;

            document.getElementById('stat-kg').textContent    = total_kg.toLocaleString('es-CO');
            document.getElementById('stat-mes').textContent   = registros_mes;
            document.getElementById('stat-total').textContent = total_registros;

            // Gráfico torta — solo si hay datos
            if (datos.graficoTipos.labels.length > 0) {
                new Chart(document.getElementById('chartTipos'), {
                    type: 'pie',
                    data: datos.graficoTipos,
                    options: {
                        responsive: true,
                        plugins: { legend: { position: 'bottom' } }
                    }
                });
            } else {
                document.getElementById('chartTipos').parentElement.innerHTML =
                    '<p style="text-align:center;color:#888">Aún no tienes registros</p>';
            }

            // Gráfico barras — solo si hay datos
            if (datos.graficoMeses.labels.length > 0) {
                new Chart(document.getElementById('chartMeses'), {
                    type: 'bar',
                    data: datos.graficoMeses,
                    options: {
                        responsive: true,
                        scales: { y: { beginAtZero: true } }
                    }
                });
            } else {
                document.getElementById('chartMeses').parentElement.innerHTML =
                    '<p style="text-align:center;color:#888">Aún no tienes registros este año</p>';
            }
        }

    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

cargarEstadisticasUsuario();