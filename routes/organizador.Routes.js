import express from "express";
import { datosOrganizador   } from "../controllers/organizador.Controller.js";

const router = express.Router();

// Trae los datos del organizador 
router.get('/organizador/:organizadorId', datosOrganizador);

// obtiene todos los eventos del organizador
// router.get('/organizador/api/eventos', obtenerEventosOrganizador); 


export default router