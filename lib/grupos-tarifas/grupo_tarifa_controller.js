var express = require('express');
var router = express.Router();
var grupoTarifasDb = require("./grupo_tarifa_db_mysql");

// GetGrupoTarifas
// Devuelve una lista de objetos con todos los tarifas de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos tarifas
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        grupoTarifasDb.getGrupoTarifasBuscar(nombre, function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });

    } else {
        grupoTarifasDb.getGrupoTarifas(function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });
    }
});

// GetGrupoTarifa
// devuelve el grupo de tarifa con el id pasado
router.get('/:grupoTarifaId', function(req, res) {
    grupoTarifasDb.getGrupoTarifa(req.params.grupoTarifaId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (grupo == null) {
                return res.status(404).send("Capitulo no encontrado");
            } else {
                res.json(grupo);
            }
        }
    });
});

// PostGrupoTarifa
// permite dar de alta un grupo de Tarifas
router.post('/', function(req, res) {
    grupoTarifasDb.postGrupoTarifa(req.body.grupoTarifa, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(grupo);
        }
    });
});



// PutGrupoTarifa
// modifica el tarifa con el id pasado
router.put('/:grupoTarifaId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    grupoTarifasDb.getGrupoTarifa(req.params.grupoTarifaId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (grupo == null) {
                return res.status(404).send("Tarifa no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                grupoTarifasDb.putGrupoTarifa(req.params.grupoTarifaId, req.body.grupoTarifa, function(err, grupo) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(grupo);
                    }
                });
            }
        }
    });
});

// DeleteGrupoTarifa
// elimina un tarifa de la base de datos
router.delete('/:grupoTarifaId', function(req, res) {
    grupoTarifasDb.deleteGrupoTarifa(req.params.grupoTarifaId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;