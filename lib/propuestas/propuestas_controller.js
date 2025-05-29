var express = require('express');
var router = express.Router();
var propuestasDb = require("./propuestas_db_mysql");

router.get('/subcontrata/:propuestaId', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuestasSubcontrata(req.params.propuestaId);
        if (propuestas == null) return res.status(404).send("Propuestas no encontradas");
        res.json(propuestas);
        
    } catch(err) {
        return next(res.status(500).send(err.message));
    }
});

// Exports
module.exports = router;