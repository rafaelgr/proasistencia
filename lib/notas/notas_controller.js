var express = require('express');
var router = express.Router();
var notasDb = require("./notas_db_mysql");

router.get('/:notaId', async (req, res, next) => {
    try {
        const notaWeb = await notasDb.getNotaWeb(req.params.notaId);
        res.json(notaWeb[0]);
    } catch (e) {
        next(e);
    }
});


router.get('/por-tipo/:registroId/:tipo', async (req, res, next) => {
    try {
        const notasWeb = await notasDb.getNotasWeb(req.params.registroId, req.params.tipo);
        res.json(notasWeb);
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const notaWeb = await notasDb.postNotaWeb(req.body.nota);
        res.json(notaWeb);
    } catch (e) {
        next(e);
    }
});

router.put('/:notaId', async (req, res, next) => {
    try {
        const notaWeb = await notasDb.putNotaWeb(req.body.nota, req.params.notaId);
        res.json(notaWeb);
    } catch (e) {
        next(e);
    }
});

router.delete('/:notaId', async (req, res, next) => {
    try {
        const notaWeb = await notasDb.deleteNotaWeb(req.params.notaId);
        res.json(notaWeb);
    } catch (e) {
        next(e);
    }
});

// Exports
module.exports = router;