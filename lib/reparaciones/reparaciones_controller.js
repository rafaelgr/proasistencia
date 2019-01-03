var express = require('express');
var router = express.Router();
var reparacionesDb = require("./reparaciones_db_mysql");

// GetReparaciones
// Devuelve una lista de objetos con todos los reparaciones de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos reparaciones
// que lo contengan.
router.get('/', function(req, res) {
    
        reparacionesDb.getReparaciones(function(err, reparaciones) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(reparaciones);
            }
        });
});

// GetReparacion
// devuelve el reparacion con el id pasado
router.get('/:reparacionId', function(req, res) {
    reparacionesDb.getReparacion(req.params.reparacionId, function(err, reparacion) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(reparacion);
        }
    });
});


// GetReparacion
// devuelve las reparaciones de un servicio
router.get('/actuaciones/:actuacionId', function(req, res) {
    reparacionesDb.getReparacionServicio(req.params.actuacionId, function(err, reparacion) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(reparacion);
        }
    });
});



// PostReparacion
// permite dar de alta un reparacion
router.post('/', function(req, res) {
    reparacionesDb.postReparacion(req.body.reparacion, function(err, reparacion) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(reparacion);
        }
    });
});



// PutReparacion
// modifica el reparacion con el id pasado
router.put('/:reparacionId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    reparacionesDb.getReparacion(req.params.reparacionId, function(err, reparacion) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (reparacion == null) {
                res.status(404).send("Reparacion no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                reparacionesDb.putReparacion(req.params.reparacionId, req.body.reparacion, function(err, reparacion) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(reparacion);
                    }
                });
            }
        }
    });
});

// DeleteReparacion
// elimina un reparacion de la base de datos
router.delete('/:reparacionId', function(req, res) {
    var reparacion = req.body.reparacion;
    reparacionesDb.deleteReparacion(req.params.reparacionId, reparacion, function(err, reparacion) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;