var express = require('express');
var router = express.Router();
var comercialesDb = require("./comerciales_db_mysql");

// GetComerciales
// Devuelve una lista de objetos con todos los comerciales de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos comerciales
// que lo contengan.
router.get('/', function (req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        comercialesDb.getComercialesBuscar(nombre, function (err, comerciales) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(comerciales);
            }
        });

    } else {
        comercialesDb.getComerciales(function (err, comerciales) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(comerciales);
            }
        });
    }
});

// getAgentes
router.get('/agentes', function (req, res) {
    comercialesDb.getAgentes(function (err, comerciales) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(comerciales);
        }
    });
});



// GetComercial
// devuelve el comercial con el id pasado
router.get('/:comercialId', function (req, res) {
    comercialesDb.getComercial(req.params.comercialId, function (err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (comercial == null) {
                return res.status(404).send("Comercial no encontrado");
            } else {
                res.json(comercial);
            }
        }
    });
});

// PostComercial
// permite dar de alta un comercial
router.post('/', function (req, res) {
    comercialesDb.postComercial(req.body.comercial, function (err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(comercial);
        }
    });
});



// PutComercial
// modifica el comercial con el id pasado
router.put('/:comercialId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    comercialesDb.getComercial(req.params.comercialId, function (err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (comercial == null) {
                return res.status(404).send("Comercial no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                comercialesDb.putComercial(req.params.comercialId, req.body.comercial, function (err, comercial) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(comercial);
                    }
                });
            }
        }
    });
});

// DeleteComercial
// elimina un comercial de la base de datos
router.delete('/:comercialId', function (req, res) {
    var comercial = req.body.comercial;
    comercialesDb.deleteComercial(req.params.comercialId, comercial, function (err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;