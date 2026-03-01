// public/invitacion.js
// Este script se inyecta automaticamente en todas las plantillas de invitacion
// El diseñador NO modifica este archivo

(function () {
    // Leer el token de la URL
    // La URL del invitado es: /claulet/invitacion?token=xxx
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    // Si no hay token en la URL, algo esta mal
    if (!token) {
        const msg = document.getElementById('claulet-mensaje');
        if (msg) msg.textContent = 'Invitación no válida.';
        return;
    }

    // Funcion que se llama al hacer clic en Confirmar o Declinar
    // El diseñador llama a esta funcion desde sus botones: onclick="clauletResponder('confirmado')"
    window.clauletResponder = async function (estado) {
        const deseoInput = document.getElementById('claulet-deseo');
        const mensajeEl = document.getElementById('claulet-mensaje');
        const deseo = deseoInput ? deseoInput.value.trim() : '';

        // Validar que haya escrito algo si va a confirmar
        if (estado === 'confirmado' && deseo === '') {
            if (mensajeEl) mensajeEl.textContent = 'Por favor escribe un deseo antes de confirmar.';
            return;
        }

        try {
            // Deshabilitar botones para evitar doble envio
            const botones = document.querySelectorAll('#claulet-form button');
            botones.forEach(b => b.disabled = true);

            if (mensajeEl) mensajeEl.textContent = 'Enviando respuesta...';

            // Llamar al backend con la respuesta del invitado
            const response = await fetch('/claulet/invitacion/responder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, estado, deseo })
            });

            const data = await response.json();

            if (response.ok) {
                // Ocultar el formulario y mostrar mensaje de exito
                const form = document.getElementById('claulet-form');
                if (form) form.style.display = 'none';

                if (mensajeEl) {
                    mensajeEl.textContent = estado === 'confirmado'
                        ? '🎉 ¡Gracias! Tu asistencia fue confirmada.'
                        : '😢 Gracias por avisarnos. ¡Te esperamos en la próxima!';
                    mensajeEl.style.display = 'block';
                }
            } else {
                if (mensajeEl) mensajeEl.textContent = data.msg || 'Ocurrió un error. Intenta de nuevo.';
                botones.forEach(b => b.disabled = false);
            }

        } catch (error) {
            console.error('Error al enviar respuesta:', error);
            const mensajeEl = document.getElementById('claulet-mensaje');
            if (mensajeEl) mensajeEl.textContent = 'Error de conexión. Intenta de nuevo.';
        }
    };
})();