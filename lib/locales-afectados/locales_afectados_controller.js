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

// GetLocalesAfectadosServicio
// devuelve los locales afectados de un servicio determinado
router.get('/servicio/:servicioId', function(req, res) {
    localesAfectadosDb.getLocalesAfectadosServicio(req.params.servicioId, function(err, localesAfectados) {
        if (err) {
            res.status(500).send(err.message);
        } else {
                res.json(localesAfectados);
        }
    });
});

// GetLocalesAfectadosServicioParte
// devuelve los locales afectados de un servicio y parte determinado
router.get('/servicio/parte/:servicioId/:parteId', function(req, res) {
    localesAfectadosDb.getLocalesAfectadosServicioParte(req.params.servicioId, req.params.parteId,function(err, localesAfectados) {
        if (err) {
            res.status(500).send(err.message);
        } else {
                res.json(localesAfectados);
        }
    });
});

// GetLocalesAfectadosServicio
// devuelve los locales afectados de un servicio determinado que no tienen parte asignado
router.get('/servicio/no/parte/:servicioId/:parteId', function(req, res) {
    localesAfectadosDb.getLocalesAfectadosServicioNoParte(req.params.servicioId, req.params.parteId,function(err, localesAfectados) {
        if (err) {
            res.status(500).send(err.message);
        } else {
                res.json(localesAfectados);
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

// PostLocalAfectadoParte
// permite dar de alta un localAfectado an la tabla locales_afectados y en la table partes_locales
router.post('/parte/:parteId', function(req, res) {
    localesAfectadosDb.postLocalAfectadoParte(req.body.localAfectado, req.params.parteId,function(err, localAfectado) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(localAfectado);
        }
    });
});

// PostLocalAfectadoParte
// permite dar de alta  locales afectados en la tabla partes_locales
router.post('/partes/locales/:parteId', function(req, res) {
    localesAfectadosDb.postLocalesAfectadosParteLocales(req.body.partesLocales, req.params.parteId,function(err, localAfectado) {
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
    localesAfectadosDb.deleteLocalAfectado(req.params.localAfectadoId, localAfectado, function(err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// DeleteLocalAfectado
// elimina un localAfectado de la base de datos
router.delete('/ParteLocal/:localAfectadoId/:parteId', function(req, res) {
    localesAfectadosDb.deleteParteLocal(req.params.localAfectadoId, req.params.parteId, function(err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// Exports
module.exports = router;