// organizador.Controller.js

import { Usuarios, Eventos, Invitados } from "../models/Relaciones.js";
import XLSX from 'xlsx'; // ✅ NUEVO: Importar la biblioteca


export const datosOrganizador = async (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect("/claulet/login");
  }

  try {
    const usuario = await Usuarios.findByPk(req.session.usuarioId);

    if (!usuario) {
      return res.redirect("/claulet/login");
    }

    // Traer los eventos con sus invitados
    const eventos = await Eventos.findAll({
      where: { organizadorId: usuario.id },
      attributes: ["id", "nombre"],
      include: [
        {
          model: Invitados,
          attributes: [
            "id",
            "nombre",
            "apellidos",
            "telefono",
            "codigo_pais",        
            "url_personalizada",  
            "pases",              
            "comentarios",
            "seccion",
            "estado",
            "deseo",
          ],
        },
      ],
      raw: false,
    });

    // ✅ NUEVO: Calcular estadísticas dinámicamente
    const stats = {
      total: 0,
      confirmados: 0,
      pendientes: 0,
      declinados: 0
    };

    // Recorrer todos los eventos y sus invitados para contar
    eventos.forEach(evento => {
      if (evento.invitados && evento.invitados.length > 0) {
        evento.invitados.forEach(invitado => {
          stats.total++;
          
          // Normalizar el estado a minúsculas para evitar problemas de mayúsculas
          const estado = invitado.estado ? invitado.estado.toLowerCase() : 'pendiente';
          
          switch(estado) {
            case 'confirmado':
              stats.confirmados++;
              break;
            case 'pendiente':
              stats.pendientes++;
              break;
            case 'declinado':
              stats.declinados++;
              break;
            default:
              // Si el estado no es reconocido, lo contamos como pendiente
              stats.pendientes++;
          }
        });
      }
    });

    // ✅ NUEVO: Pasar las estadísticas a la vista
    res.render("organizador/organizador", { usuario, eventos, stats });

    console.log(usuario);
    console.log(eventos);
    console.log('Estadísticas:', stats); // Para debugging
  } catch (error) {
    console.error("⌛ Error obteniendo usuario:", error);
    res.redirect("/claulet/login");
  }
};


// ✅ NUEVO: Controlador para exportar a Excel
export const exportarExcel = async (req, res) => {
  // Verificar sesión
  if (!req.session.usuarioId) {
    return res.redirect("/claulet/login");
  }

  try {
    const usuario = await Usuarios.findByPk(req.session.usuarioId);

    if (!usuario) {
      return res.redirect("/claulet/login");
    }

    // Obtener todos los eventos con sus invitados
    const eventos = await Eventos.findAll({
      where: { organizadorId: usuario.id },
      attributes: ["id", "nombre", "fecha", "lugar"], // Agregamos más info del evento
      include: [
        {
          model: Invitados,
          attributes: [
            "id",
            "nombre",
            "apellidos",
            "telefono",
            "comentarios",
            "seccion",
            "estado",
            "deseo",
          ],
        },
      ],
      raw: false,
    });

    // ========================================
    // PREPARAR DATOS PARA EXCEL
    // ========================================
    
    /**
     * Estructura de datos:
     * Cada fila tendrá: Evento | Nombre | Apellidos | Teléfono | Estado | Sección | Deseo | Comentarios
     */
    const datosParaExcel = [];
    
    // Contador de invitados por estado para resumen
    const resumen = {
      total: 0,
      confirmados: 0,
      pendientes: 0,
      declinados: 0
    };

    // Recorrer eventos e invitados
    eventos.forEach(evento => {
      if (evento.invitados && evento.invitados.length > 0) {
        evento.invitados.forEach(invitado => {
          // Normalizar estado
          const estado = invitado.estado ? invitado.estado.toLowerCase() : 'pendiente';
          
          // Contar para resumen
          resumen.total++;
          if (estado === 'confirmado') resumen.confirmados++;
          else if (estado === 'pendiente') resumen.pendientes++;
          else if (estado === 'declinado') resumen.declinados++;
          
          // Agregar fila de datos
          datosParaExcel.push({
            'Evento': evento.nombre || '',
            'Fecha Evento': evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-MX') : '',
            'Lugar': evento.lugar || '',
            'Nombre': invitado.nombre || '',
            'Apellidos': invitado.apellidos || '',
            'Teléfono': invitado.telefono || '',
            'Estado': estado.charAt(0).toUpperCase() + estado.slice(1), // Capitalizar primera letra
            'Sección': invitado.seccion || '',
            'Deseo': invitado.deseo || '',
            'Comentarios': invitado.comentarios || ''
          });
        });
      }
    });

    // ========================================
    // CREAR LIBRO DE EXCEL CON MÚLTIPLES HOJAS
    // ========================================
    
    const workbook = XLSX.utils.book_new();

    // ----------------------------------------
    // HOJA 1: Lista completa de invitados
    // ----------------------------------------
    const worksheetInvitados = XLSX.utils.json_to_sheet(datosParaExcel);
    
    // Ajustar ancho de columnas para mejor legibilidad
    const columnWidths = [
      { wch: 20 }, // Evento
      { wch: 12 }, // Fecha Evento
      { wch: 25 }, // Lugar
      { wch: 15 }, // Nombre
      { wch: 15 }, // Apellidos
      { wch: 15 }, // Teléfono
      { wch: 12 }, // Estado
      { wch: 15 }, // Sección
      { wch: 30 }, // Deseo
      { wch: 40 }, // Comentarios
    ];
    worksheetInvitados['!cols'] = columnWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheetInvitados, "Invitados");

    // ----------------------------------------
    // HOJA 2: Resumen estadístico
    // ----------------------------------------
    const datosResumen = [
      { 'Estadística': 'Total de Invitados', 'Cantidad': resumen.total },
      { 'Estadística': 'Confirmados', 'Cantidad': resumen.confirmados },
      { 'Estadística': 'Pendientes', 'Cantidad': resumen.pendientes },
      { 'Estadística': 'Declinados', 'Cantidad': resumen.declinados },
      { 'Estadística': '', 'Cantidad': '' }, // Fila vacía
      { 'Estadística': 'Tasa de Confirmación', 'Cantidad': resumen.total > 0 ? `${((resumen.confirmados / resumen.total) * 100).toFixed(1)}%` : '0%' },
      { 'Estadística': 'Tasa de Respuesta', 'Cantidad': resumen.total > 0 ? `${(((resumen.confirmados + resumen.declinados) / resumen.total) * 100).toFixed(1)}%` : '0%' }
    ];
    
    const worksheetResumen = XLSX.utils.json_to_sheet(datosResumen);
    worksheetResumen['!cols'] = [{ wch: 25 }, { wch: 15 }];
    
    XLSX.utils.book_append_sheet(workbook, worksheetResumen, "Resumen");

    // ----------------------------------------
    // HOJA 3: Invitados por evento
    // ----------------------------------------
    const datosPorEvento = [];
    
    eventos.forEach(evento => {
      const invitadosEvento = evento.invitados ? evento.invitados.length : 0;
      const confirmadosEvento = evento.invitados ? evento.invitados.filter(i => i.estado && i.estado.toLowerCase() === 'confirmado').length : 0;
      const pendientesEvento = evento.invitados ? evento.invitados.filter(i => !i.estado || i.estado.toLowerCase() === 'pendiente').length : 0;
      const declinadosEvento = evento.invitados ? evento.invitados.filter(i => i.estado && i.estado.toLowerCase() === 'declinado').length : 0;
      
      datosPorEvento.push({
        'Evento': evento.nombre,
        'Fecha': evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-MX') : '',
        'Total Invitados': invitadosEvento,
        'Confirmados': confirmadosEvento,
        'Pendientes': pendientesEvento,
        'Declinados': declinadosEvento,
        'Tasa Confirmación': invitadosEvento > 0 ? `${((confirmadosEvento / invitadosEvento) * 100).toFixed(1)}%` : '0%'
      });
    });
    
    const worksheetPorEvento = XLSX.utils.json_to_sheet(datosPorEvento);
    worksheetPorEvento['!cols'] = [
      { wch: 25 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 18 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheetPorEvento, "Por Evento");

    // ========================================
    // GENERAR ARCHIVO Y ENVIARLO
    // ========================================
    
    // Convertir el workbook a buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      cellStyles: true // Mantener estilos si los hubiera
    });

    // Generar nombre de archivo con fecha actual
    const fechaActual = new Date().toISOString().split('T')[0]; // Formato: YYYY-MM-DD
    const nombreArchivo = `invitados_${usuario.nombre}_${fechaActual}.xlsx`;

    // Configurar headers HTTP para descarga
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Length', excelBuffer.length);

    // Enviar el archivo
    res.send(excelBuffer);

    console.log(`✅ Archivo Excel generado: ${nombreArchivo}`);
    console.log(`📊 Total de registros exportados: ${datosParaExcel.length}`);

  } catch (error) {
    console.error("❌ Error generando Excel:", error);
    
    // Enviar error al cliente
    res.status(500).json({
      success: false,
      message: 'Error al generar el archivo Excel',
      error: error.message
    });
  }
};