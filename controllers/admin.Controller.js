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