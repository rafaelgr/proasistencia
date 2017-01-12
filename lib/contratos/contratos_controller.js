var express = require('express'),
    router = express.Router(),
    contratosDb = require('./contratos_db_mysql');

router.get('/', function (req, res) {
    contratosDb.getContratos(function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    })
})

router.get('/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send('Debe especificar el código de el contrato que desea consultar');
    contratosDb.getContrato(contratoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        if (contratos.length == 0) return res.status(404).send('Contrato no encontrada');
        var contrato = contratos[0];
        res.json(contrato);
    })
});

router.post('/', function(req, res){
    var contrato = req.body.contrato;
    if (!contrato) return res.status(400).send('Debe incluir el contrato a dar de alta en el cuerpo del mensaje');
    contratosDb.postContrato(contrato, function(err, contrato){
        if (err) return res.status(500).send(err.message);
        res.json(contrato);
    });
});

router.put('/:contratoId', function(req, res){
    var contrato = req.body.contrato;
    if (!contrato) return res.status(400).send('Debe incluir el contrato a modificar en el cuerpo del mensaje');
    contratosDb.putContrato(contrato, function(err, contrato){
        if (err) return res.status(500).send(err.message);
        res.json(contrato);
    });
});

router.delete('/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send('Debe indicar el identificador de el contrato a eliminar');
    var contrato = {
        contratoId: contratoId
    };
    contratosDb.deleteContrato(contrato, function(err, contrato){
        if (err) return res.status(500).send(err.message);
        res.json(contrato);
    });
});

router.put('/recalculo/:contratoId/:coste/:porcentajeBeneficio/:porcentajeAgente', function (req, res) {
    var contratoId = req.params.contratoId,
        coste = req.params.coste,
        porcentajeBeneficio = req.params.porcentajeBeneficio,
        porcentajeAgente = req.params.porcentajeAgente;
    if (!contratoId || !coste || !porcentajeBeneficio || !porcentajeAgente) {
        return res.status(400).send('Faltan parámetros para el recálculo de el contrato');
    }
    contratosDb.recalculoLineasContrato(contratoId, coste, porcentajeBeneficio, porcentajeAgente, function(err){
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

/* ----------------------
    LINEAS DE OFERTA
-------------------------*/

// GetNextContratoLine
// devuelve el contrato con el id pasado
router.get('/nextlinea/:contratoId', function (req, res) {
    contratosDb.getNextContratoLineas(req.params.contratoId, function (err, contrato) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contrato == null) {
                return res.status(404).send("Contrato no encontrado");
            } else {
                res.json(contrato);
            }
        }
    });
});

// GetContratoLineas
// devuelve el contrato con el id pasado
router.get('/lineas/:contratoId', function (req, res) {
    contratosDb.getContratoLineas(req.params.contratoId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("Contrato sin lineas");
            } else {
                res.json(lineas);
            }
        }
    });
});

// GetContratoLinea
// devuelve el contrato con el id pasado
router.get('/linea/:contratoLineaId', function (req, res) {
    contratosDb.getContratoLinea(req.params.contratoLineaId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("No existe la linea de contrato solicitada");
            } else {
                res.json(lineas);
            }
        }
    });
});


// PostContratoLinea
// permite dar de alta un linea de contrato
router.post('/lineas/', function (req, res) {
    contratosDb.postContratoLinea(req.body.contratoLinea, function (err, contratoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratoLinea);
        }
    });
});



// PutContratoLinea
// modifica el contrato con el id pasado
router.put('/lineas/:contratoLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    contratosDb.getContratoLinea(req.params.contratoLineaId, function (err, contratoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoLinea == null) {
                return res.status(404).send("Linea de contrato no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                contratosDb.putContratoLinea(req.params.contratoLineaId, req.body.contratoLinea, function (err, contratoLinea) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(contratoLinea);
                    }
                });
            }
        }
    });
});

// DeleteContratoLinea
// elimina un contrato de la base de datos
router.delete('/lineas/:contratoLineaId', function (req, res) {
    var contratoLinea = req.body.contratoLinea;
    contratosDb.deleteContratoLinea(req.params.contratoLineaId, contratoLinea, function (err, contratoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// GetContratoBases
// devuelve el contrato con el id pasado
router.get('/bases/:contratoId', function (req, res) {
    contratosDb.getContratoBases(req.params.contratoId, function (err, bases) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (bases == null) {
                return res.status(404).send("Contrato sin bases");
            } else {
                res.json(bases);
            }
        }
    });
});

// Exports
module.exports = router;