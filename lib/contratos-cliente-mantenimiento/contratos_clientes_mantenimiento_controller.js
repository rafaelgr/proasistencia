var express = require('express');
var router = express.Router();
var contratosClientesMantenimientoDb = require("./contratos_clientes_mantenimiento_db_mysql"),
    prefacturasDb = require('../prefacturas/prefacturas_db_mysql');

// GetContratosClientesMantenimiento
// Devuelve una lista de objetos con todos los contratosClientesMantenimiento de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos contratosClientesMantenimiento
// que lo contengan.
router.get('/', function (req, res) {
    contratosClientesMantenimientoDb.getContratosClientesMantenimiento(function (err, contratosClientesMantenimiento) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratosClientesMantenimiento);
        }
    });
});

// GetContratoClienteMantenimiento
// devuelve el contrato contratoClienteMantenimiento con el id pasado
router.get('/:contratoClienteMantenimientoId', function (req, res) {
    contratosClientesMantenimientoDb.getContratoClienteMantenimiento(req.params.contratoClienteMantenimientoId, function (err, contratoClienteMantenimiento) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoClienteMantenimiento == null) {
                return res.status(404).send("Contrato cliente no encontrado");
            } else {
                res.json(contratoClienteMantenimiento);
            }
        }
    });
});

// GetContratoClienteMantenimientoEmpresaCliente
// Obtiene los contratos que tenemos con una empresa y cliente determinado
router.get('/empresa_cliente/:empresaId/:clienteId', function (req, res) {
    contratosClientesMantenimientoDb.getContratoClienteMantenimientoEmpresaCliente(req.params.empresaId, req.params.clienteId, function (err, contratos) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(contratos);
    });
});

// GetPrefacturasContrato
// devuelve el contrato contratoClienteMantenimiento con el id pasado
router.get('/prefacturas/:contratoClienteMantenimientoId', function (req, res) {
    prefacturasDb.getPrefacturasContrato(req.params.contratoClienteMantenimientoId, function (err, prefactura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefactura);
        }
    });
});

// PostContratoClienteMantenimiento
// permite dar de alta un contrato contratoClienteMantenimiento
router.post('/', function (req, res) {
    contratosClientesMantenimientoDb.postContratoClienteMantenimiento(req.body.contratoClienteMantenimiento
        , function (err, contratoClienteMantenimiento) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(contratoClienteMantenimiento);
            }
        });
});

// PostGenerarPrefacturas
// permite dar de alta un contrato contratoClienteMantenimiento
router.post('/prefacturas', function (req, res) {
    // obtenemos las propiedades que nos interesan del cuerpo
    // del contrato de mantenimiento.
    var lista = req.body.lista;
    var articuloId = req.body.articuloId;
    var contratoClienteMantenimientoId = req.body.contratoClienteMantenimientoId;
    contratosClientesMantenimientoDb.postGenerarPrefacturas(lista, articuloId, contratoClienteMantenimientoId
        , function (err, contratoClienteMantenimiento) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json('Ok');
            }
        });
});




// PutContratoClienteMantenimiento
// modifica el contrato comercial con el id pasado
router.put('/:contratoClienteMantenimientoId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    contratosClientesMantenimientoDb.getContratoClienteMantenimiento(req.params.contratoClienteMantenimientoId, function (err, contratoClienteMantenimiento) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoClienteMantenimiento == null) {
                return res.status(404).send("Contrato cliente-mantenimiento no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                contratosClientesMantenimientoDb.putContratoClienteMantenimiento(req.params.contratoClienteMantenimientoId, req.body.contratoClienteMantenimiento, function (err, contratoClienteMantenimiento) {
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
router.delete('/:contratoClienteMantenimientoId', function (req, res) {
    var contratoClienteMantenimiento = req.body.contratoClienteMantenimiento;
    contratosClientesMantenimientoDb.deleteContratoClienteMantenimiento(req.params.contratoClienteMantenimientoId, contratoClienteMantenimiento, function (err, contratoClienteMantenimiento) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// DeletePreFacturasContrato
// elimina las prefacturas asociadas a un contrato de mantenimiento
router.delete('/prefacturas/:contratoClienteMantenimientoId', function (req, res) {
    prefacturasDb.deletePrefacturasContrato(req.params.contratoClienteMantenimientoId, function (err, contratoClienteMantenimiento) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});







// Exports
module.exports = router;
