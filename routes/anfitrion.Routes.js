import express from "express";

const router = express.Router();

router.get('/anfitrion', (req, res) => {
    res.render('anfitrion/host')
});

export default router