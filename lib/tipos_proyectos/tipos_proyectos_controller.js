var express = require('express');
var router = express.Router();
var tiposProyectoDb = require("./tipos_proyectos_db_mysql");

// GetTiposProyecto
// Devuelve una lista de objetos con todos los tiposProyecto de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos tiposProyecto
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        tiposProyectoDb.getTiposProyectoBuscar(nombre, function(err, tiposProyecto) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(tiposProyecto);
            }
        });

    } else {
        tiposProyectoDb.getTiposProyecto(function(err, tiposProyecto) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(tiposProyecto);
            }
        });
    }
});

// GetTipoProyecto
// devuelve el tipoProyecto con el id pasado
router.get('/:tipoProyectoId', function(req, res) {
    tiposProyectoDb.getTipoProyecto(req.params.tipoProyectoId, function(err, tipoProyecto) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (tipoProyecto == null) {
                res.status(404).send("Tipo de proyecto no encontrado");
            } else {
                res.json(tipoProyecto);
            }
        }
    });
});

// PostTipoProyecto
// permite dar de alta un tipoProyecto
router.post('/', function(req, res) {
    tiposProyectoDb.postTipoProyecto(req.body.tipoProyecto, function(err, tipoProyecto) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(tipoProyecto);
        }
    });
});



// PutTipoProyecto
// modifica el tipoProyecto con el id pasado
router.put('/:tipoProyectoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    tiposProyectoDb.getTipoProyecto(req.params.tipoProyectoId, function(err, tipoProyecto) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (tipoProyecto == null) {
                res.status(404).send("TipoProyecto no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tiposProyectoDb.putTipoProyecto(req.params.tipoProyectoId, req.body.tipoProyecto, function(err, tipoProyecto) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(tipoProyecto);
                    }
                });
            }
        }
    });
});

// DeleteTipoProyecto
// elimina un tipoProyecto de la base de datos
router.delete('/:tipoProyectoId', function(req, res) {
    var tipoProyecto = req.body.tipoProyecto;
    tiposProyectoDb.deleteTipoProyecto(req.params.tipoProyectoId, tipoProyecto, function(err, tipoProyecto) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;