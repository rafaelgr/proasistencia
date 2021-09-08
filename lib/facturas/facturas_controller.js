

var express = require('express');
var router = express.Router();
var facturasDb = require("./facturas_db_mysql");
var anticiposClientesDb = require("../anticipos_clientes/anticiposClientes_db_mysql");

// GetFacturas
// Devuelve una lista de objetos con todos los facturas de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos facturas
// que lo contengan.
router.get('/', function (req, res) {
    facturasDb.getFacturas(function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

router.get('/all/', function (req, res) {
    facturasDb.getFacturasAll(function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

// GetFactura
// devuelve el factura con el id pasado
router.get('/:facturaId', function (req, res) {
    facturasDb.getFactura(req.params.facturaId, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (factura == null) {
                return res.status(404).send("Factura no encontrado");
            } else {
                res.json(factura);
            }
        }
    });
});

router.get('/contrato/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    facturasDb.getFacturasContrato(contratoId, function (err, facturas) {
        if (err) return res.status(500).send(err.message);
        res.json(facturas);
    })
});

router.get('/contrato/generadas/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    facturasDb.getFacturasContratoGeneradas(contratoId, function (err, facturas) {
        if (err) return res.status(500).send(err.message);
        res.json(facturas);
    })
});

// GetFacturasContabilizables
// obtiene las facturas entre las fechas pasadas y que no han sido contabilizadas con anterioridad.
router.get('/emision/:dFecha/:hFecha/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId;
    facturasDb.getPreContaFacturas(dFecha, hFecha, departamentoId, usuarioId, function (err, facturas) {
        if (err) return res.status(500).send(err.message);
        res.json(facturas);
    });
})

router.get('/correo/:dFecha/:hFecha/:clienteId/:mantenedorId/:comercialId/:contratoId/:empresaId/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var clienteId = req.params.clienteId;
    var mantenedorId = req.params.mantenedorId;
    var comercialId = req.params.comercialId;
    var contratoId = req.params.contratoId;
    var empresaId = req.params.empresaId;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId
    facturasDb.getPreCorreoFacturas(dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId, function (err, facturas) {
        if (err) return res.status(500).send(err.message);
        res.json(facturas);
    });
})



router.delete('/contrato/generadas/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    facturasDb.deleteFacturasContratoGeneradas(contratoId, function (err) {
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

router.get('/liquidacion/:dFecha/:hFecha/:departamentoId/:empresaId/:comercialId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var empresaId = req.params.empresaId;
    var comercialId = req.params.comercialId;
    var usuarioId = req.params.usuarioId
    facturasDb.getPreLiquidacionFacturas(dFecha, hFecha, parseInt(departamentoId), parseInt(empresaId), parseInt(comercialId),  parseInt(usuarioId),function (err, facturas) {
        if (err) return res.status(500).send(err.message);
        res.json(facturas);
    });
})

// PostFactura
// permite dar de alta un factura
router.post('/', function (req, res) {
    facturasDb.postFactura(req.body.factura, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(factura);
        }
    });
});

// PostContabilizarFacturas
router.post('/contabilizar/:dFecha/:hFecha/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId;
    facturasDb.postContabilizarFacturas(dFecha, hFecha, departamentoId, usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// PostEnviarCorreos
router.post('/preparar-correos/:dFecha/:hFecha/:clienteId/:mantenedorId/:comercialId/:contratoId/:empresaId/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var clienteId = req.params.clienteId;
    var mantenedorId = req.params.mantenedorId;
    var comercialId = req.params.comercialId;
    var contratoId = req.params.contratoId;
    var empresaId = req.params.empresaId;
    var departamentoId = req.params.departamentoId
    var usuarioId = req.params.usuarioId;
    facturasDb.postPrepararCorreos(dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});


router.post('/enviar-correos/:dFecha/:hFecha', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var facturas = req.body;
    facturasDb.postEnviarCorreos(dFecha, hFecha, facturas, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// PostCrearDesdePrefacturas
// Crea las facturas desde las preefcacturas pasadas.
router.post('/prefacturas/:dFecha/:hFecha/:fFecha/:clienteId/:agenteId/:tipoMantenimientoId/:empresaId/:rectificativas', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var fFecha = req.params.fFecha;
    var clienteId = req.params.clienteId;
    var agenteId = req.params.agenteId;
    var tipoMantenimientoId = req.params.tipoMantenimientoId;
    var empresaId = req.params.empresaId;
    var rectificativas = req.params.rectificativas;
    facturasDb.postCrearDesdePrefacturas(dFecha, hFecha, fFecha, clienteId, agenteId, tipoMantenimientoId, empresaId, rectificativas,function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(null);
    });
});

//GENERAR FACTURAS DESDE PARTE

// PostCrearDesdePrefacturas
// Crea las facturas desde las preefcacturas pasadas.
router.post('/factura/cliente/parte/:deFecha/:aFecha/:fechaFactura', function (req, res) {
    
    facturasDb.postCrearFactCliDesdeParte(req.body.seleccionados, req.params.deFecha, req.params.aFecha, req.params.fechaFactura,function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(true);
    });
});

//MODIFICAR LINEA DESDE PARTE

// PutFacturaLinea
// modifica la factura con el id pasado
router.put('/actualiza/linea/desde/parte', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    facturasDb.putFacturaLineaDesdeParte(req.body.datos, function (err, facturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (facturaLinea == null) {
                return res.status(404).send("Linea de factura no encontrada");
            } else {
                //buscamos si la linea tiene anticipos
                anticiposClientesDb.getAnticipoPorNumero(req.body.datos.parteLineaId, req.body.datos.clienteId, function(err, result) {
                    if (err)  return res.status(500).send(err.message);
                    if (result != null) {
                        //sabemos que hay anticipo, ahora lo modificamos
                        var antClien = {
                            antClienId: result.antClienId,
                            totalconIva: req.body.datos.aCuentaCliente
                        }
                        anticiposClientesDb.putAnticipo(result.antClienId, antClien, function (err, result2) {
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








// PutFactura
// modifica el factura con el id pasado
router.put('/:facturaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    facturasDb.getFactura(req.params.facturaId, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (factura == null) {
                return res.status(404).send("Factura no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                facturasDb.putFactura(req.params.facturaId, req.body.factura, function (err, factura) {
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

// PostDesmarcarPrefactura
// Desmarca las prefacturas relacionadas con el identificador de factura pasado
// Esto se suele utilizar para poder borrar luego la factura y que no dé error
// de claves relacionales
router.post('/desmarcar-prefactura/:facturaId', function (req, res) {
    var facturaId = req.params.facturaId;
    if (!facturaId) return res.status(400).send('Se necesita un identificador de la factura que se quiere desmarcar');
    facturasDb.postDesmarcarFactura(facturaId, function (err, data) {
        if (err) return res.status(500).send(err.message);
        res.json(data);
    })

});

// PostDescontabilizar
// Descontabiliza la factura referenciada por facturaId
// La descontabikización simplemente pone a nulo el valor de 
// contafich para dicha factura
router.post('/descontabilizar/:facturaId', function (req, res) {
    var facturaId = req.params.facturaId;
    if (!facturaId) return res.status(400).send('Se necesita un identificador de la factura que se quiere desmarcar');
    facturasDb.postDescontabilizar(facturaId, function (err, data) {
        if (err) return res.status(500).send(err.message);
        res.json(data);
    })

});

// Obtener lista de facturas individuales para exportar a PDF
router.get('/facpdf/:dFecha/:hFecha/:empresaId/:clienteId', function(req, res){
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var empresaId = req.params.empresaId;
    var clienteId = req.params.clienteId;
    if (!dFecha || !hFecha) return res.status(400).send('Debe escoger al menos un rango de fechas');
    facturasDb.getFacPdf(dFecha, hFecha, empresaId, clienteId, function(err, data){
        if (err) return res.status(500).send(err.message);
        res.json("OK");
    });
});

// Obtener lista de facturas individuales para exportar a PDF
router.get('/facpdf/:dFecha/:hFecha/:facturaId/:empresaId/:clienteId/:agenteId', function(req, res){
    var facturaId = req.params.facturaId;
     var agenteId =  req.params.agenteId;
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var empresaId = req.params.empresaId;
    var clienteId = req.params.clienteId;
    if (!dFecha || !hFecha) return res.status(400).send('Debe escoger al menos un rango de fechas');
    facturasDb.getFacPdf(dFecha, hFecha, facturaId, empresaId, clienteId, agenteId,function(err, data){
        if (err) return res.status(500).send(err.message);
        res.json("OK");
    });
});


// PutRecalculo
// Recalcula las líneas y totales de una factura dada
// en función de los porcentajes pasados.
router.put('/recalculo/:facturaId/:coste/:porcentajeBeneficio/:porcentajeAgente/:tipoClienteId', function (req, res) {
    var facturaId = req.params.facturaId,
        coste = req.params.coste,
        porcentajeBeneficio = req.params.porcentajeBeneficio,
        porcentajeAgente = req.params.porcentajeAgente,
        tipoClienteId = req.params.tipoClienteId;
    if (!facturaId || !coste || !porcentajeBeneficio || !porcentajeAgente) {
        return res.status(400).send('Faltan parámetros para el recálculo de la factura');
    }
    facturasDb.recalculoLineasFactura(facturaId, coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId, function (err) {
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

// DeleteFactura
// elimina un factura de la base de datos
router.delete('/:facturaId', function (req, res) {
    var factura = req.body.factura;
    facturasDb.deleteFactura(req.params.facturaId, factura, function (err, factura) {
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

// GetNextFacturaLine
// devuelve el factura con el id pasado
router.get('/nextlinea/:facturaId', function (req, res) {
    facturasDb.getNextFacturaLineas(req.params.facturaId, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (factura == null) {
                return res.status(404).send("Factura no encontrado");
            } else {
                res.json(factura);
            }
        }
    });
});

// GetFacturaLineas
// devuelve el factura con el id pasado
router.get('/lineas/:facturaId', function (req, res) {
    facturasDb.getFacturaLineas(req.params.facturaId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("Factura sin lineas");
            } else {
                res.json(lineas);
            }
        }
    });
});

// GetFacturaLinea
// devuelve el factura con el id pasado
router.get('/linea/:facturaLineaId', function (req, res) {
    facturasDb.getFacturaLinea(req.params.facturaLineaId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("No existe la linea de factura solicitada");
            } else {
                res.json(lineas);
            }
        }
    });
});


// PostFacturaLinea
// permite dar de alta un linea de factura
router.post('/lineas/', function (req, res) {
    facturasDb.postFacturaLinea(req.body.facturaLinea, function (err, facturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturaLinea);
        }
    });
});



// PutFacturaLinea
// modifica el factura con el id pasado
router.put('/lineas/:facturaLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    facturasDb.getFacturaLinea(req.params.facturaLineaId, function (err, facturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (facturaLinea == null) {
                return res.status(404).send("Linea de factura no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                facturasDb.putFacturaLinea(req.params.facturaLineaId, req.body.facturaLinea, function (err, facturaLinea) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(facturaLinea);
                    }
                });
            }
        }
    });
});

// DeleteFacturaLinea
// elimina un factura de la base de datos
router.delete('/lineas/:facturaLineaId', function (req, res) {
    var facturaLinea = req.body.facturaLinea;
    facturasDb.deleteFacturaLinea(req.params.facturaLineaId, facturaLinea, function (err, facturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// DeleteFactura
// elimina un factura de la base de datos
router.delete('/parte/relacionado/:facturaId', function (req, res) {
    var factura = req.body.factura;
    facturasDb.deleteFacturaParte(req.params.facturaId, factura, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// GetFacturaBases
// devuelve el factura con el id pasado
router.get('/bases/:facturaId', function (req, res) {
    facturasDb.getFacturaBases(req.params.facturaId, function (err, bases) {
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


//CARGA FACTURAS DE DEPARTAMENTOS DE USUARIO

// GetFacturasUsuario
// Devuelve una lista de objetos con todos los facturas de la 
// base de datos que tengan un contrato asociado con departamento asignado al usuario logado.
router.get('/usuario/logado/departamento/:usuarioId/:departamentoId/:dFecha/:hFecha/:empresaId', function (req, res) {
    facturasDb.getFacturasUsuario(req.params.usuarioId, req.params.departamentoId, req.params.dFecha, req.params.hFecha, req.params.empresaId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

router.get('/usuario/logado/departamento/all/:usuarioId/:departamentoId/:dFecha/:hFecha/:empresaId', function (req, res) {
    facturasDb.getFacturasAllUsuario(req.params.usuarioId, req.params.departamentoId, req.params.dFecha, req.params.hFecha, req.params.empresaId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

router.get('/solo/reparaciones', function (req, res) {
    facturasDb.getFacturasReparaciones(function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});


// PostCrearDesdePrefacturasUsuario
// Crea las facturas desde las preefcacturas pasadas.
router.post('/prefacturas/usuario/:dFecha/:hFecha/:fFecha/:usuarioId/:clienteId/:agenteId/:departamentoId/:empresaId/:rectificativas', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var fFecha = req.params.fFecha;
    var usuarioId = req.params.usuarioId
    var clienteId = req.params.clienteId;
    var agenteId = req.params.agenteId;
    var departamentoId = req.params.departamentoId;
    var empresaId = req.params.empresaId;
    var rectificativas = req.params.rectificativas;
    facturasDb.postCrearDesdePrefacturasUsuario(dFecha, hFecha, fFecha, usuarioId, clienteId, agenteId, departamentoId, empresaId, rectificativas,function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(null);
    });
});

// deleteFacturaLineaConParte
// elimina un linea de factura  de la base de datos y su correspondiente de linea de factura de proveedor, si existe.
router.delete('/lineas/con/parte/:facturaLineaId', function (req, res) {
    var facturaLinea = req.body.facturaLinea;
    facturasDb.deleteFacturaLineaConParte(req.params.facturaLineaId, facturaLinea, function (err, facturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//MODIFICAR LINEA DESDE PARTE

// PutFacturaLinea
// modifica la factura con el id pasado
router.put('/actualiza/cabecera/factura/desde/parte', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    facturasDb.putFacturaCabeceraDesdeParte(req.body.datos, function (err, factura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (factura == null) {
                return res.status(404).send("Linea de factura no encontrada");
            } else {
                res.json(factura);
            }
        }
    });
});

//crea el JSON de informe de facturas emitidas
router.post('/facturas/crea/json/:dFecha/:hFecha/:clienteId/:empresaId/:tipoIvaId/:conta/:orden/:serie/:departamentoId/:usuario', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var clienteId = req.params.clienteId;
    var empresaId = req.params.empresaId;
    var tipoIvaId = req.params.tipoIvaId;
    var conta = req.params.conta;
    var orden = req.params.orden;
    var serie = req.params.serie
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuario;
    facturasDb.postCrearReport(dFecha, hFecha, clienteId, empresaId, tipoIvaId, conta, orden, serie, departamentoId, usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

//crea una linera nueva en una factura desde un parte
//crea el JSON de informe de facturas emitidas
router.post('/linea/nueva/:facturaId/:lineaParteId', function (req, res) {
    var facturaId = req.params.facturaId;
    var lineaParteId = req.params.lineaParteId;
    facturasDb.postFacturaLineaDesdeParte(facturaId, lineaParteId, function (err, result) {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});




router.get('/recupera/fecha/cobro/conta/:num/:empId', function (req, res) {
    facturasDb.getFechaCobroConta(req.params.num, req.params.empId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});


router.get('/cliente/recupera/todas/:clienteId', function (req, res) {
    facturasDb.getFacturasCliente(req.params.clienteId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

//DEVUELVE LAS FACTURAS DE UN CLIENTE O UN AGENTE ASOCIADO Y UN DEPARTAMENTO, DEPENDIENDO DE LOS PARAMETROS PASADOS

router.get('/cliente-agente/recupera/todas/:id/:departamentoId/:esCliente', function (req, res) {
    facturasDb.getFacturasClienteAgenteDepartamento(req.params.id, req.params.departamentoId, req.params.esCliente, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});


router.get("/buscar/ultimo/numero/conta/:facturaId", function (req, res) {
    var facturaId = req.params.facturaId;
   
    facturasDb.getUltimoNumero(facturaId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

//FACTURAS REPARACIONES BENEFICIO COMERCIAL


router.get('/reparaciones/beneficio/comercial/:dFecha/:hFecha/:departamentoId/:empresaId/:comercialId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var empresaId = req.params.empresaId;
    var comercialId = req.params.comercialId;
    var usuarioId = req.params.usuarioId;
    facturasDb.getFacturasBeneficioComercial(dFecha, hFecha, parseInt(departamentoId), parseInt(empresaId), parseInt(comercialId), parseInt(usuarioId), function (err, facturas) {
        if (err) return res.status(500).send(err.message);
        res.json(facturas);
    });
})

//creamos un jsonb para las facturas del visor
router.get('/inf/facturas/json/visor/:dFecha/:hFecha/:empresaId/:clienteId/:departamentoId/:agenteId/:facturaId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var empresaId = req.params.empresaId;
    var agenteId = req.params.agenteId;
    var facturaId = req.params.facturaId;
    var clienteId = req.params.clienteId;
    facturasDb.getFacVisior(dFecha, hFecha, parseInt(facturaId), parseInt(empresaId), parseInt(clienteId), parseInt(agenteId), parseInt(departamentoId), function (err, facturas) {
        if (err) return res.status(500).send(err.message);
        res.json(facturas);
    });
})


// Exports
module.exports = router;
