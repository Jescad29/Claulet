import express from "express";

const router = express.Router();

router.get('/anfitrion/:anfitrionId', (req, res) => {
    res.render('anfitrion/host')
});

export default router