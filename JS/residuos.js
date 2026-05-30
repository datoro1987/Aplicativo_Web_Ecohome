// JS/residuos.js
const API_URL = 'http://localhost:3000';

const formResiduos = document.getElementById('form-residuos');

if (formResiduos) {

    // Poner la fecha de hoy por defecto
    document.getElementById('fecha').valueAsDate = new Date();

    formResiduos.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Verificar que el usuario está logueado
        const token   = localStorage.getItem('token');
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (!token || !usuario) {
            alert('❌ Debes iniciar sesión para registrar residuos');
            window.location.href = 'login.html';
            return;
        }

        // 2. Recoger los datos del formulario
        const tipo_residuo = document.getElementById('tipo').value;
        const cantidad     = document.getElementById('cantidad').value;
        const unidad       = document.getElementById('unidad').value;
        const fecha        = document.getElementById('fecha').value;
        const descripcion  = document.getElementById('descripcion').value;
        const btnRegistrar = formResiduos.querySelector('button[type="submit"]');

        // 3. Validaciones básicas
        if (!tipo_residuo) {
            alert('❌ Selecciona el tipo de residuo');
            return;
        }
        if (!cantidad || cantidad <= 0) {
            alert('❌ Ingresa una cantidad válida');
            return;
        }

        // 4. Mostrar cargando
        btnRegistrar.textContent = 'Registrando...';
        btnRegistrar.disabled    = true;

        try {
            const respuesta = await fetch(`${API_URL}/api/residuos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    usuario_id: usuario.id,
                    tipo_residuo,
                    cantidad: parseFloat(cantidad),
                    unidad,
                    fecha,
                    descripcion: descripcion || null
                })
            });

            const datos = await respuesta.json();

            if (datos.ok) {
                alert(`✅ ¡Residuo registrado exitosamente!\n${cantidad} ${unidad} de ${tipo_residuo}`);
                formResiduos.reset();
                // Restaurar fecha de hoy después del reset
                document.getElementById('fecha').valueAsDate = new Date();

            } else {
                alert(`❌ ${datos.mensaje}`);
            }

        } catch (error) {
            console.error('Error al registrar residuo:', error);
            alert('❌ No se pudo conectar con el servidor. ¿Está corriendo el backend?');

        } finally {
            btnRegistrar.textContent = 'Registrar Residuos';
            btnRegistrar.disabled    = false;
        }
    });
}