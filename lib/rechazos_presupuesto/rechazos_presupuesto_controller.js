var express = require('express');
var router = express.Router();
var rechazoPresupuestoDb = require("./rechazos_presupuesto_db_mysql");

// GetrechazosPresupuesto
// Devuelve una lista de objetos con todos los articulos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos articulos
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        rechazoPresupuestoDb.getRechazosPresupuestoBuscar(nombre, function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });

    } else {
        rechazoPresupuestoDb.getRechazosPresupuesto(function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });
    }
});

// GetrechazoPresupuesto
// devuelve el grupo de articulo con el id pasado
router.get('/:rechazoPresupuestoId', function(req, res) {
    rechazoPresupuestoDb.getRechazoPresupuesto(req.params.rechazoPresupuestoId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (grupo == null) {
                return res.status(404).send("Rechazo de presupuesto no encontrado");
            } else {
                res.json(grupo);
            }
        }
    });
});

// PostRechazoPresupuesto
// permite dar de alta un grupo de articulos
router.post('/', function(req, res) {
        rechazoPresupuestoDb.postRechazoPresupuesto(req.body.rechazoPresupuesto, function(err, result) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(result);
            }
        });
});



// PutRechazoPresupuesto
// modifica el Rechazo de presupuesto con el id pasado
router.put('/:rechazoPresupuestoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    rechazoPresupuestoDb.getRechazoPresupuesto(req.params.rechazoPresupuestoId, function(err, rechazo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (rechazo == null) {
                return res.status(404).send("Rechazo de presupuesto no encontrado");
            } else {    
                    rechazoPresupuestoDb.putRechazoPresupuesto(req.params.rechazoPresupuestoId, req.body.rechazoPresupuesto, function(err, result) {
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

// DeleteRechazoPresupuesto
// elimina un articulo de la base de datos
router.delete('/:rechazoPresupuestoId', function(req, res) {
    rechazoPresupuestoDb.deleteRechazoPresupuesto(req.params.rechazoPresupuestoId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;