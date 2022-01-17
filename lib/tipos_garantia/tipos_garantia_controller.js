var express = require('express');
var router = express.Router();
var tiposGarantiaDb = require("./tipos_garantia_db_mysql");

// GetTiposGarantia
// Devuelve una lista de objetos con todos los formasPago de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos formasPago
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        tiposGarantiaDb.getTiposGarantiaBuscar(nombre, function(err, tipoGarantia) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(tipoGarantia);
            }
        });

    } else {
        tiposGarantiaDb.getTiposGarantia(function(err, tipoGarantia) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(tipoGarantia);
            }
        });
    }
});

// GetTipoGarantia
// devuelve el tipoGarantia con el id pasado
router.get('/:tipoGarantiaId', function(req, res) {
    tiposGarantiaDb.getTipoGarantia(req.params.tipoGarantiaId, function(err, tipoGarantia) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoGarantia == null) {
                return res.status(404).send("TipoGarantia no encontrado");
            } else {
                res.json(tipoGarantia);
            }
        }
    });
});



// PostTipoGarantia
// permite dar de alta un tipoGarantia
router.post('/', function(req, res) {
    tiposGarantiaDb.postTipoGarantia(req.body.tipoGarantia, function(err, tipoGarantia) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tipoGarantia);
        }
    });
});



// PutTipoGarantia
// modifica el tipoGarantia con el id pasado
router.put('/:tipoGarantiaId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    tiposGarantiaDb.getTipoGarantia(req.params.tipoGarantiaId, function(err, tipoGarantia) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoGarantia == null) {
                return res.status(404).send("TipoGarantia no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tiposGarantiaDb.putTipoGarantia(req.params.tipoGarantiaId, req.body.tipoGarantia, function(err, tipoGarantia) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tipoGarantia);
                    }
                });
            }
        }
    });
});

// DeleteTipoGarantia
// elimina un tipoGarantia de la base de datos
router.delete('/:tipoGarantiaId', function(req, res) {
    tiposGarantiaDb.deleteTipoGarantia(req.params.tipoGarantiaId, function(err, tipoGarantia) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;