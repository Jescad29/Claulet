import express from "express";

const router = express.Router();

router.get('/scanner', (req, res) => {
    res.render('escaner/scanner')
});

export default router