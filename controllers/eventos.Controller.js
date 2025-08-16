import { Usuarios, Eventos, Invitados } from "../models/Relaciones.js";
import { Sequelize } from "sequelize";
import { check, validationResult } from "express-validator";

export const crearEvento = async (req, res) => {
  const {nombre} = req.body;
  console.log("📥 Datos recibidos en /api/eventos:", req.body);
  console.log("Este es el evento: ", nombre);

  // Validaciones con express-validator
  await check('nombre')
    .notEmpty().withMessage("El nombre del evento es obligatorio")
    .isLength({ min: 3 }).withMessage("El evento debe tener al menos 3 caracteres")
    .run(req);
  
  const existeEvento = await Eventos.findOne({ where: { nombre: req.body.nombre } });
  if (existeEvento) {
    return res.status(400).json({errores: [{msg: 'El evento ya esta registrado'}]})
  }

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const nuevoEvento = await Eventos.create({
      nombre: req.body.nombre,
      fecha: req.body.fecha,
      hora: req.body.hora,
      descripcion: req.body.descripcion,
      lugar: req.body.lugar,
      urlBase: req.body.eventUrl,
      organizadorId: req.body.organizador,
      anfitrionId: req.body.anfitrion
    })
    console.log('✅ Evento creado exitosamente 🎉', nuevoEvento.dataValues);
    res.status(201).json({ mensaje: 'Evento creado correctamente' });
  } catch (error) {
    console.error("❌ Error al crear Evento", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const obtenerEventos = async (req, res) => {
  try {
    const eventos = await Eventos.findAll({
      attributes: [
        "id",
        "nombre",
        "fecha",
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.literal(
              `CASE WHEN invitados.estado = 'confirmado' THEN 1 END`
            )
          ),
          "confirmados",
        ],
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.literal(
              `CASE WHEN invitados.estado = 'pendiente' THEN 1 END`
            )
          ),
          "pendientes",
        ],
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.literal(
              `CASE WHEN invitados.estado = 'declinado' THEN 1 END`
            )
          ),
          "declinados",
        ],
      ],
      include: [
        {
          model: Invitados,
          attributes: [],
        },
      ],
      group: ["eventos.id"],
      raw: true,
    });

    res.json(eventos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error al obtener los eventos" });
  }
};

export const obtenerEvento = async (req, res) => {
  try {
    const evento = await Eventos.findByPk(req.params.eventoId); 
    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    res.json(evento); // enviamos los datos al frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el evento" });
  }
};

export const editarEvento = async (req, res) => {
  console.log("📥 Datos recibidos en /claulet/admin/api/editarEvento/:eventoId:", req.body);

  try {
    const { id, nombre, fecha, hora, lugar, descripcion, urlBase } = req.body;

    const evento = await Eventos.findByPk(id);

    if (!evento) {
      return res.status(404).json({ msg: "Evento no encontrado" });
    }

    // Actualizamos con los datos nuevos
    await evento.update({
      nombre,
      fecha,
      hora,
      lugar,
      descripcion,
      urlBase
    })

    return res.status(200).json({ msg: "Evento actualizado correctamente", evento });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al actualizar el evento" });
  }
};

export const eliminarEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const evento = await Eventos.findByPk(eventoId);
    if (!evento) return res.status(400).json({ msg: "Evento no encontrado" });

    await evento.destroy();

    res.json({ msg: "Evento eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar el evento" });
  }
};
