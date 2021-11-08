var express = require('express');
var router = express.Router();
var cobrosDb = require("./cobros_db_mysql");

router.get('/factura/:facturaId', function (req, res) {
    cobrosDb.getCobrosFactura(req.params.facturaId, function (err, cobros) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cobros);
        }
    });
});

router.get('/factura/hlinapu/:facturaId', function (req, res) {
    cobrosDb.getCobrosFacturaHlinapu(req.params.facturaId, function (err, cobros) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cobros);
        }
    });
});


router.get('/cliente/:clienteId', function (req, res) {
    cobrosDb.getCobrosCliente(req.params.clienteId, function (err, cobros) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cobros);
        }
    });
});

router.get('/contrato/:contratoId', function (req, res) {
    cobrosDb.getCobrosContrato(req.params.contratoId, function (err, cobros) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cobros);
        }
    });
});

router.get('/contrato/hlinapu/:contratoId', function (req, res) {
    cobrosDb.getCobrosContratoHlinapu(req.params.contratoId, function (err, cobros) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cobros);
        }
    });
});
module.exports = router;