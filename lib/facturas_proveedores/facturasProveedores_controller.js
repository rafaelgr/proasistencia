var express = require('express');
var router = express.Router();
var prefacturasDb = require("./facturasProveedores_db_mysql");

// GetPrefacturas
// Devuelve una lista de objetos con todos los prefacturas de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos prefacturas
// que lo contengan.
router.get('/', function (req, res) {
    prefacturasDb.getFacturasProveedores(function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

router.get('/all/', function (req, res) {
    prefacturasDb.getPrefacturasAll(function (err, prefacturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturas);
        }
    });
});

// Getfactura
// devuelve la factura con el id pasado
router.get('/:facproveId', function (req, res) {
    prefacturasDb.getFacturaProveedor(req.params.facproveId, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(factura);
        }
    });
});

router.get('/contrato/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    prefacturasDb.getPrefacturasContrato(contratoId, function(err, prefacturas){
        if (err) return res.status(500).send(err.message);
        res.json(prefacturas);
    })
});

router.get('/contrato/generadas/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    prefacturasDb.getPrefacturasContratoGeneradas(contratoId, function(err, prefacturas){
        if (err) return res.status(500).send(err.message);
        res.json(prefacturas);
    })
});

router.delete('/contrato/generadas/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    prefacturasDb.deletePrefacturasContratoGeneradas(contratoId, function(err){
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

// GetEmision
// obtiene las prefacturas entre las fechas pasadas y que no han sido facturadas con anterioridad.
router.get('/emision/:dFecha/:hFecha/:clienteId/:agenteId/:tipoMantenimientoId/:empresaId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var clienteId = req.params.clienteId;
    var agenteId = req.params.agenteId;
    var empresaId = req.params.empresaId;
    var tipoMantenimientoId = req.params.tipoMantenimientoId;
    prefacturasDb.getPreEmisionPrefacturas(dFecha, hFecha, clienteId, agenteId, tipoMantenimientoId, empresaId, function (err, prefacturas) {
        if (err) return res.status(500).send(err.message);
        res.json(prefacturas);
    });
})


// PostFactura
// permite dar de alta una factura de proveedor
router.post('/', function (req, res) {
    prefacturasDb.postFactura(req.body.facprove, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(factura);
        }
    });
});



// PutFactura
// modifica el prefactura con el id pasado
router.put('/:facproveId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    prefacturasDb.getFacturaProveedor(req.params.facproveId, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (factura == null) {
                return res.status(404).send("factura no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                prefacturasDb.putFactura(req.params.facproveId, req.body.facprove, function (err, factura) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(factura);
                    }
                });
            }
        }
    });
});

// PutRecalculo
// Recalcula las líneas y totales de una prefactura dada
// en función de los porcentajes pasados.
router.put('/recalculo/:prefacturaId/:coste/:porcentajeBeneficio/:porcentajeAgente/:tipoClienteId', function (req, res) {
    var prefacturaId = req.params.prefacturaId,
        coste = req.params.coste,
        porcentajeBeneficio = req.params.porcentajeBeneficio,
        porcentajeAgente = req.params.porcentajeAgente,
        tipoClienteId = req.params.tipoClienteId;
    if (!prefacturaId || !coste || !porcentajeBeneficio || !porcentajeAgente) {
        return res.status(400).send('Faltan parámetros para el recálculo de la factura');
    }
    prefacturasDb.recalculoLineasPrefactura(prefacturaId, coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId, function(err){
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

// DeleteFactura
// elimina un prefactura de la base de datos
router.delete('/:facproveId', function (req, res) {
    var facproveId = req.body.facproveId;
    prefacturasDb.deleteFactura(req.params.facproveId, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

/* ----------------------
    LINEAS DE PREFACTURA
-------------------------*/

// GetNextPrefacturaLine
// devuelve el prefactura con el id pasado
router.get('/nextlinea/:prefacturaId', function (req, res) {
    prefacturasDb.getNextPrefacturaLineas(req.params.prefacturaId, function (err, prefactura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefactura == null) {
                return res.status(404).send("Prefactura no encontrado");
            } else {
                res.json(prefactura);
            }
        }
    });
});

// GetPrefacturaLineas
// devuelve el prefactura con el id pasado
router.get('/lineas/:facproveId', function (req, res) {
    prefacturasDb.getFacturaLineas(req.params.facproveId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("Prefactura sin lineas");
            } else {
                res.json(lineas);
            }
        }
    });
});

// GetPrefacturaLinea
// devuelve las lineas de una factura con el id pasado
router.get('/linea/:facproveLineaId', function (req, res) {
    prefacturasDb.getFacturaLinea(req.params.facproveLineaId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("No existe la linea de prefactura solicitada");
            } else {
                res.json(lineas);
            }
        }
    });
});


// PostFacturaLinea
// permite dar de alta un linea de factura proveedor
router.post('/lineas/', function (req, res) {
    prefacturasDb.postFacturaLinea(req.body.facproveLinea, function (err, prefacturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturaLinea);
        }
    });
});



// PutFacturaLinea
// modifica la factura con el id pasado
router.put('/lineas/:prefacturaLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    prefacturasDb.getFacturaLinea(req.params.facproveLineaId, function (err, facproveLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (facproveLinea == null) {
                return res.status(404).send("Linea de prefactura no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                prefacturasDb.putPrefacturaLinea(req.params.facproveLineaId, req.body.facproveLinea, function (err, facproveLinea) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(facproveLinea);
                    }
                });
            }
        }
    });
});

// DeletePrefacturaLinea
// elimina un prefactura de la base de datos
router.delete('/lineas/:prefacturaLineaId', function (req, res) {
    var prefacturaLinea = req.body.prefacturaLinea;
    prefacturasDb.deletePrefacturaLinea(req.params.prefacturaLineaId, prefacturaLinea, function (err, prefacturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// GetFacturaBases
// devuelve la factura con el id pasado
router.get('/bases/:facproveId', function (req, res) {
    prefacturasDb.getFacturaBases(req.params.facproveId, function (err, bases) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (bases == null) {
                return res.status(404).send("Factura sin bases");
            } else {
                res.json(bases);
            }
        }
    });
});



// Exports
module.exports = router;