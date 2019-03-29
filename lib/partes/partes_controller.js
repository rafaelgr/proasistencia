var express = require('express');
var router = express.Router();
var partesDb = require("./partes_db_mysql");

// GetPartes
// Devuelve una lista de objetos con todos los partes de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos partes
// que lo contengan.
router.get('/', function(req, res) {
    
        partesDb.getPartes(function(err, partes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(partes);
            }
        });
});

// GetParte
// devuelve el parte con el id pasado
router.get('/:parteId', function(req, res) {
    partesDb.getParte(req.params.parteId, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});


// GetParte
// devuelve las partes de un servicio
router.get('/servicio/:servicioId', function(req, res) {
    partesDb.getParteServicio(req.params.servicioId, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});



// PostParte
// permite dar de alta un parte
router.post('/', function(req, res) {
    partesDb.postParte(req.body.parte, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});



// PutParte
// modifica el parte con el id pasado
router.put('/:parteId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    partesDb.getParte(req.params.parteId, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (parte == null) {
                res.status(404).send("Parte no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                partesDb.putParte(req.params.parteId, req.body.parte, function(err, parte) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(parte);
                    }
                });
            }
        }
    });
});

// DeleteParte
// elimina un parte de la base de datos
router.delete('/:parteId', function(req, res) {
    var parte = req.body.parte;
    partesDb.deleteParte(req.params.parteId, parte, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;