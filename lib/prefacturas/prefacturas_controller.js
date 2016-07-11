var express = require('express');
var router = express.Router();
var prefacturasDb = require("./prefacturas_db_mysql");

// GetPrefacturas
// Devuelve una lista de objetos con todos los prefacturas de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos prefacturas
// que lo contengan.
router.get('/', function(req, res) {
    prefacturasDb.getPrefacturas(function(err, prefacturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturas);
        }
    });
});

// GetPrefactura
// devuelve el prefactura con el id pasado
router.get('/:prefacturaId', function(req, res) {
    prefacturasDb.getPrefactura(req.params.prefacturaId, function(err, prefactura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefactura == null) {
                return res.status(404).send("Prefactura no encontrado");
            } else {
                res.json(prefactura);
            }
        }
    });
});

// GetNextPrefacturaLine
// devuelve el prefactura con el id pasado
router.get('/nextline/:prefacturaId', function(req, res) {
    prefacturasDb.getNextPrefacturaLine(req.params.prefacturaId, function(err, prefactura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefactura == null) {
                return res.status(404).send("Prefactura no encontrado");
            } else {
                res.json(prefactura);
            }
        }
    });
});

// PostPrefactura
// permite dar de alta un prefactura
router.post('/', function(req, res) {
    prefacturasDb.postPrefactura(req.body.prefactura, function(err, prefactura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefactura);
        }
    });
});



// PutPrefactura
// modifica el prefactura con el id pasado
router.put('/:prefacturaId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    prefacturasDb.getPrefactura(req.params.prefacturaId, function(err, prefactura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefactura == null) {
                return res.status(404).send("Prefactura no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                prefacturasDb.putPrefactura(req.params.prefacturaId, req.body.prefactura, function(err, prefactura) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(prefactura);
                    }
                });
            }
        }
    });
});

// DeletePrefactura
// elimina un prefactura de la base de datos
router.delete('/:prefacturaId', function(req, res) {
    var prefactura = req.body.prefactura;
    prefacturasDb.deletePrefactura(req.params.prefacturaId, prefactura, function(err, prefactura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;
