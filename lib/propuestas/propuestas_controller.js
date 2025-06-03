var express = require('express');
var router = express.Router();
var propuestasDb = require("./propuestas_db_mysql");

router.get('/:subContrataId', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuesta(req.params.subContrataId);
        if (propuestas == null) return res.status(404).send("Propuesta no encontrada");
        res.json(propuestas);
        
    } catch(err) {
        return next(res.status(500).send(err.message));
    }
});

router.get('/subcontrata/:propuestaId', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuestasSubcontrata(req.params.propuestaId);
        if (propuestas == null) return res.status(404).send("Propuestas no encontradas");
        res.json(propuestas);
        
    } catch(err) {
        return next(res.status(500).send(err.message));
    }
});

router.get('/lineas/:propuestaId', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuestaLineas(req.params.propuestaId);
        if (propuestas == null) return res.status(404).send("Propuestas no encontradas");
        res.json(propuestas);
        
    } catch(err) {
        return next(res.status(500).send(err.message));
    }
});

// Exports
module.exports = router;