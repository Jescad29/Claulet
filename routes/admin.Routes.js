import express from "express";
import { mostrarAdmin } from "../controllers/admin.Controller.js";
import { crearEvento, obtenerEventos } from "../controllers/eventos.Controller.js";
import { crearUsuario, obtenerUsuarios, subirImagen } from "../controllers/usuario.Controller.js";

const router = express.Router();

router.get('/admin', mostrarAdmin);

router.get('/admin/api/crearEvento', obtenerUsuarios);

router.get('/admin/api/obtenerEventos', obtenerEventos);

router.post('/admin/api/eventos', crearEvento);

router.post('/admin/api/usuarios', crearUsuario);

export default router