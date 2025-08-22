import { escapeLiteral } from "pg";
import { Usuarios, Eventos, Invitados } from "../models/Relaciones.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import multer from "multer";
import XLSX from "xlsx";

// Crear Nuevo invitado
export const crearInvitado = async (req, res) => {
  const {
    eventoId,
    nombre,
    apellidos,
    edad,
    telefono,
    codigo_pais,
    pases,
    seccion,
    comentarios,
  } = req.body;
  console.log("Datos recibidos en /claulet/admin/api/invitados", req.body);

  if (!eventoId) {
    return res.status(400).json({ error: "Debes seleccionar un evento" });
  }
  const evento = await Eventos.findByPk(eventoId);
  if (!evento) {
    return res.status(404).json({ error: "Evento no encontrado" });
  }

  try {
    const nuevoInvitado = await Invitados.create({
      nombre,
      apellidos,
      edad,
      telefono,
      codigo_pais,
      pases,
      estado:"pendiente",
      seccion,
      comentarios,
      deseo: "Ingresar deseo",
      eventoId,
      token:  uuidv4(), //Token unico para cada usuario
    });

    res.status(201).json({
      mensaje: "Invitado agregado correctamente",
      invitado: nuevoInvitado,
    });
  } catch (error) {
    console.error("Error al agregar invitado:", error);
    res.status(500).json({ error: "Error al agregar invitado" });
  }
};

// Importar invitados desde Excel
export const importarInvitados = async (req, res) => {
  try {
    const eventoId = req.body.eventoId;
    if (!eventoId) return res.status(400).json({ error: "Debes seleccionar un evento" });
    if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });

    // Leer el Excel
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Tomamos la primera hoja
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Recorrer cada fila y guardar en la base de datos
    const invitadosCreados = [];
    for (const fila of data) {
      const nuevoInvitado = await Invitados.create({
        nombre: fila.nombre || "Sin Nombre",
        apellidos: fila.apellidos || "Sin apellido",
        telefono: fila.telefono || "",
        codigo_pais: fila.codigo_pais || "+52",
        pases: fila.pases || 1,
        seccion: fila.seccion || "",
        comentarios: fila.comentarios || "",
        edad: fila.edad || null,
        estado: "pendiente",
        deseo: "Ingresar deseo",
        eventoId,
        token: uuidv4()
      });
      invitadosCreados.push(nuevoInvitado);
    }

    // Borrar archivo temporal
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      mensaje: `Se importaron ${invitadosCreados.length} invitados correctamente`,
      count: invitadosCreados.length,
      invitados: invitadosCreados,
    });
  } catch (error) {
    console.error("Error al importar invitados:", error);
    res.status(500).json({ error: "Error al importar invitados" });
  }
};
// Obtener Invitados
export const obtenerInvitados = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const invitados = await Invitados.findAll({
      where: { eventoId },
      attributes: [
        "id",
        "nombre",
        "apellidos",
        "telefono",
        "estado",
        "url_personalizada",
      ],
    });

    res.json(invitados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener invitados" });
  }
};

// obtener Invitado
export const obtenerInvitado = async (req, res) => {
  console.log("Buscando Invitado para editar: ", req.params.invitadoId)
  try {
    const invitadoId = req.params.invitadoId;
    const invitado = await Invitados.findByPk(invitadoId);
    if (!invitado) return res.status(400).json({ msg: "Invitado no encontrado" });
    res.json(invitado);
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el invitado" })
  }
}

// Editar invitados
export const editarInvitado = async (req, res) => {
  console.log("Datos recibidos para editar invitado ", req.body)

  try {
    const { nombre, apellidos, edad, codigo_pais, telefono, pases, seccion, comentarios } = req.body;
    const invitadoId = req.body.invitadoId;

    const invitado = await Invitados.findByPk(invitadoId);

    if (!invitado) {
      return res.status(404).json({ msg: "Invitado no encontrado" });
    }

    await invitado.update({
      nombre,
      apellidos,
      edad,
      codigo_pais,
      telefono,
      pases,
      seccion,
      comentarios
    })

    return res.status(200).json({ msg: "Invitado actualizado correctamente", invitado });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al actualizar el evento" });
  }

};

// Eliminar Invitado
export const eliminarInvitado = async (req, res) => {
  console.log("Eliminando invitado con el Id: ", req.params.invitadoId, " ... .. .")
    try {
    const invitadoId = req.params.invitadoId;
    const invitado = await Invitados.findByPk(invitadoId);
    if (!invitado) return res.status(400).json({ msg: "Invitado no encontrado" });

    await invitado.destroy();

    res.json({ msg: "Invitado eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar el invitado" });
  }

}
