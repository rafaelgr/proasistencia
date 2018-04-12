var express = require('express');
var router = express.Router();
var tiposProfesionalDb = require("./tipos_profesional_db_mysql");

// GetTiposProfesional
// Devuelve una lista de objetos con todos los formasPago de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos formasPago
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        tiposProfesionalDb.getTiposProfesionalesBuscar(nombre, function(err, tipoProfesional) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(tipoProfesional);
            }
        });

    } else {
        tiposProfesionalDb.getTiposProfesionales(function(err, tipoProfesional) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(tipoProfesional);
            }
        });
    }
});

// GetTipoProfesional
// devuelve el tipoProfesional con el id pasado
router.get('/:tipoProfesionalId', function(req, res) {
    tiposProfesionalDb.getTipoProfesional(req.params.tipoProfesionalId, function(err, tipoProfesional) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoProfesional == null) {
                return res.status(404).send("TipoProfesional no encontrado");
            } else {
                res.json(tipoProfesional);
            }
        }
    });
});

// PostTipoProfesional
// permite dar de alta un tipoProfesional
router.post('/', function(req, res) {
    tiposProfesionalDb.postTipoProfesional(req.body.tipoProfesional, function(err, tipoProfesional) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tipoProfesional);
        }
    });
});



// PutTipoProfesional
// modifica el tipoProfesional con el id pasado
router.put('/:tipoProfesionalId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    tiposProfesionalDb.getTipoProfesional(req.params.tipoProfesionalId, function(err, tipoProfesional) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoProfesional == null) {
                return res.status(404).send("TipoProfesional no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tiposProfesionalDb.putTipoProfesional(req.params.tipoProfesionalId, req.body.tipoProfesional, function(err, tipoProfesional) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tipoProfesional);
                    }
                });
            }
        }
    });
});

// DeleteTipoProfesional
// elimina un tipoProfesional de la base de datos
router.delete('/:tipoProfesionalId', function(req, res) {
    tiposProfesionalDb.deleteTipoProfesional(req.params.tipoProfesionalId, function(err, tipoProfesional) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;