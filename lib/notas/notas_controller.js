var express = require('express');
var router = express.Router();
var notasDb = require("./notas_db_mysql");

// notas web
router.get('/notasweb/:registroId', async (req, res, next) => {
    try {
        const notasWeb = await notasDb.getNotasWeb(req.params.registroId);
        res.json(notasWeb);
    } catch (e) {
        next(e);
    }
});

router.get('/notasweb-linea/contrato/:notaId', async (req, res, next) => {
    try {
        const notaWeb = await notasDb.getNotaWeb(req.params.notaId);
        res.json(notaWeb[0]);
    } catch (e) {
        next(e);
    }
});

router.post('/notasweb/contrato', async (req, res, next) => {
    try {
        const notaWeb = await notasDb.postNotaWeb(req.body.nota);
        res.json(notaWeb);
    } catch (e) {
        next(e);
    }
});

router.put('/notasweb/contrato/:notaId', async (req, res, next) => {
    try {
        const notaWeb = await notasDb.putNotaWeb(req.body.nota, req.params.notaId);
        res.json(notaWeb);
    } catch (e) {
        next(e);
    }
});

router.delete('/notasweb/contrato/:notaId', async (req, res, next) => {
    try {
        const notaWeb = await notasDb.deleteNotaWeb(req.params.notaId);
        res.json(notaWeb);
    } catch (e) {
        next(e);
    }
});

// Exports
module.exports = router;