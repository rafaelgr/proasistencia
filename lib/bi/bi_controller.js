var express = require('express');
var router = express.Router();
var biDb = require("./bi_db_mysql");

// GetUnidades
// Devuelve una lista de objetos con todos los bi de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos bi
// que lo contengan.
router.get('/sql/:tabla', function (req, res) {
    var tabla = req.params.tabla;
    if (!tabla) return res.status(400).send('Format de la petición incorrecto');
    biDb.getTabla(tabla, function (err, rows) {
        if (err) return res.status(500).json(err);
        res.json(rows);
    })

});

router.get('/test', function (req, res) {
    res.send('TEST');
});

router.get('/clientes', function (req, res) {
    biDb.getClientesContrato(function (err, rows) {
        if (err) return res.status(500).json(err);
        res.json(rows);
    })
});

router.get('/mantenedores', function (req, res) {
    biDb.getMantenedoresContrato(function (err, rows) {
        if (err) return res.status(500).json(err);
        res.json(rows);
    })
});

router.get('/proveedores', function (req, res) {
    biDb.getProveedoresFactura(function (err, rows) {
        if (err) return res.status(500).json(err);
        res.json(rows);
    })
});

// Exports
module.exports = router;