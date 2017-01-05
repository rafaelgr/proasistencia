var express = require('express');
var router = express.Router();
var articulosDb = require("./articulos_db_mysql");

// GetArticulos
// Devuelve una lista de objetos con todos los articulos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos articulos
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        articulosDb.getArticulosBuscar(nombre, function(err, articulos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(articulos);
            }
        });

    } else {
        articulosDb.getArticulos(function(err, articulos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(articulos);
            }
        });
    }
});

// GetArticulo
// devuelve el articulo con el id pasado
router.get('/:articuloId', function(req, res) {
    articulosDb.getArticulo(req.params.articuloId, function(err, articulo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (articulo == null) {
                return res.status(404).send("Articulo no encontrado");
            } else {
                res.json(articulo);
            }
        }
    });
});

router.get('/grupo/:grupoArticuloId', function(req, res){
    articulosDb.getArticulosPorGrupo(req.params.grupoArticuloId, function(err, articulos){
        if (err) return res.status(500).send(err.message);
        if (articulos.length == 0) return res.status(404).send("No hay artículos pertenecientes a este grupo");
        res.json(articulos);
    })
})

// PostArticulo
// permite dar de alta un articulo
router.post('/', function(req, res) {
    articulosDb.postArticulo(req.body.articulo, function(err, articulo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(articulo);
        }
    });
});



// PutArticulo
// modifica el articulo con el id pasado
router.put('/:articuloId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    articulosDb.getArticulo(req.params.articuloId, function(err, articulo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (articulo == null) {
                return res.status(404).send("Articulo no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                articulosDb.putArticulo(req.params.articuloId, req.body.articulo, function(err, articulo) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(articulo);
                    }
                });
            }
        }
    });
});

// DeleteArticulo
// elimina un articulo de la base de datos
router.delete('/:articuloId', function(req, res) {
    var articulo = req.body.articulo;
    articulosDb.deleteArticulo(req.params.articuloId, articulo, function(err, articulo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;