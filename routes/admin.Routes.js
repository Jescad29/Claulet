import express from "express";
import { mostrarAdmin } from "../controllers/admin.Controller.js";
import { crearEvento, obtenerEventos, obtenerEvento, editarEvento, eliminarEvento } from "../controllers/eventos.Controller.js";
import { obtenerInvitados, crearInvitado, importarInvitados, obtenerInvitado, editarInvitado, eliminarInvitado } from "../controllers/invitados.Controller.js";
import { crearUsuario,borrarUsuario, obtenerUsuario, editarUsuario, obtenerUsuarios, obtenerUsuariosCompleto, editarPasswordUsuario, subirImagen } from "../controllers/usuario.Controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get('/admin', mostrarAdmin);

// Admin Api Dashboard
    
// Usuarios
router.post('/admin/api/usuarios', crearUsuario);

router.get('/admin/api/editarUsuario/obtenerUsuario/:usuarioId', obtenerUsuario);
router.put('/admin/api/editarUsuario/:usuarioId', editarUsuario);
router.put('/admin/api/editarPasswordUsuario/:usuarioId', editarPasswordUsuario);
router.delete('/admin/api/editarUsuario/:usuarioId', borrarUsuario);

router.get('/admin/api/usuarios/todos', obtenerUsuariosCompleto);
// Eventos
router.get('/admin/api/crearEvento', obtenerUsuarios);

router.get('/admin/api/obtenerEventos', obtenerEventos);

router.get('/admin/api/editarEvento/:eventoId', obtenerEvento);
router.put('/admin/api/editarEvento/:eventoId', editarEvento);

router.post('/admin/api/eventos', crearEvento);

router.delete("/admin/api/eventos/:eventoId", eliminarEvento);

// Invitados
router.get('/admin/api/invitados/:eventoId', obtenerInvitados);

router.post('/admin/api/invitados', crearInvitado)

router.get('/admin/api/invitado/:invitadoId', obtenerInvitado)
router.delete('/admin/api/invitado/:invitadoId', eliminarInvitado)
router.put('/admin/api/invitado', editarInvitado)

router.post('/admin/api/invitados/import',upload.single("file"), importarInvitados)

export default router