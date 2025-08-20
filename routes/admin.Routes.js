import express from "express";
import { mostrarAdmin } from "../controllers/admin.Controller.js";
import { crearEvento, obtenerEventos, obtenerEvento, editarEvento, eliminarEvento } from "../controllers/eventos.Controller.js";
import { obtenerInvitados, crearInvitado, importarInvitados } from "../controllers/invitados.Controller.js";
import { crearUsuario, obtenerUsuarios, subirImagen } from "../controllers/usuario.Controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get('/admin', mostrarAdmin);

router.get('/admin/api/crearEvento', obtenerUsuarios);

router.get('/admin/api/obtenerEventos', obtenerEventos);

router.get('/admin/api/editarEvento/:eventoId', obtenerEvento);
router.put('/admin/api/editarEvento/:eventoId', editarEvento);

router.post('/admin/api/eventos', crearEvento);

router.delete("/admin/api/eventos/:eventoId", eliminarEvento);

router.post('/admin/api/usuarios', crearUsuario);

router.get('/admin/api/invitados/:eventoId', obtenerInvitados);

router.post('/admin/api/invitados', crearInvitado)

router.post('/admin/api/invitados/import',upload.single("file"), importarInvitados)

export default router