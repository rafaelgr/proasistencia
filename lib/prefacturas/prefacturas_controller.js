var express = require('express');
var router = express.Router();
var prefacturasDb = require("./prefacturas_db_mysql");

// GetPrefacturas
// Devuelve una lista de objetos con todos los prefacturas de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos prefacturas
// que lo contengan.
router.get('/', function (req, res) {
    prefacturasDb.getPrefacturas(function (err, prefacturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturas);
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

// GetPrefactura
// devuelve el prefactura con el id pasado
router.get('/:prefacturaId', function (req, res) {
    prefacturasDb.getPrefactura(req.params.prefacturaId, function (err, prefactura) {
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
router.get('/emision/:dFecha/:hFecha/:clienteId/:agenteId/:tipoMantenimientoId/:empresaId/:rectificativa', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var clienteId = req.params.clienteId;
    var agenteId = req.params.agenteId;
    var empresaId = req.params.empresaId;
    var tipoMantenimientoId = req.params.tipoMantenimientoId;
    var rectificativa = req.params.rectificativa;
    prefacturasDb.getPreEmisionPrefacturas(dFecha, hFecha, clienteId, agenteId, tipoMantenimientoId, empresaId, rectificativa,function (err, prefacturas) {
        if (err) return res.status(500).send(err.message);
        res.json(prefacturas);
    });
})


// PostPrefactura
// permite dar de alta un prefactura
router.post('/', function (req, res) {
    prefacturasDb.postPrefactura(req.body.prefactura, function (err, prefactura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefactura);
        }
    });
});



// PutPrefactura
// modifica el prefactura con el id pasado
router.put('/:prefacturaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    prefacturasDb.getPrefactura(req.params.prefacturaId, function (err, prefactura) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefactura == null) {
                return res.status(404).send("Prefactura no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                prefacturasDb.putPrefactura(req.params.prefacturaId, req.body.prefactura, function (err, prefactura) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(prefactura);
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

// DeletePrefactura
// elimina un prefactura de la base de datos
router.delete('/:prefacturaId', function (req, res) {
    var prefactura = req.body.prefactura;
    prefacturasDb.deletePrefactura(req.params.prefacturaId, prefactura, function (err, prefactura) {
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
router.get('/lineas/:prefacturaId', function (req, res) {
    prefacturasDb.getPrefacturaLineas(req.params.prefacturaId, function (err, lineas) {
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
// devuelve el prefactura con el id pasado
router.get('/linea/:prefacturaLineaId', function (req, res) {
    prefacturasDb.getPrefacturaLinea(req.params.prefacturaLineaId, function (err, lineas) {
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


// PostPrefacturaLinea
// permite dar de alta un linea de prefactura
router.post('/lineas/', function (req, res) {
    prefacturasDb.postPrefacturaLinea(req.body.prefacturaLinea, function (err, prefacturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturaLinea);
        }
    });
});



// PutPrefacturaLinea
// modifica el prefactura con el id pasado
router.put('/lineas/:prefacturaLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    prefacturasDb.getPrefacturaLinea(req.params.prefacturaLineaId, function (err, prefacturaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (prefacturaLinea == null) {
                return res.status(404).send("Linea de prefactura no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                prefacturasDb.putPrefacturaLinea(req.params.prefacturaLineaId, req.body.prefacturaLinea, function (err, prefacturaLinea) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(prefacturaLinea);
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

// GetPrefacturaBases
// devuelve el prefactura con el id pasado
router.get('/bases/:prefacturaId', function (req, res) {
    prefacturasDb.getPrefacturaBases(req.params.prefacturaId, function (err, bases) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (bases == null) {
                return res.status(404).send("Prefactura sin bases");
            } else {
                res.json(bases);
            }
        }
    });
});

//LLAMADAS PARA PREFACTURAS POR DEPARTAMENTOS DE USUARIO

// GetPrefacturasUsuario
// Devuelve una lista de objetos con todos los prefacturas de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos prefacturas
// que lo contengan.
router.get('/usuario/logado/departamento/:usuarioId/:departamentoId/:dFecha/:hFecha', function (req, res) {
    prefacturasDb.getPrefacturasUsuario(req.params.usuarioId, req.params.departamentoId, req.params.dFecha, req.params.hFecha ,function (err, prefacturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturas);
        }
    });
});

router.get('/usuario/logado/departamento/all/:usuarioId/:departamentoId/:dFecha/:hFecha', function (req, res) {
    prefacturasDb.getPrefacturasAllUsuario(req.params.usuarioId, req.params.departamentoId, req.params.dFecha, req.params.hFecha, function (err, prefacturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(prefacturas);
        }
    });
});


// GetEmisionUsuario
// obtiene las prefacturas entre las fechas pasadas y que no han sido facturadas con anterioridad.
router.get('/emision/usuario/:dFecha/:hFecha/:usuarioId/:clienteId/:agenteId/:departamentoId/:empresaId/:rectificativa', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var usuarioId = req.params.usuarioId
    var clienteId = req.params.clienteId;
    var agenteId = req.params.agenteId;
    var empresaId = req.params.empresaId;
    var departamentoId = req.params.departamentoId;
    var rectificativa = req.params.rectificativa;
    prefacturasDb.getPreEmisionPrefacturasUsuario(dFecha, hFecha, usuarioId, clienteId, agenteId, departamentoId, empresaId, rectificativa,function (err, prefacturas) {
        if (err) return res.status(500).send(err.message);
        res.json(prefacturas);
    });
})

//LLAMADA DE PREFACTURACIÓN DE CLIENTES REPARACIONES

// PostCrearDesdePrefacturas
// Crea las facturas desde las preefcacturas pasadas.
router.post('/prefactura/cliente/parte/:deFecha/:aFecha/:fechaPrefactura', function (req, res) {
    
    prefacturasDb.postCrearPrefactCliDesdeParte(req.body.seleccionados, req.params.deFecha, req.params.aFecha, req.params.fechaPrefactura,function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(true);
    });
});


//crea el JSON de informe de facturas emitidas
router.post('/prefacturas/crea/json/:dFecha/:hFecha/:clienteId/:empresaId/:tipoIvaId/:factu/:orden/:departamentoId/:usuario', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var clienteId = req.params.clienteId;
    var empresaId = req.params.empresaId;
    var tipoIvaId = req.params.tipoIvaId;
    var factu = req.params.factu;
    var orden = req.params.orden;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuario;
    prefacturasDb.postCrearReport(dFecha, hFecha, clienteId, empresaId, tipoIvaId, factu, orden, departamentoId, usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

router.delete('/contrato/sin/facturar/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta el identificador del contrato");
    prefacturasDb.deletePrefacturasContratoSinFacturar(contratoId, function(err){
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

//PLANIFICACIÓN OBRAS
router.get('/contrato/generadas/planificacion/:contratoId/:contPlanificacionId', function(req, res){
    var contratoId = req.params.contratoId;
    var contPlanificacionId = req.params.contPlanificacionId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    prefacturasDb.getPrefacturasContratoGeneradasPlanificacion(contratoId, contPlanificacionId, function(err, prefacturas){
        if (err) return res.status(500).send(err.message);
        res.json(prefacturas);
    })
});

router.delete('/contrato/generadas/planificacion/:contratoId/:contPlanificacionId', function(req, res){
    var contratoId = req.params.contratoId;
    var contPlanificacionId = req.params.contPlanificacionId;
    var importe = req.body.importe;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    prefacturasDb.deletePrefacturasContratoGeneradasPlanificacion(contratoId, contPlanificacionId, importe, function(err){
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

//RECEPCION LETRAS--GESTION DE COBROS

router.put('/recepcionGestion/planificacion/:contratoId', async (req, res, next) =>{
    try {
        var contratoId = req.params.contratoId;
        var recepcionGestion = req.body.recepcionGestion;
        if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
        prefacturasDb.putrecepcionGestionContrato(contratoId, recepcionGestion)
        .then( (result) => {
            res.json(result);
          
        })
        .catch(err => next(err));	
    } catch(e) {
        next(e);
    }
});


// Exports
module.exports = router;
