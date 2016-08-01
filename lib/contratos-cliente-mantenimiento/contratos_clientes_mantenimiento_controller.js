var express = require('express');
var router = express.Router();
var contratosClientesMantenimientoDb = require("./contratos_clientes_mantenimiento_db_mysql");

// GetContratosClientesMantenimiento
// Devuelve una lista de objetos con todos los contratosClientesMantenimiento de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos contratosClientesMantenimiento
// que lo contengan.
router.get('/', function(req, res) {
    contratosClientesMantenimientoDb.getContratosClientesMantenimiento(function(err, contratosClientesMantenimiento) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratosClientesMantenimiento);
        }
    });
});

// GetContratoClienteMantenimiento
// devuelve el contrato contratoClienteMantenimiento con el id pasado
router.get('/:contratoClienteMantenimientoId', function(req, res) {
    contratosClientesMantenimientoDb.getContratoClienteMantenimiento(req.params.contratoClienteMantenimientoId, function(err, contratoClienteMantenimiento) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoClienteMantenimiento == null) {
                return res.status(404).send("Contrato cliente-mantenimiento no encontrado");
            } else {
                res.json(contratoClienteMantenimiento);
            }
        }
    });
});

// PostContratoClienteMantenimiento
// permite dar de alta un contrato contratoClienteMantenimiento
router.post('/', function(req, res) {
    contratosClientesMantenimientoDb.postContratoClienteMantenimiento(req.body.contratoClienteMantenimiento
, function(err, contratoClienteMantenimiento) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratoClienteMantenimiento);
        }
    });
});



// PutContratoClienteMantenimiento
// modifica el contrato comercial con el id pasado
router.put('/:contratoClienteMantenimientoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    contratosClientesMantenimientoDb.getContratoClienteMantenimiento(req.params.contratoClienteMantenimientoId, function(err, contratoClienteMantenimiento) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoClienteMantenimiento == null) {
                return res.status(404).send("Contrato cliente-mantenimiento no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                contratosClientesMantenimientoDb.putContratoClienteMantenimiento(req.params.contratoClienteMantenimientoId, req.body.contratoClienteMantenimiento, function(err, contratoClienteMantenimiento) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(contratoClienteMantenimiento);
                    }
                });
            }
        }
    });
});

// DeleteContratoClienteMantenimiento
// elimina un contratoClienteMantenimiento de la base de datos
router.delete('/:contratoClienteMantenimientoId', function(req, res) {
    var contratoClienteMantenimiento = req.body.contratoClienteMantenimiento;
    contratosClientesMantenimientoDb.deleteContratoClienteMantenimiento(req.params.contratoClienteMantenimientoId, contratoClienteMantenimiento, function(err, contratoClienteMantenimiento) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;
