var express = require('express');
var router = express.Router();
var estadoExpedienteDb = require("./estados_expediente_db_mysql");

// GetestadosExpediente
// Devuelve una lista de objetos con todos los articulos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos articulos
// que lo contengan.
router.get('/', function(req, res) {
        estadoExpedienteDb.getEstadosExpediente(function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });
});

// GetestadoExpediente
// devuelve el grupo de articulo con el id pasado
router.get('/:estadoExpedienteId', function(req, res) {
    estadoExpedienteDb.getEstadoExpediente(req.params.estadoExpedienteId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (grupo == null) {
                return res.status(404).send("Estado de expediente no encontrado");
            } else {
                res.json(grupo);
            }
        }
    });
});

// PostEstadoExpediente
// permite dar de alta un grupo de articulos
router.post('/', function(req, res) {
        estadoExpedienteDb.postEstadoExpediente(req.body.estadoExpediente, function(err, result) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(result);
            }
        });
});



// PutEstadoExpediente
// modifica el Estado de actuacion con el id pasado
router.put('/:estadoExpedienteId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    estadoExpedienteDb.getEstadoExpediente(req.params.estadoExpedienteId, function(err, estado) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (estado == null) {
                return res.status(404).send("Estado de expediente no encontrado");
            } else {    
                    estadoExpedienteDb.putEstadoExpediente(req.params.estadoExpedienteId, req.body.estadoExpediente, function(err, result) {
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

// DeleteEstadoExpediente
// elimina un articulo de la base de datos
router.delete('/:estadoExpedienteId', function(req, res) {
    estadoExpedienteDb.deleteEstadoExpediente(req.params.estadoExpedienteId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;