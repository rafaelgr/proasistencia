var express = require('express');
var router = express.Router();
var facturasProveedoresDb = require("./facturasProveedores_db_mysql");
var anticiposProveedoresDb = require("../anticipos_proveedores/anticiposProveedores_db_mysql");

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


// Getfactura
// devuelve la factura con el id pasado
router.get('/:facproveId', function (req, res) {
        facturasProveedoresDb.getFacturaProveedor(req.params.facproveId, function (err, factura) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(factura);
                return
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

router.get('/contrato/:contratoId/:esColaborador', function(req, res){
    var contratoId = req.params.contratoId;
    var esColaborador = req.params.esColaborador;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    facturasProveedoresDb.getFacturasContrato(contratoId, esColaborador, function(err, prefacturas){
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
router.get('/facpdf/:dFecha/:hFecha/:empresaId/:proveedorId/:departamentoId/:usuario', function(req, res){
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var empresaId = req.params.empresaId;
    var proveedorId = req.params.proveedorId;
    var departamentoId = req.params.departamentoId;
    var usuario = req.params.usuario;
    if (!dFecha || !hFecha) return res.status(400).send('Debe escoger al menos un rango de fechas');
    facturasProveedoresDb.getFacPdf(dFecha, hFecha, empresaId, proveedorId, departamentoId, usuario, function(err, data){
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

// obtiene las facturas entre las fechas pasadas y que no han sido contabilizadas con anterioridad.
router.get('/emision2/:dFecha/:hFecha/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId;
    facturasProveedoresDb.getPreContaFacturas(dFecha, hFecha, departamentoId, usuarioId, function (err, facturas) {
        if (err) return res.status(500).send(err.message);
        res.json(facturas);
    });
})


// PostFactura
// permite dar de alta una factura de proveedor
router.post('/', function (req, res) {
    var facprove = req.body[0].facprove;
    var doc;
    if(req.body[1]){
        doc = req.body[1].doc;
    }
    
    facturasProveedoresDb.postFactura(facprove, doc,function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(factura);
        }
    });
});

router.post('/nueva/ref/cambio/empresa', function (req, res) {
    var facprove = req.body.facprove;
facturasProveedoresDb.getNuevaRef(facprove, function (err, factura) {
    if (err) {
        return res.status(500).send(err.message);
    } else {
        res.json(factura);
    }
});
});


// PutFactura
// modifica el anticipo con el id pasado
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
                var facprove = req.body[0].facprove;
                var doc;
                if(req.body[1] ){
                    doc = req.body[1].doc;
                }
                facturasProveedoresDb.putFactura(req.params.facproveId, facprove, doc,function (err, factura) {
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
router.delete('/:facproveId/', function (req, res) {
    var facproveId = req.body.facproveId;
    facturasProveedoresDb.deleteFactura(req.params.facproveId,function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            //una vez borrada la factura ponemos el campo antprove del anticipo asociado si existe a null
            if(req.body.antproveId) {
                anticiposProveedoresDb.putAntProveAnticipoToNull(req.body, function(err, result) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(null);
                    }
                });
               
            } else {
                res.json(null);
            }
        }
    });
});

// DeleteFactura
// elimina un prefactura de la base de datos
router.delete('/nuevo/:facproveId/:usunom', function (req, res) {
    var facproveId = req.body.facproveId;
    facturasProveedoresDb.deleteFacturaNuevo(req.params.facproveId, req.params.usunom, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            //una vez borrada la factura ponemos el campo antprove del anticipo asociado si existe a null
            if(req.body.antproveId) {
                anticiposProveedoresDb.putAntProveAnticipoToNull(req.body, function(err, result) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(null);
                    }
                });
               
            } else {
                res.json(null);
            }
        }
    });
});


//borra en archivo asociado a una factura
router.delete('/archivo/:file', function (req, res) {
    var file = req.params.file;
    if (!file) {
        return res.status(404).send('Esta factura no tiene PDF que borrar');
    }
    facturasProveedoresDb.del(file, function (err) {
        if (err) {
            res.status(500).send(err.message);
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
// devuelve las lineas de una factura con el id de la factura pasado
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
    facturasProveedoresDb.postFacturaLinea(req.body.facproveLinea, function (err, facproveLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facproveLinea);
        }
    });
});

// PostFacturaLineaNuevo
// permite dar de alta un linea de factura
router.post('/lineas-nuevo/', async (req, res, next) => {
    try {
        facturasProveedoresDb.postFacturaLineaNuevo(req.body.facproveLinea)
        .then((facproveLinea) => {
            res.json(facproveLinea);
        })
        .catch(err => next(res.status(500).send(err.message)))
    } catch (error) {
        next(error);
    }
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


// PutFacturaLinea
// modifica el factura con el id pasado
router.put('/lineas-nuevo/:facproveLineaId', async (req, res, next) => {
    try {
        facturasProveedoresDb.getFacturaLineaNuevo(req.params.facproveLineaId)
        .then((facproveLinea) => {
            if(facproveLinea.length == 0) return res.status(404).send("Linea de factura no encontrada");
            facturasProveedoresDb.putFacturaLineaNuevo(req.params.facproveLineaId, req.body.facproveLinea)
            .then((facproveLinea) => {
                res.json(facproveLinea);
            })
            .catch(err => next(res.status(500).send(err.message)))
        })
        .catch(err => next(res.status(500).send(err.message)))
    } catch (error) {
        next(error);
    }
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


// DeleteFacturaLinea
// elimina un linea de factura de la base de datos
router.delete('/lineas-nuevo/:facproveLineaId', async (req, res, next) => {
    try {
        var facproveLinea = req.body.facproveLinea;
        facturasProveedoresDb.deleteFacturaLineaNuevo(req.params.facproveLineaId, facproveLinea)
        .then((facproveLinea) => {
            res.json(null);
        })
        .catch(err => next(res.status(500).send(err.message)))
    } catch (error) {
        next(error);
    }
});

// GetFacturaBases
// devuelve la factura con el id pasado
router.get('/bases/:facproveId', async (req, res, next) => {
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





/* ----------------------
    SOLAPA SERVICIADAS
-------------------------*/

//GetServiciadas
//devuelve todas las empresas serviciadas asociadas a una factura
router.get('/servicidas/facturas/proveedor/todas/:facproveId', function (req, res) {
    facturasProveedoresDb.getserviciadasFactura(req.params.facproveId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

router.get('/servicidas/facturas/proveedor/una/para/editar/:facproveId', function (req, res) {
    facturasProveedoresDb.getserviciadaFactura(req.params.facproveId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});




//postServiciada
//permite dar de alta una empresa serviciada asociada a una factura
router.post('/nueva/serviciada', function (req, res) {
    var serviciada = req.body.facproveServiciada;
    facturasProveedoresDb.postServiciada(serviciada, function (err, serviciada) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(serviciada);
        }
    });
});

//putserviciada
//modifica una empresa serviciada con su id pasado
router.put('/serviciada/edita/:facproveserviciadoId', function (req, res) {
    facturasProveedoresDb.putServiciada(req.params.facproveserviciadoId, req.body.facproveServiciada, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(data);
        }
    });
});

//deleteServiciadas
//permite borrar una empresa serviciada de una factura
router.delete('/serviciada/factura/proveedor/:facproveServiciadaId', function(req, res){
    var facproveServiciadaId = req.params.facproveServiciadaId;
    if (!facproveServiciadaId) return res.status(400).send("Falta la referencia a la EMPRESA SERVICIADA en la URL de la solicitud");
    facturasProveedoresDb.deleteServiciadas(facproveServiciadaId, function(err){
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

//----- CONTABILIZACION ---------------------------
// PostContabilizarFacturas
router.post('/contabilizar/:dFecha/:hFecha/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId;
    facturasProveedoresDb.postContabilizarFacturas(dFecha, hFecha, departamentoId, usuarioId,function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});


//-----VISADAS--------------------
//devuelve todas las facturas de proveedores sin visar
router.get('/visadas/facturas-proveedor/todas/:visada', function (req, res) {
    facturasProveedoresDb.getVisadasFactura(req.params.visada, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// PutFactura
// modifica al campo visada de la facprove con el id pasado
router.put('/visadas/modificar/:facproveId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    facturasProveedoresDb.getFacturaProveedor(req.params.facproveId, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (factura == null) {
                return res.status(404).send("factura no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                var facprove = req.body[0].facprove;
                
                facturasProveedoresDb.putFacturaVisada(req.params.facproveId, facprove, function (err, factura) {
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

//recuperamos los datos para el informe de facturas y sus contratos asociados
router.get('/visadas/facturas-proveedor/informe/detalle:visada', function (req, res) {
    facturasProveedoresDb.getInformesFactura(req.params.visada, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});


/* ----------------------
    FACPROVE RETENCIONES
-------------------------*/

// GetPrefacturaLineas
// devuelve el prefactura con el id pasado
router.get('/retenciones/:facproveId', function (req, res) {
    facturasProveedoresDb.getFacturaRetenciones(req.params.facproveId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("Prefactura sin retenciones");
            } else {
                res.json(lineas);
            }
        }
    });
});

//GetTiposRetencion
//devuelve los tipos de retención 0 1 y 3 de la tabla usuarios.wtiposreten
router.get('/retenciones/tiposreten/facprove', function (req, res) {
    facturasProveedoresDb.getTiposRetencion(function (err, tipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipos == null) {
                return res.status(404).send("Prefactura sin retenciones");
            } else {
                res.json(tipos);
            }
        }
    });
});


//GetTipoRetencion
//devuelve un tipo de retención de la tabla usuarios.wtiposreten con el codigo pasado
router.get('/retenciones/tiposreten/facprove/:codigo', function (req, res) {
    var codigo = req.params.codigo;
    facturasProveedoresDb.getTipoRetencion(codigo, function (err, tipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipos == null) {
                return res.status(404).send("Prefactura sin retenciones");
            } else {
                res.json(tipos);
            }
        }
    });
});


//ACTUALIZA LINEAS DESDE ANTPROVE


// PostFacturaLinea
// permite dar de alta un linea de factura proveedor
router.post('/inserta/desde/antprove/:antproveId/:facproveId', function (req, res) {
    facturasProveedoresDb.postLineasDesdeAntprove(req.params.facproveId, req.params.antproveId, function (err, prefacturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturaLinea);
        }
    });
});

router.delete('/borra/desde/antprove/:antproveId/:facproveId', function (req, res) {
    facturasProveedoresDb.deleteLineasDesdeAntprove(req.params.facproveId, req.params.antproveId, function (err, prefacturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturaLinea);
        }
    });
});

//GENERAR FACTURAS DESDE PARTE

// PostCrearDesdePrefacturas
// Crea las facturas desde las preefcacturas pasadas.
router.post('/factura/proveedores/parte/:deFecha/:aFecha/:fechaFactura', function (req, res) {
    
    facturasProveedoresDb.postCrearFactProDesdeParte(req.body.seleccionados, req.params.deFecha, req.params.aFecha, req.params.fechaFactura, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(true);
    });
});

//MODIFICAR CABECERA DESDE PARTE

// PutFacturaLinea
// modifica la factura con el id pasado
router.put('/actualiza/cabecera/desde/parte', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    facturasProveedoresDb.putFacturaCabDesdeParte(req.body.datos,function (err, facprove) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (facprove == null) {
                return res.status(404).send("Linea de factura no encontrada");
            } else {
                res.json(facprove);
            }
        }
    });
});

//MODIFICAR LINEA DESDE PARTE

// PutFacturaLinea
// modifica la factura con el id pasado
router.put('/actualiza/linea/desde/parte/:proId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    facturasProveedoresDb.putFacturaLineaDesdeParte(req.body.datos, req.params.proId,function (err, facproveLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (facproveLinea == null) {
                return res.status(404).send("Linea de factura no encontrada");
            } else {
                //buscamos si la linea tiene anticipos
                anticiposProveedoresDb.getAnticipoPorNumero(req.body.datos.parteLineaId, req.params.proId, function(err, result) {
                    if (err)  return res.status(500).send(err.message);
                    if (result != null) {
                        //sabemos que hay anticipo, ahora lo modificamos
                        var antprove = {
                            antproveId: result.antproveId,
                            totalconIva: req.body.datos.aCuentaProveedor
                        }
                        anticiposProveedoresDb.putAnticipo(result.antproveId, antprove, function (err, result2) {
                            if (err)  return res.status(500).send(err.message);
                            res.json(result2);
                        });
                       
                    } else {
                        res.json(result);
                    }
                });
            }
        }
    });
});





//LLAMADAS  POR DEPARTAMENTO DE USUARIO

// getFacturasProveedoresUsuario
// Devuelve las facturas de proveedores que pertenezcan a los departamentos
//que el usuario tenga asignados
router.get('/usuario/logado/departamento/:usuarioId/:departamentoId/:dFecha/:hFecha/:empresaId/:esColaborador', function (req, res) {
    facturasProveedoresDb.getFacturasProveedoresUsuario(req.params.usuarioId, req.params.departamentoId, req.params.dFecha, req.params.hFecha, req.params.empresaId, req.params.esColaborador, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

//devuelve todas las facturas de proveedores sin visar
router.get('/visadas/facturas-proveedor/todas/usuario/logado/departamento/:visada/:usuarioId/:departamentoId', function (req, res) {
    facturasProveedoresDb.getVisadasFacturaUsuario(req.params.visada, req.params.usuarioId, req.params.departamentoId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

router.get('/solo/reparaciones', function (req, res) {
    facturasProveedoresDb.getFacturasProveedoresReparaciones(function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});
//Borrar factura de reparaciones

// DeleteFactura
// elimina un factura de la base de datos
router.delete('/reparaciones/actualiza/parte/:facproveId/:usunom', function (req, res) {
    var facprove = req.body;
    var usunom = req.params.usunom;
    facturasProveedoresDb.deleteFacturaParte(req.params.facproveId, facprove, usunom, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            //una vez borrada la factura ponemos el campo antprove del anticipo asociado si existe a null
            if(req.body.antproveId) {
                anticiposProveedoresDb.putAntProveAnticipoToNull(req.body, function(err, result) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(null);
                    }
                });
               
            } else {
                res.json(null);
            }
        }
    });
});


// deleteFacproveLineaConParte
// elimina un linea de factura de proveedor de la base de datos y su correspondiente linea de factura, si existe.
router.delete('/lineas/con/parte/:facproveLineaId', function (req, res) {
    var facproveLinea = req.body.facproveLinea;
    facturasProveedoresDb.deleteFacproveLineaConParte(req.params.facproveLineaId, facproveLinea, function (err, facproveLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//crea el JSON de informe de facturas recibidas
router.post('/facturas/crea/json/:dFecha/:hFecha/:proveedorId/:empresaId/:tipoIvaId/:conta/:orden/:departamentoId/:usuario', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var proveedorId = req.params.proveedorId;
    var empresaId = req.params.empresaId;
    var tipoIvaId = req.params.tipoIvaId;
    var conta = req.params.conta;
    var orden = req.params.orden;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuario;
    facturasProveedoresDb.postCrearReport(dFecha, hFecha, proveedorId, empresaId, tipoIvaId, conta, orden, departamentoId, usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

//crea una linera nueva en una factura desde un parte
//crea el JSON de informe de facturas emitidas
router.post('/linea/nueva/:facproveId/:lineaParteId/:proveedorId', function (req, res) {
    var facproveId = req.params.facproveId;
    var lineaParteId = req.params.lineaParteId;
    var proveedorId = req.params.proveedorId;
    facturasProveedoresDb.postFacturaLineaDesdeParte(facproveId, lineaParteId, proveedorId, function (err, result) {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});


//LLAMADA PARA EL COMBO TIPO DE OPERACION

// getTipoOperacion
// devuelve todos los registros de la tabla tipos_operaciones
router.get('/tipo/operacion/factura', function (req, res) {
    facturasProveedoresDb.getTipoOperacion(function (err, tipoOpera) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tipoOpera);
            return
        }
    });
});

router.get('/recupera/fecha/cobro/conta/:fecha/:num/:empId', function (req, res) {
    facturasProveedoresDb.getFechaPagosConta(req.params.fecha, req.params.num, req.params.empId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

//FUNCIONES RELACIONADAS CON EL ENVÍO DE CORREOS

//esta función se usa también para recuparra facturas de gastos en la vinculición manual de los documentos de pago
router.get('/correo/:dFecha/:hFecha/:proveedorId/:empresaId/:departamentoId/:usuarioId/', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var proveedorId = req.params.proveedorId;
    var empresaId = req.params.empresaId;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId;
    facturasProveedoresDb.getPreCorreoFacturas(dFecha, hFecha, proveedorId, empresaId, departamentoId, usuarioId, function (err, facturas) {
        if (err) return res.status(500).send(err.message);
        res.json(facturas);
    });
});




// PostEnviarCorreos
router.post('/preparar-correos/:dFecha/:hFecha/:proveedorId/:empresaId/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var proveedorId = req.params.proveedorId;
    var empresaId = req.params.empresaId;
    var departamentoId = req.params.departamentoId
    var usuarioId = req.params.usuarioId;
    facturasProveedoresDb.postPrepararCorreos(dFecha, hFecha, proveedorId, empresaId, departamentoId, usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});


router.post('/enviar-correos/:dFecha/:hFecha', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var facturas = req.body;
    facturasProveedoresDb.postEnviarCorreos(dFecha, hFecha, facturas, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

router.get('/usuario/logado/departamento/all/:usuarioId/:departamentoId/:dFecha/:hFecha/:empresaId/:esColaborador', function (req, res) {
    facturasProveedoresDb.getFacturasAllUsuario(req.params.usuarioId, req.params.departamentoId, req.params.dFecha, req.params.hFecha, req.params.empresaId, req.params.esColaborador, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

//AUDITFACPROVES

router.get('/todos/los/registros/tabla/auditada/:dFecha/:hFecha', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    facturasProveedoresDb.getAuditFacproves(dFecha, hFecha,  function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});


//esta función se usa también para recupara facturas de gastos en la vinculición manual de los documentos de pago
router.get('/facturas/docpago/:dFecha/:hFecha/:empresaId/:departamentoId/:formaPagoId/:usuarioId/', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var empresaId = req.params.empresaId;
    var departamentoId = req.params.departamentoId;
    var formaPagoId = req.params.formaPagoId;
    var usuarioId = req.params.usuarioId;
    facturasProveedoresDb.getFacturasDocPago(dFecha, hFecha, empresaId, departamentoId, formaPagoId, usuarioId, function (err, facturas) {
        if (err) return res.status(500).send(err.message);
        res.json(facturas);
    });
});


// nueva rutina que vincula un anticipo completo
router.put('/vincula/anticipo/completo/nuevo/:facproveId/:antproveId', async (req, res, next) => {
    try {
        //buscamos que exista primero la factura
        facturasProveedoresDb.getFacturaProveedorNuevo(req.params.facproveId)
        .then((facprove) => {
            if (facprove == null) {
                return res.status(404).send("factura no encontrada");
            }
            //buscamos ahora que exista el anticipo
            anticiposProveedoresDb.getAnticipoProveedorNuevo(req.params.antproveId)
            .then((antprove) => {
                if (antprove == null) {
                    return res.status(404).send("anticipo no encontrado");
                }
                // ya sabemos que existen ahora intentamos vincular
                facturasProveedoresDb.vinculaAnticipoCompleto(req.params.facproveId, req.params.antproveId, req.body)
                .then((antprove) => {
                    if (antprove == null) {
                        return res.status(404).send("anticipo no encontrado");
                    }
                    res.json(antprove);
                })
                .catch(err => next(res.status(500).send(err.message)))
            
            })
            .catch(err => next(res.status(500).send(err.message)))

        })
        .catch(err => next(res.status(500).send(err.message)))
    } catch (error) {
        next(error);
    }
});



// Exports
module.exports = router;