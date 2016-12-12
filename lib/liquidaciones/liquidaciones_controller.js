var express = require('express');
var router = express.Router();
var liquidacionesDb = require("./liquidaciones_db_mysql");

// GetLiquidaciones
// Devuelve una lista de objetos con todos los liquidaciones de la 
// base de datos.
router.get('/', function (req, res) {
    liquidacionesDb.getLiquidaciones(function (err, liquidaciones) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(liquidaciones);
        }
    });
});

// GetLiquidacion
// devuelve el liquidacion con el id pasado
router.get('/:liquidacionId', function (req, res) {
    liquidacionesDb.getLiquidacion(req.params.liquidacionId, function (err, liquidacion) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (liquidacion == null) {
                return res.status(404).send("Liquidacion no encontrada");
            } else {
                res.json(liquidacion);
            }
        }
    });
});

// PostLiquidacion
// permite dar de alta un liquidacion
router.post('/', function (req, res) {
    liquidacionesDb.postLiquidacion(req.body.liquidacion, function (err, liquidacion) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(liquidacion);
        }
    });
});



// PutLiquidacion
// modifica el liquidacion con el id pasado
router.put('/:liquidacionId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    liquidacionesDb.getLiquidacion(req.params.liquidacionId, function (err, liquidacion) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (liquidacion == null) {
                return res.status(404).send("Liquidacion no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                liquidacionesDb.putLiquidacion(req.params.liquidacionId, req.body.liquidacion, function (err, liquidacion) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(liquidacion);
                    }
                });
            }
        }
    });
});

// DeleteLiquidacion
// elimina un liquidacion de la base de datos
router.delete('/:liquidacionId', function (req, res) {
    var liquidacion = req.body.liquidacion;
    liquidacionesDb.deleteLiquidacion(req.params.liquidacionId, liquidacion, function (err, liquidacion) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;