import { Usuarios, Eventos, Invitados } from "../models/Relaciones.js";

export const datosOrganizador = async (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect('/claulet/login');
  }

  try {
    const usuario = await Usuarios.findByPk(req.session.usuarioId);

    if (!usuario) {
      return res.redirect('/claulet/login');
    }

    res.render('organizador/organizador', { usuario });
  } catch (error) {
    console.error("❌ Error obteniendo usuario:", error);
    res.redirect('/claulet/login');
  }
}