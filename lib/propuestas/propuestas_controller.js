var express = require('express');
var router = express.Router();
var propuestasDb = require("./propuestas_db_mysql");

router.get('/:propuestaId', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuesta(req.params.propuestaId);
        if (propuestas == null) return res.status(404).send("Propuesta no encontrada");
        res.json(propuestas);
        
    } catch(err) {
        return next(res.status(500).send(err.message));
    }
});

router.get('/subcontrata/:subcontrataId', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuestasSubcontrata(req.params.subcontrataId);
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

router.get('/expediente/:expedienteId/:ganadora', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuestasExpediente(req.params.expedienteId, req.params.ganadora);
        if (propuestas == null) return res.status(404).send("Propuestas no encontradas");
        res.json(propuestas);
        
    } catch(err) {
        return next(res.status(500).send(err.message));
    }
});

router.post('/:subContrataId', async (req, res, next) => {
    try {
        var propuesta = req.body.propuesta;
        var subContrataId = req.params.subContrataId;
        if (!propuesta) return res.status(400).send('No se ha enviado nada.');
        let nuevaPropuesta = await propuestasDb.postPropuestaLineas(propuesta, subContrataId);
        return res.json(nuevaPropuesta);

    }  catch(err) {
        return next(res.status(500).send(err.message));
    }
    
});

router.put('/', async (req, res, next) => {
    try {
        var propuesta = req.body.propuesta;
        if (!propuesta) return res.status(400).send('No se ha enviado nada.');
        let result = await propuestasDb.putPropuestaLineas(propuesta);
        return res.json(result);
    }  catch(err) {
        return next(res.status(500).send(err.message));
    }
    
});


router.delete('/:propuestaId', async (req, res, next) => {
    try {
        var propuestaId = req.params.propuestaId;
        if (!propuestaId) return res.status(400).send('Falta el identidicador de la propuesta.');
        let result = await propuestasDb.deletePropuestaLineas(propuestaId);
        return res.json(result);
    }  catch(err) {
        return next(res.status(500).send(err.message));
    }
    
});


router.delete('/lineas/:propuestaLineaId/:propuestaId', async (req, res, next) => {
    try {
        var propuestaLineaId = req.params.propuestaLineaId;
           var propuestaId = req.params.propuestaId;
        if (!propuestaLineaId) return res.status(400).send('Falta el identidicador de la linea.');
        let result = await propuestasDb.deletePropuestaLinea(propuestaLineaId, propuestaId);
        return res.json(result);
    }  catch(err) {
        return next(res.status(500).send(err.message));
    }
    
});


// Exports
module.exports = router;