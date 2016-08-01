var express = require('express');
var router = express.Router();
var contratoMantenimientoComisionistas = require("./contrato_mantenimiento_comisionistas_db_mysql");

// GetContratoMantenimientoComisionistas
// Devuelve una lista de objetos con todos los contratoMantenimientoComisionistas de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos contratoMantenimientoComisionistas
// que lo contengan.
router.get('/', function (req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        contratoMantenimientoComisionistas.getContratosMantenimientoComisionistasBuscar(nombre, function (err, contratoMantenimientoComisionistas) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(contratoMantenimientoComisionistas);
            }
        });

    } else {
        contratoMantenimientoComisionistas.getContratosMantenimientoComisionistas(function (err, contratoMantenimientoComisionistas) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(contratoMantenimientoComisionistas);
            }
        });
    }
});

// GetContratoComisionista
// devuelve el contratoMantenimientoComisionista con el id pasado
router.get('/:contratoMantenimientoComisionistaId', function (req, res) {
    contratoMantenimientoComisionistas.getContratoMantenimientoComisionista(req.params.contratoMantenimientoComisionistaId, function (err, contratoMantenimientoComisionista) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoMantenimientoComisionista == null) {
                return res.status(404).send("Comisionista de contrato no encontrado");
            } else {
                res.json(contratoMantenimientoComisionista);
            }
        }
    });
});

//geComisionistasMantenimiento
router.get('/mantenimiento/:mantenimientoId', function (req, res) {
    contratoMantenimientoComisionistas.getComisionistasMantenimiento(req.params.mantenimientoId, function (err, contratos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {

            res.json(contratos);
        }
    });
});

// PostContratoComisionista
// permite dar de alta un contratoMantenimientoComisionista
router.post('/', function (req, res) {
    contratoMantenimientoComisionistas.postContratoMantenimientoComisionista(req.body.contratoMantenimientoComisionista, function (err, contratoMantenimientoComisionista) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratoMantenimientoComisionista);
        }
    });
});

// POST -- 
router.post('/cargarcomisiones', function(req, res){
    var contratoClienteMantenimientoId = req.body.contratoClienteMantenimientoId;
    var clienteId = req.body.clienteId;
    contratoMantenimientoComisionistas.cargarComisionistasPorDefecto(contratoClienteMantenimientoId, clienteId, function(err, result){
        if (err){
            return res.status(500).send(err.message);
        }
        res.json('OK');
    })
});


// PutContratoComisionista
// modifica el contratoMantenimientoComisionista con el id pasado
router.put('/:contratoMantenimientoComisionistaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    contratoMantenimientoComisionistas.getContratoMantenimientoComisionista(req.params.contratoMantenimientoComisionistaId, function (err, contratoMantenimientoComisionista) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoMantenimientoComisionista == null) {
                return res.status(404).send("ContratoComisionista no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                contratoMantenimientoComisionistas.putContratoMantenimientoComisionista(req.params.contratoMantenimientoComisionistaId, req.body.contratoMantenimientoComisionista, function (err, contratoMantenimientoComisionista) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(contratoMantenimientoComisionista);
                    }
                });
            }
        }
    });
});

// DeleteContratoComisionista
// elimina un contratoMantenimientoComisionista de la base de datos
router.delete('/:contratoMantenimientoComisionistaId', function (req, res) {
    var contratoMantenimientoComisionista = req.body.contratoMantenimientoComisionista;
    contratoMantenimientoComisionistas.deleteContratoMantenimientoComisionista(req.params.contratoMantenimientoComisionistaId, contratoMantenimientoComisionista, function (err, contratoMantenimientoComisionista) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;