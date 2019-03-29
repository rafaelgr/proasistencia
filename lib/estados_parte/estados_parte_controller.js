var express = require('express');
var router = express.Router();
var estadoParteDb = require("./estados_parte_db_mysql");

// GetestadosParte
// Devuelve una lista de objetos con todos los articulos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos articulos
// que lo contengan.
router.get('/', function(req, res) {
        estadoParteDb.getEstadosParte(function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });
});

// GetestadoParte
// devuelve el grupo de articulo con el id pasado
router.get('/:estadoParteId', function(req, res) {
    estadoParteDb.getEstadoParte(req.params.estadoParteId, function(err, grupo) {
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

// PostEstadoParte
// permite dar de alta un grupo de articulos
router.post('/', function(req, res) {
        estadoParteDb.postEstadoParte(req.body.estadoParte, function(err, result) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(result);
            }
        });
});



// PutEstadoParte
// modifica el Estado de actuacion con el id pasado
router.put('/:estadoParteId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    estadoParteDb.getEstadoParte(req.params.estadoParteId, function(err, estado) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (estado == null) {
                return res.status(404).send("Estado de parte no encontrado");
            } else {    
                    estadoParteDb.putEstadoParte(req.params.estadoParteId, req.body.estadoParte, function(err, result) {
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

// DeleteEstadoParte
// elimina un articulo de la base de datos
router.delete('/:estadoParteId', function(req, res) {
    estadoParteDb.deleteEstadoParte(req.params.estadoParteId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;