import { Usuarios, Eventos, Invitados } from "../models/Relaciones.js";

// Obtiene todos los datos del organizador
export const datosOrganizador = async (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect('/claulet/login');
  }

  try {
    const usuario = await Usuarios.findByPk(req.session.usuarioId);

    if (!usuario) {
      return res.redirect('/claulet/login');
      }
      
          // Traer los eventos de ese organizador
    const eventos = await Eventos.findAll({
      where: { organizadorId: usuario.id },
      attributes: ["id", "nombre"], // solo lo necesario
      raw: true
    });

      res.render('organizador/organizador', { usuario, eventos});
      
      console.log(usuario)
      console.log(eventos)
  } catch (error) {
    console.error("❌ Error obteniendo usuario:", error);
    res.redirect('/claulet/login');
  }
}