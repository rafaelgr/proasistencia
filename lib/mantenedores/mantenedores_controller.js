var express = require('express');
var router = express.Router();
var mantenedoresDb = require("./mantenedores_db_mysql");

// GetMantenedores
// Devuelve una lista de objetos con todos los mantenedores de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos mantenedores
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        mantenedoresDb.getMantenedoresBuscar(nombre, function(err, mantenedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(mantenedores);
            }
        });

    } else {
        mantenedoresDb.getMantenedores(function(err, mantenedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(mantenedores);
            }
        });
    }
});

// GetMantenedor
// devuelve el mantenedor con el id pasado
router.get('/:mantenedorId', function(req, res) {
    mantenedoresDb.getMantenedor(req.params.mantenedorId, function(err, mantenedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (mantenedor == null) {
                return res.status(404).send("Mantenedor no encontrado");
            } else {
                res.json(mantenedor);
            }
        }
    });
});

// PostMantenedor
// permite dar de alta un mantenedor
router.post('/', function(req, res) {
    mantenedoresDb.postMantenedor(req.body.mantenedor, function(err, mantenedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(mantenedor);
        }
    });
});



// PutMantenedor
// modifica el mantenedor con el id pasado
router.put('/:mantenedorId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    mantenedoresDb.getMantenedor(req.params.mantenedorId, function(err, mantenedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (mantenedor == null) {
                return res.status(404).send("Mantenedor no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                mantenedoresDb.putMantenedor(req.params.mantenedorId, req.body.mantenedor, function(err, mantenedor) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(mantenedor);
                    }
                });
            }
        }
    });
});

// DeleteMantenedor
// elimina un mantenedor de la base de datos
router.delete('/:mantenedorId', function(req, res) {
    var mantenedor = req.body.mantenedor;
    mantenedoresDb.deleteMantenedor(req.params.mantenedorId, mantenedor, function(err, mantenedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;