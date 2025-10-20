import express from "express";
import { datosOrganizador, exportarExcel } from "../controllers/organizador.Controller.js";

const router = express.Router();

// Trae los datos del organizador 
router.get('/organizador/:organizadorId', datosOrganizador);

// ✅ NUEVO: Ruta para exportar a Excel
router.get('/organizador/:organizadorId/exportar', exportarExcel);

export default router