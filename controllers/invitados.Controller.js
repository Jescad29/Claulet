import { Usuarios, Eventos, Invitados } from "../models/Relaciones.js";
import { Sequelize } from "sequelize";

export const obtenerInvitados = async (req, res) => {
     try {
    const { eventoId } = req.params;
    const invitados = await Invitados.findAll({
      where: { eventoId },
      attributes: ['id', 'nombre', 'apellidos', 'telefono', 'estado', 'url_personalizada']
    });

    res.json(invitados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener invitados" });
  }
};