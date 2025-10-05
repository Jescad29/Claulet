import express from "express";

const router = express.Router();

router.get('/organizador/:organizadorId', (req, res) => {
    res.render('organizador/organizador')
});

export default router