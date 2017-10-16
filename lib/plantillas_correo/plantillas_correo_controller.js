var express = require('express');
var router = express.Router();
var tiposViaDb = require("./tipos_via_db_mysql");

// GetTiposVia
// Devuelve una lista de objetos con todos los formasPago de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos formasPago
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        tiposViaDb.getTiposViaBuscar(nombre, function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });

    } else {
        tiposViaDb.getTiposVia(function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });
    }
});

// GetTipoVia
// devuelve el tipoVia con el id pasado
router.get('/:tipoViaId', function(req, res) {
    tiposViaDb.getTipoVia(req.params.tipoViaId, function(err, tipoVia) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoVia == null) {
                return res.status(404).send("TipoVia no encontrado");
            } else {
                res.json(tipoVia);
            }
        }
    });
});

// PostTipoVia
// permite dar de alta un tipoVia
router.post('/', function(req, res) {
    tiposViaDb.postTipoVia(req.body.tipoVia, function(err, tipoVia) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tipoVia);
        }
    });
});



// PutTipoVia
// modifica el tipoVia con el id pasado
router.put('/:tipoViaId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    tiposViaDb.getTipoVia(req.params.tipoViaId, function(err, tipoVia) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoVia == null) {
                return res.status(404).send("TipoVia no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tiposViaDb.putTipoVia(req.params.tipoViaId, req.body.tipoVia, function(err, tipoVia) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tipoVia);
                    }
                });
            }
        }
    });
});

// DeleteTipoVia
// elimina un tipoVia de la base de datos
router.delete('/:tipoViaId', function(req, res) {
    tiposViaDb.deleteTipoVia(req.params.tipoViaId, function(err, tipoVia) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;