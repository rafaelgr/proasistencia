var express = require('express');
var router = express.Router();
var tiposIvaDb = require("./tipos_iva_db_mysql");

// GetTiposIva
// Devuelve una lista de objetos con todos los formasPago de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos formasPago
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        tiposIvaDb.getTiposIvaBuscar(nombre, function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });

    } else {
        tiposIvaDb.getTiposIva(function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });
    }
});

// GetTipoIva
// devuelve el tipoIva con el id pasado
router.get('/:tipoIvaId', function(req, res) {
    tiposIvaDb.getTipoIva(req.params.tipoIvaId, function(err, tipoIva) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoIva == null) {
                return res.status(404).send("TipoIva no encontrado");
            } else {
                res.json(tipoIva);
            }
        }
    });
});

// PostTipoIva
// permite dar de alta un tipoIva
router.post('/', function(req, res) {
    tiposIvaDb.postTipoIva(req.body.tipoIva, function(err, tipoIva) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tipoIva);
        }
    });
});



// PutTipoIva
// modifica el tipoIva con el id pasado
router.put('/:tipoIvaId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    tiposIvaDb.getTipoIva(req.params.tipoIvaId, function(err, tipoIva) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoIva == null) {
                return res.status(404).send("TipoIva no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tiposIvaDb.putTipoIva(req.params.tipoIvaId, req.body.tipoIva, function(err, tipoIva) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tipoIva);
                    }
                });
            }
        }
    });
});

// DeleteTipoIva
// elimina un tipoIva de la base de datos
router.delete('/:tipoIvaId', function(req, res) {
    tiposIvaDb.deleteTipoIva(req.params.tipoIvaId, function(err, tipoIva) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;