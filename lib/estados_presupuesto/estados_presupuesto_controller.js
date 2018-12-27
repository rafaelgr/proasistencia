var express = require('express');
var router = express.Router();
var estadoPresupuestoDb = require("./estados_presupuesto_db_mysql");

// GetestadosPresupuesto
// Devuelve una lista de objetos con todos los articulos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos articulos
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        estadoPresupuestoDb.getEstadosPresupuestoBuscar(nombre, function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });

    } else {
        estadoPresupuestoDb.getestadosPresupuesto(function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });
    }
});

// GetestadoPresupuesto
// devuelve el grupo de articulo con el id pasado
router.get('/:estadoPresupuestoId', function(req, res) {
    estadoPresupuestoDb.getEstadoPresupuesto(req.params.estadoPresupuestoId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (grupo == null) {
                return res.status(404).send("Estado de presupuesto no encontrado");
            } else {
                res.json(grupo);
            }
        }
    });
});

// PostEstadoPresupuesto
// permite dar de alta un grupo de articulos
router.post('/', function(req, res) {
        estadoPresupuestoDb.postEstadoPresupuesto(req.body.estadoPresupuesto, function(err, result) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(result);
            }
        });
});



// PutEstadoPresupuesto
// modifica el Estado de presupuesto con el id pasado
router.put('/:estadoPresupuestoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    estadoPresupuestoDb.getEstadoPresupuesto(req.params.estadoPresupuestoId, function(err, estado) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (estado == null) {
                return res.status(404).send("Estado de presupuesto no encontrado");
            } else {    
                    estadoPresupuestoDb.putEstadoPresupuesto(req.params.estadoPresupuestoId, req.body.estadoPresupuesto, function(err, result) {
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

// DeleteEstadoPresupuesto
// elimina un articulo de la base de datos
router.delete('/:estadoPresupuestoId', function(req, res) {
    estadoPresupuestoDb.deleteEstadoPresupuesto(req.params.estadoPresupuestoId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;