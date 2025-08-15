import express from "express";
import { mostrarLogin, iniciarSesion, obtenerUsuarios } from "../controllers/usuario.Controller.js";

const router = express.Router();

router.get('/login', mostrarLogin);

// Iniciar sesión

router.post('/login/iniciar-sesion', iniciarSesion);

export default router