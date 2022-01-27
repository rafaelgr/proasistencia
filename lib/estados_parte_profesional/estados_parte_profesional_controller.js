var express = require('express');
var router = express.Router();
var estadoParteProfesionalDb = require("./estados_parte_profesional_db_mysql");

// GetestadosParte
// Devuelve una lista de objetos con todos los articulos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos articulos
// que lo contengan.
router.get('/', function(req, res) {
        estadoParteProfesionalDb.getEstadosParteProfesional(function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });
});

router.get('/movil/:cerrado', function(req, res) {
    estadoParteProfesionalDb.getEstadosParteProfesionalMovil(req.params.cerrado, function(err, grupos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(grupos);
        }
    });
});

// GetestadoParteProfesional
// devuelve el grupo de articulo con el id pasado
router.get('/:estadoParteProfesionalId', function(req, res) {
    estadoParteProfesionalDb.getEstadoParteProfesional(req.params.estadoParteProfesionalId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (grupo == null) {
                return res.status(404).send("Estado de parte no encontrado");
            } else {
                res.json(grupo);
            }
        }
    });
});

// PostestadoParteProfesional
// permite dar de alta un grupo de articulos
router.post('/', function(req, res) {
        estadoParteProfesionalDb.postEstadoParteProfesional(req.body.estadoParteProfesional, function(err, result) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(result);
            }
        });
});



// PutestadoParteProfesional
// modifica el Estado de actuacion con el id pasado
router.put('/:estadoParteProfesionalId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    estadoParteProfesionalDb.getEstadoParteProfesional(req.params.estadoParteProfesionalId, function(err, estado) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (estado == null) {
                return res.status(404).send("Estado de parte no encontrado");
            } else {    
                    estadoParteProfesionalDb.putEstadoParteProfesional(req.params.estadoParteProfesionalId, req.body.estadoParteProfesional, function(err, result) {
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

// DeleteestadoParteProfesional
// elimina un articulo de la base de datos
router.delete('/:estadoParteProfesionalId', function(req, res) {
    estadoParteProfesionalDb.deleteEstadoParteProfesional(req.params.estadoParteProfesionalId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;