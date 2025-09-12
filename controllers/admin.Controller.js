import { Usuarios, Eventos, Invitados, Plantillas } from "../models/Relaciones.js";

export const mostrarAdmin = (req, res) => {
    res.render('admin/administrador')
}

export const obtenerTotalesDashBoard = async (req, res) => {
    console.log("Obteniendo totales en la base de datos .... ... .. .");

    try {
        // Total de eventos activos
        const totalEventos = await Eventos.count();

        // Total de invitados
        const totalInvitados = await Invitados.count();

        // Total de plantillas
        const totalPlantillas = await Plantillas.count();

        // Enviamos los datos

        res.json({ totalEventos, totalInvitados, totalPlantillas });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener los totales del dashboard" });
    }
};

export const subirPlantillas = async (req, res) => {
    console.log("Subiendo plantillas ... . .. . .")
    // Mostrar todos los campos de texto recibidos
    console.log("📩 Datos del formulario:", req.body);

    // Mostrar info del archivo subido
    console.log("📂 Archivo subido:", req.file);

    try {
        if (!req.file) {
            return res.status(400).json({ error: "El archivo de la plantilla es obligatorio" });
        }

        const nuevaPlantilla = await Plantillas.create({
            nombre: req.body.nombre,
            tipo: req.body.tipo,
            descripcion: req.body.descripcion,
            archivo: req.file.filename,
            vista_previa: req.body.vista_previa,
            activo: "true",
        });

        console.log("✅ Plantilla creada Exitosamente:", nuevaPlantilla);

        res.json({
            message: "Plantilla creada correctamente",
            plantilla: nuevaPlantilla,
        });
        
    } catch (error) {
        console.error("❌ Error al crear la plantilla:", error);
        res.status(500).json({ error: "Error al crear la plantilla" });
    }
}