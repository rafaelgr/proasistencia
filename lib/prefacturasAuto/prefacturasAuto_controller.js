

var express = require('express');
var router = express.Router();
var prefacturasAutoDb = require("./prefacturasAuto_db_mysql");
var anticiposClientesDb = require("../anticipos_clientes/anticiposClientes_db_mysql");

// GetPrefacturasauto
// Devuelve una lista de objetos con todos los prefacturasAuto de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos prefacturasAuto
// que lo contengan.
router.get('/', function (req, res) {
    prefacturasAutoDb.getPrefacturasauto(function (err, prefacturasAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturasAuto);
        }
    });
});

router.get('/all/', function (req, res) {
    prefacturasAutoDb.getPrefacturasautoAll(function (err, prefacturasAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturasAuto);
        }
    });
});

// GetFactura
// devuelve el prefacturaAuto con el id pasado
router.get('/:prefacturaAutoId', function (req, res) {
    prefacturasAutoDb.getFactura(req.params.prefacturaAutoId, function (err, prefacturaAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefacturaAuto == null) {
                return res.status(404).send("prefacturaAuto no encontrado");
            } else {
                res.json(prefacturaAuto);
            }
        }
    });
});

router.get('/contrato/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    prefacturasAutoDb.getPrefacturasautoContrato(contratoId, function (err, prefacturasAuto) {
        if (err) return res.status(500).send(err.message);
        res.json(prefacturasAuto);
    })
});

router.get('/contrato/generadas/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    prefacturasAutoDb.getPrefacturasautoContratoGeneradas(contratoId, function (err, prefacturasAuto) {
        if (err) return res.status(500).send(err.message);
        res.json(prefacturasAuto);
    })
});

// GetPrefacturasautoContabilizables
// obtiene las prefacturasAuto entre las fechas pasadas y que no han sido contabilizadas con anterioridad.
router.get('/emision/:dFecha/:hFecha/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId;
    prefacturasAutoDb.getPreContaPrefacturasauto(dFecha, hFecha, departamentoId, usuarioId, function (err, prefacturasAuto) {
        if (err) return res.status(500).send(err.message);
        res.json(prefacturasAuto);
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
    prefacturasAutoDb.getPreCorreoPrefacturasauto(dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId, function (err, prefacturasAuto) {
        if (err) return res.status(500).send(err.message);
        res.json(prefacturasAuto);
    });
})



router.delete('/contrato/generadas/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    prefacturasAutoDb.deletePrefacturasautoContratoGeneradas(contratoId, function (err) {
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
    prefacturasAutoDb.getPreLiquidacionPrefacturasauto(dFecha, hFecha, parseInt(departamentoId), parseInt(empresaId), parseInt(comercialId),  parseInt(usuarioId),function (err, prefacturasAuto) {
        if (err) return res.status(500).send(err.message);
        res.json(prefacturasAuto);
    });
})

// PostFactura
// permite dar de alta un prefacturaAuto
router.post('/', function (req, res) {
    prefacturasAutoDb.postFactura(req.body.prefacturaAuto, function (err, prefacturaAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturaAuto);
        }
    });
});

// PostContabilizarPrefacturasauto
router.post('/contabilizar/:dFecha/:hFecha/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId;
    prefacturasAutoDb.postContabilizarPrefacturasauto(dFecha, hFecha, departamentoId, usuarioId, function (err, result) {
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
    prefacturasAutoDb.postPrepararCorreos(dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});


router.post('/enviar-correos/:dFecha/:hFecha', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var prefacturasAuto = req.body;
    prefacturasAutoDb.postEnviarCorreos(dFecha, hFecha, prefacturasAuto, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// PostCrearDesdePrefacturas
// Crea las prefacturasAuto desde las preefcacturas pasadas.
router.post('/prefacturas/:dFecha/:hFecha/:fFecha/:clienteId/:agenteId/:tipoMantenimientoId/:empresaId/:rectificativas', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var fFecha = req.params.fFecha;
    var clienteId = req.params.clienteId;
    var agenteId = req.params.agenteId;
    var tipoMantenimientoId = req.params.tipoMantenimientoId;
    var empresaId = req.params.empresaId;
    var rectificativas = req.params.rectificativas;
    prefacturasAutoDb.postCrearDesdePrefacturas(dFecha, hFecha, fFecha, clienteId, agenteId, tipoMantenimientoId, empresaId, rectificativas,function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(null);
    });
});

//GENERAR FACTURAS DESDE PARTE

// PostCrearDesdePrefacturas
// Crea las prefacturasAuto desde las preefcacturas pasadas.
router.post('/prefacturar/cliente/parte/:deFecha/:aFecha/:fechaPrefactura', function (req, res) {
    
    prefacturasAutoDb.postCrearPrefactCliDesdeParte(req.body.seleccionados, req.params.deFecha, req.params.aFecha, req.params.fechaPrefactura,function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(true);
    });
});

//MODIFICAR LINEA DESDE PARTE

// PutFacturaLinea
// modifica la prefacturaAuto con el id pasado
router.put('/actualiza/linea/desde/parte', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    prefacturasAutoDb.putPrefacturaLineaDesdeParte(req.body.datos, function (err, prefacturaAutoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefacturaAutoLinea == null) {
                return res.status(404).send("Linea de prefacturaAuto no encontrada");
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
// modifica el prefacturaAuto con el id pasado
router.put('/:prefacturaAutoId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    prefacturasAutoDb.getFactura(req.params.prefacturaAutoId, function (err, prefacturaAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefacturaAuto == null) {
                return res.status(404).send("prefacturaAuto no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                prefacturasAutoDb.putFactura(req.params.prefacturaAutoId, req.body.prefacturaAuto, function (err, prefacturaAuto) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(prefacturaAuto);
                    }
                });
            }
        }
    });
});

// PostDesmarcarPrefactura
// Desmarca las prefacturas relacionadas con el identificador de prefacturaAuto pasado
// Esto se suele utilizar para poder borrar luego la prefacturaAuto y que no dé error
// de claves relacionales
router.post('/desmarcar-prefactura/:prefacturaAutoId', function (req, res) {
    var prefacturaAutoId = req.params.prefacturaAutoId;
    if (!prefacturaAutoId) return res.status(400).send('Se necesita un identificador de la prefacturaAuto que se quiere desmarcar');
    prefacturasAutoDb.postDesmarcarFactura(prefacturaAutoId, function (err, data) {
        if (err) return res.status(500).send(err.message);
        res.json(data);
    })

});

// PostDescontabilizar
// Descontabiliza la prefacturaAuto referenciada por prefacturaAutoId
// La descontabikización simplemente pone a nulo el valor de 
// contafich para dicha prefacturaAuto
router.post('/descontabilizar/:prefacturaAutoId', function (req, res) {
    var prefacturaAutoId = req.params.prefacturaAutoId;
    if (!prefacturaAutoId) return res.status(400).send('Se necesita un identificador de la prefacturaAuto que se quiere desmarcar');
    prefacturasAutoDb.postDescontabilizar(prefacturaAutoId, function (err, data) {
        if (err) return res.status(500).send(err.message);
        res.json(data);
    })

});

// Obtener lista de prefacturasAuto individuales para exportar a PDF
router.get('/facpdf/:dFecha/:hFecha/:empresaId/:clienteId', function(req, res){
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var empresaId = req.params.empresaId;
    var clienteId = req.params.clienteId;
    if (!dFecha || !hFecha) return res.status(400).send('Debe escoger al menos un rango de fechas');
    prefacturasAutoDb.getFacPdf(dFecha, hFecha, empresaId, clienteId, function(err, data){
        if (err) return res.status(500).send(err.message);
        res.json("OK");
    });
});


// PutRecalculo
// Recalcula las líneas y totales de una prefacturaAuto dada
// en función de los porcentajes pasados.
router.put('/recalculo/:prefacturaAutoId/:coste/:porcentajeBeneficio/:porcentajeAgente/:tipoClienteId', function (req, res) {
    var prefacturaAutoId = req.params.prefacturaAutoId,
        coste = req.params.coste,
        porcentajeBeneficio = req.params.porcentajeBeneficio,
        porcentajeAgente = req.params.porcentajeAgente,
        tipoClienteId = req.params.tipoClienteId;
    if (!prefacturaAutoId || !coste || !porcentajeBeneficio || !porcentajeAgente) {
        return res.status(400).send('Faltan parámetros para el recálculo de la prefacturaAuto');
    }
    prefacturasAutoDb.recalculoLineasFactura(prefacturaAutoId, coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId, function (err) {
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

// DeleteFactura
// elimina un prefacturaAuto de la base de datos
router.delete('/:prefacturaAutoId', function (req, res) {
    var prefacturaAuto = req.body.prefacturaAuto;
    prefacturasAutoDb.deleteFactura(req.params.prefacturaAutoId, prefacturaAuto, function (err, prefacturaAuto) {
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
// devuelve el prefacturaAuto con el id pasado
router.get('/nextlinea/:prefacturaAutoId', function (req, res) {
    prefacturasAutoDb.getNextFacturaLineas(req.params.prefacturaAutoId, function (err, prefacturaAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefacturaAuto == null) {
                return res.status(404).send("prefacturaAuto no encontrado");
            } else {
                res.json(prefacturaAuto);
            }
        }
    });
});

// GetFacturaLineas
// devuelve el prefacturaAuto con el id pasado
router.get('/lineas/:prefacturaAutoId', function (req, res) {
    prefacturasAutoDb.getFacturaLineas(req.params.prefacturaAutoId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("prefacturaAuto sin lineas");
            } else {
                res.json(lineas);
            }
        }
    });
});

// GetFacturaLinea
// devuelve el prefacturaAuto con el id pasado
router.get('/linea/:facturaLineaId', function (req, res) {
    prefacturasAutoDb.getFacturaLinea(req.params.facturaLineaId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("No existe la linea de prefacturaAuto solicitada");
            } else {
                res.json(lineas);
            }
        }
    });
});


// PostFacturaLinea
// permite dar de alta un linea de prefacturaAuto
router.post('/lineas/', function (req, res) {
    prefacturasAutoDb.postFacturaLinea(req.body.prefacturaAutoLinea, function (err, prefacturaAutoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturaAutoLinea);
        }
    });
});



// PutFacturaLinea
// modifica el prefacturaAuto con el id pasado
router.put('/lineas/:prefacturaAutoLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    prefacturasAutoDb.getFacturaLinea(req.params.prefacturaAutoLineaId, function (err, prefacturaAutoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefacturaAutoLinea == null) {
                return res.status(404).send("Linea de prefacturaAuto no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                prefacturasAutoDb.putFacturaLinea(req.params.prefacturaAutoLineaId, req.body.prefacturaAutoLinea, function (err, prefacturaAutoLinea) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(prefacturaAutoLinea);
                    }
                });
            }
        }
    });
});

// DeleteFacturaLinea
// elimina un prefacturaAuto de la base de datos
router.delete('/lineas/:prefacturaAutoLineaId', function (req, res) {
    var prefacturaAutoLinea = req.body.prefacturaAutoLinea;
    prefacturasAutoDb.deletePrefacturaLinea(req.params.prefacturaAutoLineaId, prefacturaAutoLinea, function (err, prefacturaAutoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// DeleteFactura
// elimina un prefacturaAuto de la base de datos
router.delete('/parte/relacionado/:prefacturaAutoId', function (req, res) {
    var prefacturaAuto = req.body.prefacturaAuto;
    prefacturasAutoDb.deleteFacturaParte(req.params.prefacturaAutoId, prefacturaAuto, function (err, prefacturaAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// GetFacturaBases
// devuelve el prefacturaAuto con el id pasado
router.get('/bases/:prefacturaAutoId', function (req, res) {
    prefacturasAutoDb.getprefacturaAutoBases(req.params.prefacturaAutoId, function (err, bases) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (bases == null) {
                return res.status(404).send("prefacturaAuto sin bases");
            } else {
                res.json(bases);
            }
        }
    });
});


//CARGA FACTURAS DE DEPARTAMENTOS DE USUARIO

// GetPrefacturasautoUsuario
// Devuelve una lista de objetos con todos los prefacturasAuto de la 
// base de datos que tengan un contrato asociado con departamento asignado al usuario logado.
router.get('/usuario/logado/departamento/:usuarioId/:departamentoId', function (req, res) {
    prefacturasAutoDb.getPrefacturasautoUsuario(req.params.usuarioId, req.params.departamentoId, function (err, prefacturasAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturasAuto);
        }
    });
});

router.get('/usuario/logado/departamento/all/:usuarioId/:departamentoId', function (req, res) {
    prefacturasAutoDb.getPrefacturasautoAllUsuario(req.params.usuarioId, req.params.departamentoId, function (err, prefacturasAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturasAuto);
        }
    });
});

router.get('/solo/reparaciones', function (req, res) {
    prefacturasAutoDb.getPrefacturasautoReparaciones(function (err, prefacturasAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturasAuto);
        }
    });
});


// PostCrearDesdePrefacturasUsuario
// Crea las prefacturasAuto desde las preefcacturas pasadas.
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
    prefacturasAutoDb.postCrearDesdePrefacturasUsuario(dFecha, hFecha, fFecha, usuarioId, clienteId, agenteId, departamentoId, empresaId, rectificativas,function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(null);
    });
});

// deleteFacturaLineaConParte
// elimina un linea de prefacturaAuto  de la base de datos y su correspondiente de linea de prefacturaAuto de proveedor, si existe.
router.delete('/lineas/con/parte/:facturaLineaId', function (req, res) {
    var prefacturaAutoLinea = req.body.prefacturaAutoLinea;
    prefacturasAutoDb.deleteFacturaLineaConParte(req.params.facturaLineaId, prefacturaAutoLinea, function (err, prefacturaAutoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//MODIFICAR LINEA DESDE PARTE

// PutFacturaLinea
// modifica la prefacturaAuto con el id pasado
router.put('/actualiza/cabecera/prefacturaAuto/desde/parte', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    prefacturasAutoDb.putPrefacturaCabeceraDesdeParte(req.body.datos, function (err, prefacturaAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefacturaAuto == null) {
                return res.status(404).send("Linea de prefacturaAuto no encontrada");
            } else {
                res.json(prefacturaAuto);
            }
        }
    });
});

//crea el JSON de informe de prefacturasAuto emitidas
router.post('/prefacturasAuto/crea/json/:dFecha/:hFecha/:clienteId/:empresaId/:tipoIvaId/:conta/:orden/:serie/:departamentoId/:usuario', function (req, res) {
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
    prefacturasAutoDb.postCrearReport(dFecha, hFecha, clienteId, empresaId, tipoIvaId, conta, orden, serie, departamentoId, usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

//crea una linera nueva en una prefacturaAuto desde un parte
//crea el JSON de informe de prefacturasAuto emitidas
router.post('/linea/nueva/:prefacturaAutoId/:lineaParteId', function (req, res) {
    var prefacturaAutoId = req.params.prefacturaAutoId;
    var lineaParteId = req.params.lineaParteId;
    prefacturasAutoDb.postFacturaLineaDesdeParte(prefacturaAutoId, lineaParteId, function (err, result) {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});




router.get('/recupera/fecha/cobro/conta/:num/:empId', function (req, res) {
    prefacturasAutoDb.getFechaCobroConta(req.params.num, req.params.empId, function (err, prefacturasAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturasAuto);
        }
    });
});


router.get('/cliente/recupera/todas/:clienteId', function (req, res) {
    prefacturasAutoDb.getPrefacturasautoCliente(req.params.clienteId, function (err, prefacturasAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturasAuto);
        }
    });
});

//DEVUELVE LAS FACTURAS DE UN CLIENTE O UN AGENTE ASOCIADO Y UN DEPARTAMENTO, DEPENDIENDO DE LOS PARAMETROS PASADOS

router.get('/cliente-agente/recupera/todas/:id/:departamentoId/:esCliente', function (req, res) {
    prefacturasAutoDb.getPrefacturasautoClienteAgenteDepartamento(req.params.id, req.params.departamentoId, req.params.esCliente, function (err, prefacturasAuto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturasAuto);
        }
    });
});




// Exports
module.exports = router;
