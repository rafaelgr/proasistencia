var express = require('express');
var router = express.Router();
var tiposTextoDb = require("./tipos_texto_db_mysql");

// GetTiposTexto
// Devuelve una lista de objetos con todos los formasPago de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos formasPago
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        tiposTextoDb.getTiposTextoBuscar(nombre, function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });

    } else {
        tiposTextoDb.getTiposTexto(function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });
    }
});

// GetTipoTexto
// devuelve el tipoTexto con el id pasado
router.get('/:tipoTextoId', function(req, res) {
    tiposTextoDb.getTipoTexto(req.params.tipoTextoId, function(err, tipoTexto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoTexto == null) {
                return res.status(404).send("TipoTexto no encontrado");
            } else {
                res.json(tipoTexto);
            }
        }
    });
});

// PostTipoTexto
// permite dar de alta un tipoTexto
router.post('/', function(req, res) {
    tiposTextoDb.postTipoTexto(req.body.tipoTexto, function(err, tipoTexto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tipoTexto);
        }
    });
});



// PutTipoTexto
// modifica el tipoTexto con el id pasado
router.put('/:tipoTextoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    tiposTextoDb.getTipoTexto(req.params.tipoTextoId, function(err, tipoTexto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoTexto == null) {
                return res.status(404).send("TipoTexto no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tiposTextoDb.putTipoTexto(req.params.tipoTextoId, req.body.tipoTexto, function(err, tipoTexto) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tipoTexto);
                    }
                });
            }
        }
    });
});

// DeleteTipoTexto
// elimina un tipoTexto de la base de datos
router.delete('/:tipoTextoId', function(req, res) {
    tiposTextoDb.deleteTipoTexto(req.params.tipoTextoId, function(err, tipoTexto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;