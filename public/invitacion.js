// public/invitacion.js
// Este script se inyecta automaticamente en todas las plantillas de invitacion
// El diseñador NO modifica este archivo

(function () {
    // Leer el token de la URL
    // La URL del invitado es: /claulet/invitacion?token=xxx
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');


    // Generar QR si el invitado ya confirmó
    // El controlador inyecta #claulet-qr-container solo cuando estado === 'confirmado'
    const qrContainer = document.getElementById('claulet-qr-container');

    if (qrContainer) {
        // La URL actual del invitado es su propio link personalizado
        const urlActual = window.location.href;

        // Cargar la librería QRCode dinámicamente si no está disponible
        const generarQR = () => {
            const canvas = document.createElement('canvas');
            qrContainer.appendChild(canvas);

            QRCode.toCanvas(canvas, urlActual, { width: 200, margin: 1 }, function(error) {
                if (error) {
                    qrContainer.innerHTML = '<p style="color:#e74c3c;">Error al generar QR</p>';
                    console.error('Error generando QR:', error);
                    return;
                }

                // Agregar botón de descarga debajo del QR
                const btnDescargar = document.createElement('a');
                btnDescargar.textContent = '⬇️ Descargar QR';
                btnDescargar.href = canvas.toDataURL('image/png');
                btnDescargar.download = 'mi-qr-invitacion.png';
                btnDescargar.style.cssText = `
                    display: block;
                    margin-top: 12px;
                    background: white;
                    color: #27ae60;
                    font-weight: bold;
                    font-size: 0.85rem;
                    padding: 8px 16px;
                    border-radius: 20px;
                    text-decoration: none;
                    cursor: pointer;
                `;

                // Insertar el botón después del canvas dentro del contenedor
                qrContainer.appendChild(btnDescargar);
            });
        };

        // Verificar si QRCode ya está cargado, si no, cargarlo primero
        if (typeof QRCode === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js';
            script.onload = generarQR;
            document.head.appendChild(script);
        } else {
            generarQR();
        }
    }

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