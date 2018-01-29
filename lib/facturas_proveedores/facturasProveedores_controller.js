var express = require('express');
var router = express.Router();
var facturasProveedoresDb = require("./facturasProveedores_db_mysql");

// GetPrefacturas
// Devuelve una lista de objetos con todos los prefacturas de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos prefacturas
// que lo contengan.
router.get('/', function (req, res) {
    facturasProveedoresDb.getFacturasProveedores(function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

router.get('/all/', function (req, res) {
    facturasProveedoresDb.getPrefacturasAll(function (err, prefacturas) {
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
    facturasProveedoresDb.getFacturaProveedor(req.params.facproveId, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(factura);
        }
    });
});


// Getfactura
// devuelve las facturas de un proveedor
router.get('/proveedor/facturas/solapa/muestra/tabla/datos/factura/:proveedorId', function (req, res) {
    facturasProveedoresDb.getFacturaProveedorId(req.params.proveedorId, function (err, factura) {
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
    facturasProveedoresDb.getFacturasContrato(contratoId, function(err, prefacturas){
        if (err) return res.status(500).send(err.message);
        res.json(prefacturas);
    })
});


router.get('/contrato/generadas/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    facturasProveedoresDb.getPrefacturasContratoGeneradas(contratoId, function(err, prefacturas){
        if (err) return res.status(500).send(err.message);
        res.json(prefacturas);
    })
});


//devuelve el tipo de cliente de un contrato
router.get('/contrato/tipo/cliente/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    facturasProveedoresDb.getTipoCliente(contratoId, function(err, datos){
        if (err) return res.status(500).send(err.message);
        res.json(datos);
    })
});

// Obtener lista de facturas individuales para exportar a PDF
router.get('/facpdf/:dFecha/:hFecha/:empresaId/:proveedorId', function(req, res){
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var empresaId = req.params.empresaId;
    var proveedorId = req.params.proveedorId;
    if (!dFecha || !hFecha) return res.status(400).send('Debe escoger al menos un rango de fechas');
    facturasProveedoresDb.getFacPdf(dFecha, hFecha, empresaId, proveedorId, function(err, data){
        if (err) return res.status(500).send(err.message);
        res.json("OK");
    });
});

router.delete('/contrato/generadas/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    facturasProveedoresDb.deletePrefacturasContratoGeneradas(contratoId, function(err){
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
    facturasProveedoresDb.getPreEmisionPrefacturas(dFecha, hFecha, clienteId, agenteId, tipoMantenimientoId, empresaId, function (err, prefacturas) {
        if (err) return res.status(500).send(err.message);
        res.json(prefacturas);
    });
})

router.get('/nuevo/Cod/proveedor/factura/ultima/ref/:fecha', function (req, res) {
    var fecha = req.params.fecha;
    facturasProveedoresDb.getNuevaRefFacprove(fecha, function (err, facprove) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facprove);
        }
    });
});



// PostFactura
// permite dar de alta una factura de proveedor
router.post('/', function (req, res) {
    facturasProveedoresDb.postFactura(req.body.facprove, function (err, factura) {
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
    facturasProveedoresDb.getFacturaProveedor(req.params.facproveId, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (factura == null) {
                return res.status(404).send("factura no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                facturasProveedoresDb.putFactura(req.params.facproveId, req.body.facprove, function (err, factura) {
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
// Recalcula las líneas y totales de una factura de proveedores dada
// en función de los porcentajes pasados.
router.put('/recalculo/:facproveId/:coste/:porcentajeBeneficio/:porcentajeAgente/:tipoClienteId', function (req, res) {
    var facproveId = req.params.facproveId,
        coste = req.params.coste,
        porcentajeBeneficio = req.params.porcentajeBeneficio,
        porcentajeAgente = req.params.porcentajeAgente,
        tipoClienteId = req.params.tipoClienteId;
    if (!facproveId || !coste || !porcentajeBeneficio || !porcentajeAgente) {
        return res.status(400).send('Faltan parámetros para el recálculo de la factura');
    }
    facturasProveedoresDb.recalculoLineasFactura(facproveId, coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId, function(err){
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

// DeleteFactura
// elimina un prefactura de la base de datos
router.delete('/:facproveId', function (req, res) {
    var facproveId = req.body.facproveId;
    facturasProveedoresDb.deleteFactura(req.params.facproveId, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

/* ----------------------
    LINEAS DE FACTURA de proveedores
-------------------------*/

// GetNextfacturaLine
// devuelve el factura con el id pasado
router.get('/nextlinea/:facproveId', function (req, res) {
    facturasProveedoresDb.getNextFacturaLineas(req.params.facproveId, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (factura == null) {
                return res.status(404).send("factura no encontrado");
            } else {
                res.json(factura);
            }
        }
    });
});

// GetPrefacturaLineas
// devuelve el prefactura con el id pasado
router.get('/lineas/:facproveId', function (req, res) {
    facturasProveedoresDb.getFacturaLineas(req.params.facproveId, function (err, lineas) {
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
    facturasProveedoresDb.getFacturaLinea(req.params.facproveLineaId, function (err, lineas) {
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
    facturasProveedoresDb.postFacturaLinea(req.body.facproveLinea, function (err, prefacturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturaLinea);
        }
    });
});



// PutFacturaLinea
// modifica la factura con el id pasado
router.put('/lineas/:facproveLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    facturasProveedoresDb.getFacturaLinea(req.params.facproveLineaId, function (err, facproveLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (facproveLinea == null) {
                return res.status(404).send("Linea de factura no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                facturasProveedoresDb.putFacturaLinea(req.params.facproveLineaId, req.body.facproveLinea, function (err, facproveLinea) {
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

// DeleteFacturaLinea
// elimina un factura de proveedor de la base de datos
router.delete('/lineas/:facproveLineaId', function (req, res) {
    var facproveLinea = req.body.facproveLinea;
    facturasProveedoresDb.deleteFacturaLinea(req.params.facproveLineaId, facproveLinea, function (err, facproveLinea) {
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
    facturasProveedoresDb.getFacturaBases(req.params.facproveId, function (err, bases) {
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