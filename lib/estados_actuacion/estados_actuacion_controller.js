var express = require('express');
var router = express.Router();
var estadoActuacionDb = require("./estados_actuacion_db_mysql");

// GetestadosActuacion
// Devuelve una lista de objetos con todos los articulos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos articulos
// que lo contengan.
router.get('/', function(req, res) {
        estadoActuacionDb.getEstadosActuacion(function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });
});

// GetestadoActuacion
// devuelve el grupo de articulo con el id pasado
router.get('/:estadoActuacionId', function(req, res) {
    estadoActuacionDb.getEstadoActuacion(req.params.estadoActuacionId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (grupo == null) {
                return res.status(404).send("Estado de actuacion no encontrado");
            } else {
                res.json(grupo);
            }
        }
    });
});

// PostEstadoActuacion
// permite dar de alta un grupo de articulos
router.post('/', function(req, res) {
        estadoActuacionDb.postEstadoActuacion(req.body.estadoActuacion, function(err, result) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(result);
            }
        });
});



// PutEstadoActuacion
// modifica el Estado de actuacion con el id pasado
router.put('/:estadoActuacionId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    estadoActuacionDb.getEstadoActuacion(req.params.estadoActuacionId, function(err, estado) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (estado == null) {
                return res.status(404).send("Estado de actuacion no encontrado");
            } else {    
                    estadoActuacionDb.putEstadoActuacion(req.params.estadoActuacionId, req.body.estadoActuacion, function(err, result) {
                        if (err) {
                            return res.status(500).send(err.message);
                        } else {
                            res.json(result);
                        }
                    });
            }
        }
    });
});

// DeleteEstadoActuacion
// elimina un articulo de la base de datos
router.delete('/:estadoActuacionId', function(req, res) {
    estadoActuacionDb.deleteEstadoActuacion(req.params.estadoActuacionId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;