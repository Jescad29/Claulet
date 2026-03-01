import { Usuarios, Eventos, Invitados, Plantillas } from "../models/Relaciones.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

export const listarPlantillas = async (req, res) => {
  try {
    const plantillas = await Plantillas.findAll();
    res.json(plantillas);
  } catch (error) {
    console.error("❌ Error al listar plantillas:", error);
    res.status(500).json({ error: "Error al obtener plantillas" });
  }
};

export const eliminarPlantilla = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID de plantilla a eliminar:", id); // <-- usar id

    // Buscar la plantilla en la base de datos
    const plantilla = await Plantillas.findByPk(id); // <-- usar id
    if (!plantilla) {
      console.log("❌ Plantilla no encontrada en la DB");
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }
    console.log("✅ Plantilla encontrada en DB:", plantilla.dataValues);

    // Ruta absoluta del archivo en la raíz del proyecto
    const archivoPath = path.join(process.cwd(), "uploadsPlantillas", plantilla.archivo);
    console.log("Ruta absoluta del archivo:", archivoPath);

    // Verificar si existe el archivo
    fs.access(archivoPath, fs.constants.F_OK, async (err) => {
      if (err) {
        console.log("⚠️ Archivo no encontrado en uploadsPlantillas, se eliminará solo el registro");
      } else {
        console.log("Archivo encontrado, intentando eliminar...");
        try {
          fs.unlinkSync(archivoPath);
          console.log("✅ Archivo eliminado correctamente");
        } catch (err) {
          console.error("❌ Error al eliminar el archivo:", err);
          return res.status(500).json({ error: "Error al eliminar el archivo físico" });
        }
      }

      // Eliminar registro de la base de datos
      try {
        await plantilla.destroy();
        console.log("✅ Registro eliminado en la DB");
        res.json({ message: "Plantilla eliminada correctamente" });
      } catch (err) {
        console.error("❌ Error al eliminar registro en la DB:", err);
        res.status(500).json({ error: "Error al eliminar el registro en la DB" });
      }
    });

  } catch (error) {
    console.error("❌ Error general al eliminar plantilla:", error);
    res.status(500).json({ error: "Error al eliminar la plantilla" });
  }
};

export const asignarPlantillaEvento = async (req, res) => {
  console.log("Asignando plantilla a evento... ");

  try {
    // 1. Obtiene todos los datos que tu formulario está enviando
    // Ahora recibimos eventoId, plantillaId y el tipo de plantilla
    const { eventoId, plantillaId, tipoPlantilla } = req.body; 

    // Opcional: Para verificar lo que estás recibiendo
    console.log(`Datos recibidos: eventoId: ${eventoId}, plantillaId: ${plantillaId}, tipoPlantilla: ${tipoPlantilla}`);

    // 2. Busca el evento por su ID en la base de datos
    const evento = await Eventos.findByPk(eventoId);

    // Si el evento no existe, devuelve un error 404
    if (!evento) {
      return res.status(404).json({ msg: "Evento no encontrado" });
    }
    
    // 3. Valida el tipo de plantilla para evitar errores o vulnerabilidades
    // Usamos un mapa para convertir el tipo de frontend a los nombres de las columnas de la DB
    const columnasPlantilla = {
        invitacion: 'plantillaVistaId',
        pdf: 'plantillaPdfId',
        deseos: 'plantillaDeseosId',
        admin: 'plantillaAdminId'
    };
    
    const columnaAActualizar = columnasPlantilla[tipoPlantilla];

    // Si el tipo de plantilla no es uno de los esperados, devuelve un error 400
    if (!columnaAActualizar) {
      return res.status(400).json({ msg: "Tipo de plantilla no válido" });
    }

    // 4. Crea un objeto para la actualización con la clave dinámica
    const datosActualizacion = {};
    datosActualizacion[columnaAActualizar] = plantillaId;

    // 5. Actualiza el registro del evento en la base de datos
    await evento.update(datosActualizacion);
    
    // 6. Envía una respuesta de éxito
    return res.status(200).json({ msg: "Plantilla asignada al evento correctamente", evento });

  } catch (error) {
    console.error("❌ Error al asignar la plantilla:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

