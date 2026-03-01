// routes/invitacion.Routes.js

import express from 'express';
import { mostrarInvitacion, responderInvitacion } from '../controllers/invitacion.Controller.js';

const router = express.Router();

router.get('/invitacion', mostrarInvitacion);
router.post('/invitacion/responder', responderInvitacion);

export default router;