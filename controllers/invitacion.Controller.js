// controllers/invitacion.Controller.js

import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { Invitados, Eventos, Plantillas } from '../models/Relaciones.js';

// GET /claulet/invitacion?token=xxx
// Lee el token, busca al invitado, carga la plantilla y reemplaza las variables
export const mostrarInvitacion = async (req, res) => {
    const { token } = req.query;

    // 1. Verificar que venga el token
    if (!token) {
        return res.status(400).send('<h2>Invitación no válida. Falta el token.</h2>');
    }

    try {
        // 2. Decodificar el JWT para obtener el id del invitado
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).send('<h2>El link de invitación no es válido o ha expirado.</h2>');
        }

        // 3. Buscar al invitado con su evento y la plantilla asignada al evento
        const invitado = await Invitados.findByPk(decoded.id, {
            include: [
                {
                    model: Eventos,
                    include: [
                        {
                            // Plantilla de tipo "invitacion" asignada al evento
                            model: Plantillas,
                            as: 'plantillaVista',
                        }
                    ]
                }
            ]
        });

        // 4. Verificar que exista el invitado
        if (!invitado) {
            return res.status(404).send('<h2>Invitado no encontrado.</h2>');
        }

        const evento = invitado.Evento;

        // 5. Verificar que el evento tenga una plantilla de invitacion asignada
        if (!evento || !evento.plantillaVista) {
            return res.status(404).send('<h2>Este evento aún no tiene una plantilla de invitación configurada.</h2>');
        }

        // 6. Leer el archivo HTML de la plantilla desde disco
        const rutaPlantilla = path.join(process.cwd(), 'uploadsPlantillas', evento.plantillaVista.archivo);

        if (!fs.existsSync(rutaPlantilla)) {
            return res.status(404).send('<h2>El archivo de la plantilla no fue encontrado.</h2>');
        }

        let html = fs.readFileSync(rutaPlantilla, 'utf-8');

        // 7. Formatear la fecha para que sea legible
        const fechaFormateada = evento.fecha
            ? new Date(evento.fecha).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            : '';

        // 8. Reemplazar todas las variables en el HTML
        html = html
            .replace(/\{\{nombre\}\}/g, invitado.nombre || '')
            .replace(/\{\{apellidos\}\}/g, invitado.apellidos || '')
            .replace(/\{\{evento\}\}/g, evento.nombre || '')
            .replace(/\{\{fecha\}\}/g, fechaFormateada)
            .replace(/\{\{hora\}\}/g, evento.hora || '')
            .replace(/\{\{lugar\}\}/g, evento.lugar || '')
            .replace(/\{\{pases\}\}/g, invitado.pases || 1)
            .replace(/\{\{seccion\}\}/g, invitado.seccion || '')
            .replace(/\{\{comentarios\}\}/g, invitado.comentarios || '');

        // 9. Inyectar el script del sistema justo antes del </body>
        // El diseñador NO necesita incluir este script, el sistema lo agrega automaticamente
        const scriptSistema = `<script src="/invitacion.js"></script>`;
        html = html.replace('</body>', `${scriptSistema}\n</body>`);

        // 10. Servir el HTML resultante
        res.setHeader('Content-Type', 'text/html');
        res.send(html);

    } catch (error) {
        console.error('❌ Error al mostrar invitación:', error);
        res.status(500).send('<h2>Error interno del servidor.</h2>');
    }
};


// POST /claulet/invitacion/responder
// Recibe la respuesta del invitado y actualiza en la DB
export const responderInvitacion = async (req, res) => {
    const { token, estado, deseo } = req.body;

    // 1. Validar que vengan los datos necesarios
    if (!token || !estado) {
        return res.status(400).json({ ok: false, msg: 'Faltan datos requeridos.' });
    }

    // 2. Validar que el estado sea válido
    if (!['confirmado', 'declinado'].includes(estado)) {
        return res.status(400).json({ ok: false, msg: 'Estado no válido.' });
    }

    try {
        // 3. Decodificar el JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ ok: false, msg: 'Token inválido o expirado.' });
        }

        // 4. Buscar al invitado
        const invitado = await Invitados.findByPk(decoded.id);

        if (!invitado) {
            return res.status(404).json({ ok: false, msg: 'Invitado no encontrado.' });
        }

        // 5. Actualizar estado y deseo en la DB
        await invitado.update({
            estado,
            deseo: deseo || invitado.deseo
        });

        console.log(`✅ Invitado ${invitado.nombre} respondió: ${estado}`);

        return res.json({
            ok: true,
            msg: estado === 'confirmado'
                ? '¡Asistencia confirmada!'
                : 'Respuesta registrada. ¡Gracias por avisar!'
        });

    } catch (error) {
        console.error('❌ Error al guardar respuesta:', error);
        return res.status(500).json({ ok: false, msg: 'Error interno del servidor.' });
    }
};