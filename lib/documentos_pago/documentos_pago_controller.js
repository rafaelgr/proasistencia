var express = require('express');
var router = express.Router();
var unidadesDb = require("./unidades_db_mysql");

// GetUnidades
// Devuelve una lista de objetos con todos los unidades de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos unidades
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        unidadesDb.getUnidadesBuscar(nombre, function(err, unidades) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(unidades);
            }
        });

    } else {
        unidadesDb.getUnidades(function(err, unidades) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(unidades);
            }
        });
    }
});

// GetUnidad
// devuelve el unidad con el id pasado
router.get('/:unidadId', function(req, res) {
    unidadesDb.getUnidad(req.params.unidadId, function(err, unidad) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (unidad == null) {
                res.status(404).send("Unidad no encontrado");
            } else {
                res.json(unidad);
            }
        }
    });
});

// Login
// comprueba si hay algún unidad con el login y password pasados
// si lo encuentra lo devuelve como objeto, si no devuelve nulo.
router.post('/login', function(req, res){
    unidadesDb.loginUnidades(req.body.unidad, function(err, unidad){
        if (err){
            res.status(500).send(err.message);
        }else{
            if (unidad == null) {
                res.status(404).send("Login o contraseña incorrectos");
            } else {
                res.json(unidad);
            }
        }
    });
});

// PostUnidad
// permite dar de alta un unidad
router.post('/', function(req, res) {
    unidadesDb.postUnidad(req.body.unidad, function(err, unidad) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(unidad);
        }
    });
});



// PutUnidad
// modifica el unidad con el id pasado
router.put('/:unidadId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    unidadesDb.getUnidad(req.params.unidadId, function(err, unidad) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (unidad == null) {
                res.status(404).send("Unidad no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                unidadesDb.putUnidad(req.params.unidadId, req.body.unidad, function(err, unidad) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(unidad);
                    }
                });
            }
        }
    });
});

// DeleteUnidad
// elimina un unidad de la base de datos
router.delete('/:unidadId', function(req, res) {
    var unidad = req.body.unidad;
    unidadesDb.deleteUnidad(req.params.unidadId, unidad, function(err, unidad) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;