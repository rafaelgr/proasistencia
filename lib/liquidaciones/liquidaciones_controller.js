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

// PostFacturaLiquidacion
router.post('/facturas/:dFecha/:hFecha/:departamentoId/:empresaId/:comercialId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var empresaId = req.params.empresaId;
    var comercialId = req.params.comercialId;
    var usuarioId = req.params.usuarioId;
    liquidacionesDb.postFacturaLiquidacionAgente(dFecha, hFecha, parseInt(departamentoId), parseInt(empresaId), parseInt(comercialId), parseInt(usuarioId), function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(null);
    });
})

router.post('/contratos/:dFecha/:hFecha/:departamentoId/:empresaId/:comercialId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var empresaId = req.params.empresaId;
    var comercialId = req.params.comercialId;
    var usuarioId = req.params.usuarioId;
    liquidacionesDb.postFacturaLiquidacionContratos(dFecha, hFecha, parseInt(departamentoId), parseInt(empresaId), parseInt(comercialId), parseInt(usuarioId), function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(null);
    });
})

// GetCheckFacturasLiquidadas 
router.get('/checkFacturas/:dFecha/:hFecha/:departamentoId/:empresaId/:tipoComercialId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var empresaId = req.params.empresaId;
    var tipoComercialId = req.params.tipoComercialId;
    var usuarioId = req.params.usuarioId; 
    liquidacionesDb.checkFacturasLiquidadas(dFecha, hFecha, parseInt(departamentoId), parseInt(empresaId), parseInt(tipoComercialId), parseInt(usuarioId), function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
})

router.get('/checkContratos/:dFecha/:hFecha/:departamentoId/:empresaId/:tipoComercialId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var empresaId = req.params.empresaId;
    var tipoComercialId = req.params.tipoComercialId;
    var usuarioId = req.params.usuarioId;
    liquidacionesDb.checkContratosLiquidados(dFecha, hFecha, parseInt(departamentoId), parseInt(empresaId), parseInt(tipoComercialId), parseInt(usuarioId), function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
})

// GetLiquidacionAcumulada.
router.get('/acumulada/:dFecha/:hFecha/:tipoComercialId/:contratoId/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var tipoComercialId = req.params.tipoComercialId;
    var contratoId = req.params.contratoId;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId
    liquidacionesDb.getLiquidacionAcumulada(dFecha, hFecha, parseInt(tipoComercialId), parseInt(contratoId), parseInt(departamentoId), usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
})

// GetLiquidacionAcumulada de comercial y contrato cerrado
router.get('/acumulada/comerciales/:comercialId/:contratoId', function (req, res) {
    var comercialId = req.params.comercialId;
    var contratoId = req.params.contratoId;
    liquidacionesDb.getLiquidacionAcumuladaComercial(parseInt(comercialId), parseInt(contratoId),function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
})

// GetLiquidacionDetalle
router.get('/detalle/:dFecha/:hFecha/:comercialId/:departamentoId/:usuario', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var comercialId = req.params.comercialId;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuario;
    liquidacionesDb.getLiquidacionDetalle(dFecha, hFecha, comercialId, parseInt(departamentoId), usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
})

router.get('/detalle/liquidacion/comercial/:comercialId/:contratoId', function (req, res) {
    var comercialId = req.params.comercialId;
    var contratoId = req.params.contratoId;
    liquidacionesDb.getLiquidacionDetalleComercial( comercialId, contratoId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
})

// PutLiquidacion
// modifica el liquidacion con el id pasado
router.put('/:liquidacionId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    liquidacionesDb.getLiquidacion(req.params.liquidacionId, function (err, liquidacion) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (liquidacion == null) {
                return res.status(404).send("Liquidacion no encontrada");
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

// DeleteLiquidacion
// elimina todas las liquidaciones relacionada con una factura
router.delete('/borrar-factura/:facturaId', function (req, res) {
    var factura = req.body.facturaId;
    liquidacionesDb.deleteLiquidacionFactura(req.params.facturaId, factura,function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//Obtiene un objeto JSON para el informe de liquidaciones por colaborador
router.post('/colaborador/informe/crea/json/:dFecha/:hFecha/:comercialId/:tipoComercialId/:departamentoId/:usuario', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var comercialId = req.params.comercialId;
    var tipoComercialId = req.params.tipoComercialId;
    var usuario = req.params.usuario
    liquidacionesDb.postCrearReportColaboradores(dFecha, hFecha, parseInt(departamentoId), parseInt(tipoComercialId), parseInt(comercialId), usuario, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Exports
module.exports = router;