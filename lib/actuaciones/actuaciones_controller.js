var express = require('express');
var router = express.Router();
var actuacionesDb = require("./actuaciones_db_mysql");

// GetActuaciones
// Devuelve una lista de objetos con todos los actuaciones de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos actuaciones
// que lo contengan.
router.get('/', function(req, res) {
    
        actuacionesDb.getActuaciones(function(err, actuaciones) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(actuaciones);
            }
        });
});

// GetActuacion
// devuelve el actuacion con el id pasado
router.get('/:actuacionId', function(req, res) {
    actuacionesDb.getActuacion(req.params.actuacionId, function(err, actuacion) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (actuacion == null) {
                res.status(404).send("Actuacion no encontrado");
            } else {
                res.json(actuacion);
            }
        }
    });
});


// GetActuacion
// devuelve las actuaciones de un servicio
router.get('/sevicio/:servicioId', function(req, res) {
    actuacionesDb.getActuacionServicio(req.params.servicioId, function(err, actuacion) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (actuacion == null) {
                res.status(404).send("Actuacion no encontrado");
            } else {
                res.json(actuacion);
            }
        }
    });
});



// PostActuacion
// permite dar de alta un actuacion
router.post('/', function(req, res) {
    actuacionesDb.postActuacion(req.body.actuacion, function(err, actuacion) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(actuacion);
        }
    });
});



// PutActuacion
// modifica el actuacion con el id pasado
router.put('/:actuacionId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    actuacionesDb.getActuacion(req.params.actuacionId, function(err, actuacion) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (actuacion == null) {
                res.status(404).send("Actuacion no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                actuacionesDb.putActuacion(req.params.actuacionId, req.body.actuacion, function(err, actuacion) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(actuacion);
                    }
                });
            }
        }
    });
});

// DeleteActuacion
// elimina un actuacion de la base de datos
router.delete('/:actuacionId', function(req, res) {
    var actuacion = req.body.actuacion;
    actuacionesDb.deleteActuacion(req.params.actuacionId, actuacion, function(err, actuacion) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;