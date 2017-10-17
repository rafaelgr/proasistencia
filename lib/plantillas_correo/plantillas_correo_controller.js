var express = require('express');
var router = express.Router();
var tiposViaDb = require("./plantillas_correo_db_mysql");

// GetPlantillasCorreo
// Devuelve una lista de objetos con todos los formasPago de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos formasPago
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        tiposViaDb.getPlantillasCorreoBuscar(nombre, function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });

    } else {
        tiposViaDb.getPlantillasCorreo(function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });
    }
});

// GetTipoVia
// devuelve el tipoVia con el id pasado
router.get('/:plaCoFacId', function(req, res) {
    tiposViaDb.getPlantillaCorreo(req.params.plaCoFacId, function(err, tipoVia) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoVia == null) {
                return res.status(404).send("TipoVia no encontrado");
            } else {
                res.json(tipoVia);
            }
        }
    });
});

// PostPlantillaCorreo
// permite dar de alta un tipoVia
router.post('/', function(req, res) {
    tiposViaDb.postPlantillaCorreo(req.body.getPlantillaCorreo, function(err, platillaCorreo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(platillaCorreo);
        }
    });
});



// PutPlantillaCorreo
// modifica el tipoVia con el id pasado
router.put('/:plaCoFacId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    tiposViaDb.getTipoVia(req.params.plaCoFacId, function(err, plantillaCorreo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (plantillaCorreo == null) {
                return res.status(404).send("TipoVia no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tiposViaDb.putTipoVia(req.params.plaCoFacId, req.body.plantillaCorreo, function(err, plantillaCorreo) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(plantillaCorreo);
                    }
                });
            }
        }
    });
});

// DeleteTipoVia
// elimina un tipoVia de la base de datos
router.delete('/:plaCoFacId', function(req, res) {
    tiposViaDb.deleteTipoVia(req.params.plaCoFacId, function(err, plantillaCorreo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;