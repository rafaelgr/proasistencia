var express = require('express');
var router = express.Router();
var localesAfectadosDb = require("./locales_afectados_db_mysql");

// GetLocalesAfectados
// Devuelve una lista de objetos con todos los locales de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos locales
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        localesAfectadosDb.getLocalesAfectadosBuscar(nombre, function(err, localesAfectados) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(localesAfectados);
            }
        });

    } else {
        localesAfectadosDb.getLocalesAfectados(function(err, localesAfectados) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(localesAfectados);
            }
        });
    }
});

// GetLocalAfectado
// devuelve el localAfectado con el id pasado
router.get('/:localAfectadoId', function(req, res) {
    localesAfectadosDb.getLocalAfectado(req.params.localAfectadoId, function(err, localAfectado) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (localAfectado == null) {
                res.status(404).send("Local no encontrado");
            } else {
                res.json(localAfectado);
            }
        }
    });
});



// PostLocalAfectado
// permite dar de alta un localAfectado
router.post('/', function(req, res) {
    localesAfectadosDb.postLocalAfectado(req.body.localAfectado, function(err, localAfectado) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(localAfectado);
        }
    });
});



// PutLocalAfectado
// modifica el localAfectado con el id pasado
router.put('/:localAfectadoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    localesAfectadosDb.getLocalAfectado(req.params.localAfectadoId, function(err, localAfectado) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (localAfectado == null) {
                res.status(404).send("Local no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                localesAfectadosDb.putLocalAfectado(req.params.localAfectadoId, req.body.localAfectado, function(err, localAfectado) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(localAfectado);
                    }
                });
            }
        }
    });
});

// DeleteLocalAfectado
// elimina un localAfectado de la base de datos
router.delete('/:localAfectadoId', function(req, res) {
    var localAfectado = req.body.localAfectado;
    localesAfectadosDb.deleteLocalAfectado(req.params.localAfectadoId, localAfectado, function(err, localAfectado) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;