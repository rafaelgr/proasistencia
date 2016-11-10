var express = require('express');
var router = express.Router();
var tiposViaDb = require("./motivos_baja_db_mysql");

// GetMotivosBaja
// Devuelve una lista de objetos con todos los formasPago de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos formasPago
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        tiposViaDb.getMotivosBajaBuscar(nombre, function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });

    } else {
        tiposViaDb.getMotivosBaja(function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });
    }
});

// GetMotivoBaja
// devuelve el motivoBaja con el id pasado
router.get('/:motivoBajaId', function(req, res) {
    tiposViaDb.getMotivoBaja(req.params.motivoBajaId, function(err, motivoBaja) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (motivoBaja == null) {
                return res.status(404).send("MotivoBaja no encontrado");
            } else {
                res.json(motivoBaja);
            }
        }
    });
});

// PostMotivoBaja
// permite dar de alta un motivoBaja
router.post('/', function(req, res) {
    tiposViaDb.postMotivoBaja(req.body.motivoBaja, function(err, motivoBaja) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(motivoBaja);
        }
    });
});



// PutMotivoBaja
// modifica el motivoBaja con el id pasado
router.put('/:motivoBajaId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    tiposViaDb.getMotivoBaja(req.params.motivoBajaId, function(err, motivoBaja) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (motivoBaja == null) {
                return res.status(404).send("MotivoBaja no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tiposViaDb.putMotivoBaja(req.params.motivoBajaId, req.body.motivoBaja, function(err, motivoBaja) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(motivoBaja);
                    }
                });
            }
        }
    });
});

// DeleteMotivoBaja
// elimina un motivoBaja de la base de datos
router.delete('/:motivoBajaId', function(req, res) {
    tiposViaDb.deleteMotivoBaja(req.params.motivoBajaId, function(err, motivoBaja) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;