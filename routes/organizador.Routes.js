import express from "express";
import { datosOrganizador } from "../controllers/organizador.Controller.js";

const router = express.Router();

router.get('/organizador/:organizadorId', datosOrganizador);

export default router