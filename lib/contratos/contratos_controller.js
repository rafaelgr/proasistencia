var express = require('express'),
    router = express.Router(),
    contratosDb = require('./contratos_db_mysql');
var comercialesDb = require("../comerciales/comerciales_db_mysql");


router.get('/', function (req, res) {
    contratosDb.getContratos(function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    })
})

router.get('/activos', function (req, res) {
    contratosDb.getContratosActivos(function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    })
})

router.get('/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send('Debe especificar el cÃ³digo de el contrato que desea consultar');
    contratosDb.getContrato(contratoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        if (contratos.length == 0) return res.status(404).send('Contrato no encontrada');
        var contrato = contratos[0];
        res.json(contrato);
    })
});

router.get('/concat/referencia/direccion/tipo/:empresaId', function (req, res) {
    var empresaId = req.params.empresaId;
    if (!empresaId) return res.status(400).send('Debe especificar el cÃ³digo de el contrato que desea consultar');
    contratosDb.getContratoConcat(empresaId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        if (contratos.length == 0) return res.status(404).send('Contratos no encontrados');
        res.json(contratos);
    })
});

router.get('/siguiente_referencia/:abrv/:arquitectura', function (req, res) {
    var abrv = req.params.abrv;
    var arquitectura = req.params.arquitectura;
    if (!abrv) return res.status(400).send('Debe especificar el comienzo de la referencia');
    contratosDb.getSiguienteReferencia(abrv, arquitectura, function (err, nuevaReferencia) {
        if (err) return res.status(500).send(err.message);
        res.json(nuevaReferencia);
    });
});

router.get('/empresa-cliente/:empresaId/:clienteId', function (req, res) {
    var empresaId = req.params.empresaId;
    var clienteId = req.params.clienteId;
    if (!empresaId || !clienteId) return res.status(400).send("Debe incluir en la URL la empresa y el cliente a consultar");
    contratosDb.getContratosEmpresaCliente(empresaId, clienteId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    });
});

router.get('/empresa/cliente/:empresaId', function (req, res) {
    var empresaId = req.params.empresaId;
    if (!empresaId) return res.status(400).send("Debe incluir en la URL la empresa a consultar");
    contratosDb.getContratosEmpresa(empresaId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    });
});


router.get('/buscar/direcciones', function (req, res) {
    contratosDb.getDireccion(function (err, direcciones) {
        if (err) return res.status(500).send(err.message);
        res.json(direcciones);
    });
});


router.get('/contratos/beneficio/comercial/:dFecha/:hFecha/:departamentoId/:empresaId/:comercialId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var empresaId = req.params.empresaId;
    var comercialId = req.params.comercialId;
    var usuarioId = req.params.usuarioId;
    contratosDb.getContratosBeneficioComercial(dFecha, hFecha, parseInt(departamentoId), parseInt(empresaId), parseInt(comercialId), parseInt(usuarioId), function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    });
})

router.get('/contratos/beneficio/comercial/cerrados', function (req, res) {

    contratosDb.getContratosCerrados(function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    });
});

router.get('/contratos/beneficio/comercial/cerrados/:departamentoId', function (req, res) {

    contratosDb.getContratosCerradosDepartamento2(req.params.departamentoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    });
});

router.get('/contratos/clientes/checkbox/preaviso/todos', function (req, res) {

    contratosDb.getContratosPreaviso(function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    });
});




router.post('/', function (req, res) {
    var contrato = req.body.contrato;
    if (!contrato) return res.status(400).send('Debe incluir el contrato a dar de alta en el cuerpo del mensaje');
    contratosDb.postContrato(contrato, function (err, contrato) {
        if (err) return res.status(500).send(err.message);
        res.json(contrato);
    });
});

router.post('/renovar/:antContratoId/:nuevaFechaInicio/:nuevaFechaFinal/:nuevaFechaContrato', function (req, res) {
    var antContratoId = req.params.antContratoId;
    var nuevaFechaInicio = req.params.nuevaFechaInicio;
    var nuevaFechaFinal = req.params.nuevaFechaFinal;
    var nuevaFechaContrato = req.params.nuevaFechaContrato;
    if (!antContratoId || !nuevaFechaInicio || !nuevaFechaFinal || !nuevaFechaContrato) {
        return res.status(400).send("Debe incluir en la URL los parÃ¡metros necesarios");
    }
    contratosDb.postRenovarContrato(antContratoId, nuevaFechaInicio, nuevaFechaFinal, nuevaFechaContrato, function (err, data) {
        if (err) return res.status(500).send(err.message);
        res.json(data);
    })

})

router.post('/generar-prefactura/:contratoId', function (req, res) {
    var prefacturas = req.body.prefacturas;
    if (!prefacturas) return res.status(400).send('Debe incluir las prefacturas a dar de alta en el cuerpo del mensaje');
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send('Debe hacer referencia al ID del contrato en la URL');
    var importeFacturar = req.body.importeFacturar;
    contratosDb.postGenerarPrefacturas(contratoId, prefacturas, importeFacturar, function (err) {
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

router.put('/:contratoId', function (req, res) {
    var contrato = req.body.contrato;
    if (!contrato) return res.status(400).send('Debe incluir el contrato a modificar en el cuerpo del mensaje');
    contratosDb.putContrato(contrato, function (err, contrato) {
        if (err) return res.status(500).send(err.message);
        res.json(contrato);
    });
});

//actualiza los contratos de un cliente con su id pasada
router.put('/cliente/actualizado/:clienteId', function (req, res) {
    var contrato = req.body.contrato;
    var clienteId = req.params.clienteId;
    if (!contrato) return res.status(400).send('Debe incluir el contrato a modificar en el cuerpo del mensaje');
    contratosDb.putContratosCliente(contrato, clienteId, function (err, contrato) {
        if (err) return res.status(500).send(err.message);
        res.json(contrato);
    });
});

router.delete('/borrar-prefactura/concepto/:contratoPorcenId', function (req, res) {
    var contratoPorcenId = req.params.contratoPorcenId;
    if (!contratoPorcenId) return res.status(400).send('Debe hacer referencia al ID del concepto en la URL');
    contratosDb.deleteGenerarPrefacturas(contratoPorcenId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    })
});

router.delete('/borrar-prefacturas/concepto/todas/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send('Debe hacer referencia al ID del concepto en la URL');
    contratosDb.deletePrefacturasSinConcepto(contratoId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    })
});


router.delete('/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send('Debe indicar el identificador de el contrato a eliminar');
    var contrato = {
        contratoId: contratoId
    };
    contratosDb.deleteContrato(contrato, function (err, contrato) {
        if (err) return res.status(500).send(err.message);
        res.json(contrato);
    });
});


router.delete('/cliente/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send('Debe indicar el identificador de el contrato a eliminar');
    var contrato = {
        contratoId: contratoId
    };
    contratosDb.deleteContrato(contrato, function (err, contrato) {
        if (err) return res.status(500).send(err.message);
        res.json(contrato);
    });
});

router.put('/recalculo/:contratoId/:coste/:porcentajeBeneficio/:porcentajeAgente', function (req, res) {
    var contratoId = req.params.contratoId,
        coste = req.params.coste,
        porcentajeBeneficio = req.params.porcentajeBeneficio,
        porcentajeAgente = req.params.porcentajeAgente;
    if (!contratoId || !coste || !porcentajeBeneficio || !porcentajeAgente) {
        return res.status(400).send('Faltan parÃ¡metros para el recÃ¡lculo de el contrato');
    }
    contratosDb.recalculoLineasContrato(contratoId, coste, porcentajeBeneficio, porcentajeAgente, function (err) {
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

/*----------------------------------------
Comisionistas del contrato
------------------------------------------*/
router.get('/comisionistas/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send('Debe especificar el cÃ³digo de el contrato del que desea consultar las comisiones');
    contratosDb.getComisionistasDeUnContrato(contratoId, function (err, comisionistas) {
        if (err) return res.status(500).send(err.message);
        res.json(comisionistas);
    })
});

router.get('/comisionista/:contratoComisionistaId', function (req, res) {
    var contratoComisionistaId = req.params.contratoComisionistaId;
    if (!contratoComisionistaId) return res.status(400).send('Debe incluir el identificador de la relaciÃ³n en la URL');
    contratosDb.getContratoComisionista(contratoComisionistaId, function (err, comisionistas) {
        if (err) return res.status(500).send(err.message);
        if (comisionistas.length == 0) return res.status(404).send('Colabordor asociado a contrato no encontrado');
        res.json(comisionistas[0]);
    });
});

router.get('/colaborador/asociado/defecto/:agenteId/:empresaId/:departamentoId', function (req, res) {
    var agenteId = req.params.agenteId;
    if (!agenteId) return res.status(400).send('Debe especificar el cÃ³digo de el contrato del que desea consultar las comisiones');
    contratosDb.getColaborador(agenteId, function (err, colaborador) {
        if (err) return res.status(500).send(err.message);
        if (colaborador.length > 0) {
            //una vez recuperado el colaborador cargamos su porcentaje del contrato comercial correspondiente
            comercialesDb.buscarComision2(colaborador[0].ascComercialId,
                req.params.empresaId,
                req.params.departamentoId,
                function (err, comision) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        colaborador[0].porcomer = comision
                        res.json(colaborador);
                    }
                });
        } else {
            res.json(colaborador);
        }
    })
});




router.post('/comisionista', function (req, res) {
    var contratoComisionista = req.body.contratoComisionista;
    if (!contratoComisionista) return res.status(400).send('Debe incluir el colaborador a dar de alta en el cuerpo del mensaje');
    contratosDb.postContratoComisionista(contratoComisionista, function (err, contratoComisionista) {
        if (err) return res.status(500).send(err.message);
        res.json(contratoComisionista);
    });
});

//nuevo mÃ©todo que da de alta un colaborador en un contrato pero comprtobando antes 
//que no haya yta ningun tipo de colaborador igual asociado al contrato
router.post('/comisionista/comprueba/tipo', async (req, res, next) => {
    var contratoComisionista = req.body.contratoComisionista;
    try {
        if (!contratoComisionista) throw new Error('Debe incluir el colaborador a dar de alta en el cuerpo del mensaje');
        contratosDb.postContratoComisionistaComprueba(contratoComisionista, null)
            .then((contratoComisionista) => {
                if (contratoComisionista.length > 0) return res.status(404).send('El tipo de colaborador ya estÃ¡ sociado al contrato');
                res.json(contratoComisionista);
            })
            .catch(err => next(err));
    } catch (e) {
        next(e);
    }

});

router.put('/comisionista/:contratoComisionistaId', function (req, res) {
    var contratoComisionista = req.body.contratoComisionista;
    if (!contratoComisionista) return res.status(400).send('Debe incluir el colaborador a modificar en el cuerpo del mensaje');
    contratosDb.putContratoComisionista(contratoComisionista, function (err, contratoComisionista) {
        if (err) return res.status(500).send(err.message);
        res.json(contratoComisionista);
    });
});

router.delete('/comisionista/:contratoComisionistaId', function (req, res) {
    var contratoComisionistaId = req.params.contratoComisionistaId;
    if (!contratoComisionistaId) return res.status(400).send('Debe indicar el identificador del la relaciÃ³n con el colaborador a eliminar');
    var contratoComisionista = {
        contratoComisionistaId: contratoComisionistaId
    };
    contratosDb.deleteContratoComisionista(contratoComisionista, function (err, contratoComisionista) {
        if (err) return res.status(500).send(err.message);
        res.json(contratoComisionista);
    });
});

/* ----------------------
LINEAS DE OFERTA
-------------------------*/

// GetNextContratoLine
// devuelve el contrato con el id pasado
router.get('/nextlinea/:contratoId', function (req, res) {
    contratosDb.getNextContratoLineas(req.params.contratoId, function (err, contrato) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contrato == null) {
                return res.status(404).send("Contrato no encontrado");
            } else {
                res.json(contrato);
            }
        }
    });
});

// GetContratoLineas
// devuelve el contrato con el id pasado
router.get('/lineas/:contratoId', function (req, res) {
    contratosDb.getContratoLineas(req.params.contratoId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("Contrato sin lineas");
            } else {
                res.json(lineas);
            }
        }
    });
});

// GetContratoLinea
// devuelve el contrato con el id pasado
router.get('/linea/:contratoLineaId', function (req, res) {
    contratosDb.getContratoLinea(req.params.contratoLineaId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("No existe la linea de contrato solicitada");
            } else {
                res.json(lineas);
            }
        }
    });
});


// PostContratoLinea
// permite dar de alta un linea de contrato
router.post('/lineas/', function (req, res) {
    contratosDb.postContratoLinea(req.body.contratoLinea, function (err, contratoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratoLinea);
        }
    });
});



// PutContratoLinea
// modifica el contrato con el id pasado
router.put('/lineas/:contratoLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    contratosDb.getContratoLinea(req.params.contratoLineaId, function (err, contratoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoLinea == null) {
                return res.status(404).send("Linea de contrato no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                contratosDb.putContratoLinea(req.params.contratoLineaId, req.body.contratoLinea, function (err, contratoLinea) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(contratoLinea);
                    }
                });
            }
        }
    });
});

// DeleteContratoLinea
// elimina un contrato de la base de datos
router.delete('/lineas/:contratoLineaId', function (req, res) {
    var contratoLinea = req.body.contratoLinea;
    contratosDb.deleteContratoLinea(req.params.contratoLineaId, contratoLinea, function (err, contratoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// GetContratoBases
// devuelve el contrato con el id pasado
router.get('/bases/:contratoId', function (req, res) {
    contratosDb.getContratoBases(req.params.contratoId, function (err, bases) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (bases == null) {
                return res.status(404).send("Contrato sin bases");
            } else {
                res.json(bases);
            }
        }
    });
});

//--------------------RESULTADO CONTRATO ASOCIADO A FACTURAS PROVEEDORES----------------------

router.get('/asociado/facprove/resultado/:facproveId', function (req, res) {
    var facproveId = req.params.facproveId;
    if (!facproveId) return res.status(400).send('Debe especificar el cÃ³digo de la factura que desea consultar');
    contratosDb.getContratoAsociadoFacprove(facproveId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        if (contratos.length == 0) return res.status(404).send('Contrato no encontrado');
        res.json(contratos);
    })
});


router.get('/asociado/antprove/resultado/:antproveId', function (req, res) {
    var antproveId = req.params.antproveId;
    if (!antproveId) return res.status(400).send('Debe especificar el cÃ³digo de la factura que desea consultar');
    contratosDb.getContratoAsociadoAntprove(antproveId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        if (contratos.length == 0) return res.status(404).send('Contrato no encontrado');
        res.json(contratos);
    })
});

//NUEVAS LLAMADAS POR DEPARTAMENTO

router.get('/usuario/departamento/activos/:usuarioId/:departamentoId', function (req, res) {
    contratosDb.getContratosActivosUsuario(req.params.usuarioId, req.params.departamentoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    })
})

router.get('/todos/usuario/departamento/:usuarioId/:departamentoId', function (req, res) {
    contratosDb.getContratosUsuario(req.params.usuarioId, req.params.departamentoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    })
})


router.get('/preaviso/usuario/departamento/todos/:usuarioId/:departamentoId', function (req, res) {
    contratosDb.getContratosUsuarioPreaviso(req.params.usuarioId, req.params.departamentoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    })
});

router.get('/uno/campo/departamento/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send('Debe especificar el cÃ³digo de el contrato que desea consultar');
    contratosDb.getContratoConDepartamento(contratoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        if (contratos.length == 0) return res.status(404).send('Contrato no encontrada');
        var contrato = contratos[0];
        res.json(contrato);
    })
});




router.get('/empresa-cliente/usuario/departamentos/:empresaId/:clienteId/:usuarioId/:departamentoId/:usaContrato', function (req, res) {
    var empresaId = req.params.empresaId;
    var clienteId = req.params.clienteId;
    var usuarioId = req.params.usuarioId;
    var usaContrato = req.params.usaContrato;
    var departamentoId = req.params.departamentoId;
    if (!empresaId || !clienteId) return res.status(400).send("Debe incluir en la URL la empresa y el cliente a consultar");
    contratosDb.getContratosEmpresaClienteDepartamento(empresaId, clienteId, usuarioId, departamentoId, usaContrato, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    });
});


router.get('/contratos/beneficio/comercial/cerrados/usuario/departamento/:usuarioId', function (req, res) {

    contratosDb.getContratosCerradosDepartamento(req.params.usuarioId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    });
});

router.get('/todos/empresa-cliente/usuario/departamentos/:empresaId/:clienteId/:usuarioId/:departamentoId/:usaContrato', function (req, res) {
    var empresaId = req.params.empresaId;
    var clienteId = req.params.clienteId;
    var usuarioId = req.params.usuarioId;
    var usaContrato = req.params.usaContrato;
    var departamentoId = req.params.departamentoId;
    if (!empresaId || !clienteId) return res.status(400).send("Debe incluir en la URL la empresa y el cliente a consultar");
    contratosDb.getContratosEmpresaClienteDepartamentoTodos(empresaId, clienteId, usuarioId, departamentoId, usaContrato, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    });
});



//CONCEPTOS PORCENTAJES

// GetLineasConceptoCobro
// devuelve las lineas de una forma de pago
router.get('/conceptos/porcentaje/:contratoId', function (req, res) {
    contratosDb.getConceptoCobroLineas(req.params.contratoId, function (err, conceptos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(conceptos);
        }
    });
});


// GetLineaConceptoCobro
// devuelve una linea de la tabla formaspago_porcentajes
router.get('/concepto/porcenteje/registro/:contratoPorcenId', function (req, res) {
    contratosDb.getConceptoCobroLinea(req.params.contratoPorcenId, function (err, concepto) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (concepto == null) {
                return res.status(404).send("concepto no encontrado");
            } else {
                res.json(concepto);
            }
        }
    });
});

// PostConceptoCobroLinea
// permite dar de alta un ConceptoCobro
router.post('/concepto', function (req, res) {
    contratosDb.postConceptoCobroLineas(req.body.cobroPorcen, function (err, cobroPorcen) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cobroPorcen);
        }
    });
});

// PutConceptoCobro
// modifica el ConceptoCobro con el id pasado
router.put('/concepto/:contratoPorcenId', function (req, res) {
    contratosDb.putConceptoCobroLinea(req.params.contratoPorcenId, req.body.cobroPorcen, function (err, cobroPorcen) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cobroPorcen);
        }
    });
});

// DeletetarifaClienteLinea
// elimina un tarifaCliente de la base de datos
router.delete('/concepto/:contratoPorcenId', function (req, res) {
    contratosDb.deleteConceptoCobroLinea(req.params.contratoPorcenId, function (err, conceptoPorcen) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//PLANIFICACION
router.get('/lineas/planificacion/:contratoId', async (req, res, next) => {
    var contratoId = req.params.contratoId
    try {
        contratosDb.getPlanificacionLineas(contratoId, null)
            .then((result) => {
                res.json(result);

            })
            .catch(err => next(err));
    } catch (e) {
        next(e);
    }

});

router.post('/lineas/planificacion/:contratoId', async (req, res, next) => {
    var contratoId = req.params.contratoId
    var numCobros = req.body.numCobros.numCobros
    try {
        contratosDb.getPlanificacionLineas(contratoId, numCobros)
            .then((result) => {
                res.json(result);

            })
            .catch(err => next(err));
    } catch (e) {
        next(e);
    }

});

router.get('/linea-planificacion/:contPlanificacionId', async (req, res, next) => {
    var id = req.params.contPlanificacionId
    try {
        contratosDb.getPlanificacionLinea(id)
            .then((result) => {
                res.json(result);

            })
            .catch(err => next(err));
    } catch (e) {
        next(e);
    }

});

// PostConceptoCobroLinea
// permite dar de alta un ConceptoCobro
router.post('/planificacion', async (req, res, next) => {
    try {
        contratosDb.postPlanificacionLineas(req.body.planificacion)
            .then((result) => {
                res.json(result);

            })
            .catch(err => next(err));
    } catch (e) {
        next(e);
    }
});

//putPlanificacionLinea
router.put('/planificacion/:contPlanificacionId', async (req, res, next) => {
    try {
        var id = req.params.contPlanificacionId
        contratosDb.getPlanificacionLinea(id)
            .then((result) => {
                if (result.length == 0) {
                    res.status(404).send("Registro no encontrado.");
                } else {
                    if (req.body.planificacion.contPlanificacionId != id) {
                        res.status(404).send("El id del ojeto y el de la url no coinciden.");
                    } else {
                        contratosDb.putPlanificacionLinea(req.body.planificacion, id)
                            .then((result) => {
                                res.json(result);

                            })
                            .catch(err => next(err));
                    }
                }
            })
            .catch((e) => {
                next(e)
            })
    } catch (e) {
        next(e);
    }
});


//putPlanificacionLinea
router.delete('/planificacion/:contPlanificacionId', async (req, res, next) => {
    try {
        var id = req.params.contPlanificacionId
        contratosDb.getPlanificacionLinea(id)
            .then((result) => {
                if (result.length == 0) {
                    res.status(404).send("Registro no encontrado.");
                } else {
                    contratosDb.deletePlanificacionLinea(id)
                        .then((result) => {
                            res.json(result);

                        })
                        .catch(err => next(err));
                }
            })
            .catch((e) => {
                next(e)
            })
    } catch (e) {
        next(e);
    }
});



/* FUNCIONES RELACIONADAS CON LOS CONTRATOS VINCULADOS */

// PostConceptoCobroLinea
// permite dar de alta un ConceptoCobro
router.post('/crear/contrato/asociado', function (req, res) {
    contratosDb.postContratoAsociado(req.body.contrato.contratoId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// GetcontratosVinculados
// devuelve una linea de la tabla formaspago_porcentajes
router.get('/vinculados/:contratoId', function (req, res) {
    contratosDb.getcontratosVinculados(req.params.contratoId, function (err, contratos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratos);

        }
    });
});

// putcontratosVinculados
// modifica los contratos asociados a un contrato
router.put('/vinculados/actualiza/:contratoId', function (req, res) {
    contratosDb.putcontratosVinculados(req.params.contratoId, req.body.contrato, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

//DOCUMENTACION DEL CONTRATO

//devuelve las carpetas de un departamento con los documentos que pertenecen a una contrato determinado
router.get('/documentacion/contrato/oferta/:contratoId/:departamentoId/:ofertaId', async (req, res, next) => {
    try {
        contratosDb.getContratoDocumentacion(req.params.contratoId, req.params.departamentoId, req.params.ofertaId)
            .then((docum) => {
                if (!docum) return res.status(404).send("documentaciÃ³n no encontrada");
                res.json(docum)
            })
            .catch(err => next(err));
    } catch (error) {
        next(error);
    }
});

//devuelve un registro de la table contratoDocumentacion con su id pasada
router.get('/documentacion/un/documento/:contratoDocumentoId', async (req, res, next) => {
    try {
        contratosDb.getContratoDocumento(req.params.contratoDocumentoId)
            .then((docum) => {
                if (!docum) return res.status(404).send("documento no encontrado");
                res.json(docum)
            })
            .catch(err => next(err));
    } catch (error) {
        next(error);
    }
});
//devuelve un registro de la table contratoDocumentacion con su id pasada
router.get('/documentacion/documentos/carpeta/:carpetaId', async (req, res, next) => {
    try {
        contratosDb.getDocumentosCarpeta(req.params.carpetaId)
            .then((docums) => {
                //if (!docums) return res.status(404).send("documentos no encontrados");
                res.json(docums)
            })
            .catch(err => next(err));
    } catch (error) {
        next(error);
    }
});


//inserta un registro en la tabla contratoDocumentacion
router.post('/documentacion/:ofertaId', async (req, res, next) => {
    try {
        contratosDb.postContratoDocumentacion(req.body.contratoDocumentacion, req.params.ofertaId)
            .then((docum) => {
                res.json(docum)
            })
            .catch(err => next(err));
    } catch (error) {
        next(error);
    }
});


//Modifica un registro en la tabla contratoDocumentacion
router.put('/documentacion/:contratoDocumentoId', async (req, res, next) => {
    try {
        contratosDb.putContratoDocumentacion(req.body.contratoDocumentacion, req.params.contratoDocumentoId)
            .then((docum) => {
                res.json(docum)
            })
            .catch(err => next(err));
    } catch (error) {
        next(error);
    }
});

//Inserta un registro en la tabla carpetas
router.post('/documentacion/carpeta', async (req, res, next) => {
    try {
        contratosDb.postContratoDocumentacionCarpeta(req.body.carpeta)
            .then((carpeta) => {
                res.json(carpeta)
            })
            .catch(err => next(err));
    } catch (error) {
        next(error);
    }
});


//Elimina un registro en la tabla contratoDocumentacion
router.delete('/documentacion/elimina-documento/:contratoDocumentoId', async (req, res, next) => {
    try {
        contratosDb.deleteContratoDocumentacion(req.params.contratoDocumentoId)
            .then((result) => {
                res.json(null)
            })
            .catch(err => next(err));
    } catch (error) {
        next(error);
    }
});

//Elimina todos los registros de la tabla contratoDocumentacion asociados 
//a una carpeta y el registro correspondiente en la tabla carpetas.
router.delete('/documentacion/elimina-carpeta/:carpetaId', async (req, res, next) => {
    try {
        contratosDb.deleteContratoCarpeta(req.params.carpetaId)
            .then((result) => {
                res.json(result)
            })
            .catch(err => next(err));
    } catch (error) {
        next(error);
    }
});


//INFORME CONTRATOS
router.get('/inf/contratos/json/visor/:dFecha/:hFecha/:empresaId/:clienteId/:departamentoId/:tipoComercialId/:comercialId/:contratoId/:usuario', async (req, res, next) => {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var empresaId = req.params.empresaId;
    var tipoComercialId = req.params.tipoComercialId;
    var comercialId = req.params.comercialId;
    var clienteId = req.params.clienteId;
    var contratoId = req.params.contratoId;
    var usuarioId = req.params.usuario;
    try {
        contratosDb.getContratosObj(dFecha, hFecha, parseInt(empresaId), parseInt(clienteId), parseInt(departamentoId), parseInt(tipoComercialId), parseInt(comercialId), parseInt(contratoId), parseInt(usuarioId))
            .then((result) => {
                if (result) {
                    //if(result.length > 0) {
                    contratosDb.getCobrosObj(usuarioId)
                        .then((result2) => {
                            res.json(result2);
                        })
                        .catch(err => next(err));
                    //}
                } else {
                    res.json(result);
                }
            })
            .catch(err => next(err));
    } catch (e) {
        next(e);
    }

});

router.get('/recupera/todos/:dFecha/:hFecha/:departamentoId/:empresaId/', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var empresaId = req.params.empresaId;
    var departamentoId = req.params.departamentoId;
    if (!empresaId) return res.status(400).send('Debe especificar el cÃ³digo de el contrato que desea consultar');
    contratosDb.getContratosEmpresaDepartamento(dFecha, hFecha, empresaId, departamentoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        //if (contratos.length == 0) return res.status(404).send('Contratos no encontrados');
        res.json(contratos);
    })
});


router.get('/anticipos/no-vinculados/:contratoId', async (req, res, next) => {
    try {
        contratosDb.getAnticiposNoVinculados(req.params.contratoId)
            .then((result) => {
                res.json(result)
            })
            .catch(err => next(err));
    } catch (error) {
        next(error);
    }
});



router.put('/recalculo/lineal/:contratoId/:porcentajeAgente', function (req, res) {
    var contratoId = req.params.contratoId,
        porcentajeAgente = req.params.porcentajeAgente;
    if (!contratoId || !porcentajeAgente) {
        return res.status(400).send('Faltan parÃ¡metros para el recÃ¡lculo del contrato');
    }
    contratosDb.recalculoLineasContratoLineal(contratoId, porcentajeAgente, function (err) {
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

//devuelve un registro de la tabla contratoDocumentacion con su id pasada
router.get('/renovado/registro/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    contratosDb.getRenovado(contratoId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        if (result.length > 0) {
            contratosDb.getRenovados(result[0].contratoOriginalId, function (err, result) {
                if (err) return res.status(500).send(err.message);
                res.json(result);
            });
        } else {
            res.json(result);
        }
    });
});

//Elimina todos los registros de la tabla contratoDocumentacion asociados 
//a una carpeta y el registro correspondiente en la tabla carpetas.
router.get('/comprueba/alta/implicados-contrato/:contratoId', async (req, res, next) => {
    try {
        let result = await contratosDb.getImplicadosContrato(req.params.contratoId)
        if (result.length == 0) result = null;
        res.json(result)
    } catch (error) {
        next(error);
    }
});

//renovacion contratos alquileres

router.get('/renovar/:dFecha/:hFecha/:departamentoId/:preaviso', async (req, res, next) => {
    try {
        var dFecha = req.params.dFecha;
        var hFecha = req.params.hFecha;
        var departamentoId = req.params.departamentoId;
        var preaviso = req.params.preaviso;
        let contratos = await contratosDb.getContratosRenovar(dFecha, hFecha, parseInt(departamentoId), preaviso)
        if (contratos.length == 0) contratos = null;
        res.json(contratos);
    } catch (err) {
        next(res.status(500).send(err.message));
    }
});

router.post('/renovar/varios/:dFecha/:hFecha/:departamentoId/:preaviso', async (req, res, next) => {
    try {

        var dFecha = req.params.dFecha;
        var hFecha = req.params.hFecha;
        var departamentoId = req.params.departamentoId;
        var preaviso = req.params.preaviso
        if (!dFecha || !hFecha || !departamentoId) {
            return res.status(400).send("Debe incluir en la URL los parÃ¡metros necesarios");
        }
        let result = await contratosDb.postRenovarContratos(dFecha, hFecha, departamentoId, preaviso);
        res.json(result);

    } catch (err) {
        next(res.status(500).send(err.message));
    }
});


//actualizaciÃ³n IPC de contratos de alquileres

router.get('/actualizar/:dFecha/:hFecha/:departamentoId/:preaviso', async (req, res, next) => {
    try {
        var dFecha = req.params.dFecha;
        var hFecha = req.params.hFecha;
        if (hFecha = '0') hFecha = null;
        var departamentoId = req.params.departamentoId;
        var preaviso = req.params.preaviso;
        let contratos = await contratosDb.getContratosActualizar(dFecha, hFecha, parseInt(departamentoId), preaviso)
        if (contratos.length == 0) contratos = null;
        res.json(contratos);
    } catch (err) {
        next(res.status(500).send(err.message));
    }
});

router.post('/actualizar/varios/:dFecha/:hFecha/:ipc/:departamentoId/:preaviso', async (req, res, next) => {
    try {

        var dFecha = req.params.dFecha;
        var hFecha = req.params.hFecha;
        if (hFecha = '0') hFecha = null;
        var ipc = req.params.ipc;
        var departamentoId = req.params.departamentoId;
        var preaviso = req.params.preaviso
        if (!dFecha || !departamentoId) {
            return res.status(400).send("Debe incluir en la URL los parÃ¡metros necesarios");
        }
        let result = await contratosDb.putActualizarContratos(dFecha, hFecha, ipc, departamentoId, preaviso);
        res.json(result);

    } catch (err) {
        next(res.status(500).send(err.message));
    }
});

router.put('/resumen/:contratoId', function (req, res) {
    var datos = req.body;
    if (!datos) return res.status(400).send('Debe incluir el contrato a modificar en el cuerpo del mensaje');
    contratosDb.putContratoResumen(datos, function (err, datos) {
        if (err) return res.status(500).send(err.message);
        res.json(datos);
    });
});

//PROFESIONES DEL PROVEEDOR
router.get('/tecnicos/asociados/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    contratosDb.getTecnicosAsociados(contratoId, function (err, tecnicos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tecnicos);
        }
    });
});

//TASAS LINEAS CONTRATO


router.get('/linea/visado/tasas/:tasaVisadoId', function (req, res) {
    contratosDb.getContratoTasaVisado(req.params.tasaVisadoId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("No existe la linea de contrato solicitada");
            } else {
                res.json(lineas);
            }
        }
    });
});

router.get('/lineas/visado/tasas/:contratoId', function (req, res) {
    contratosDb.getContratoTasasVisado(req.params.contratoId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("Contrato sin lineas");
            } else {
                res.json(lineas);
            }
        }
    });
});


router.post('/lineas/visado/tasas', function (req, res) {
    contratosDb.postContratoTasaVisado(req.body.contratoLineaTasa, function (err, contratoLineaTasa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratoLineaTasa);
        }
    });
});


router.put('/lineas/visado/tasas/:tasaVisadoId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    contratosDb.getContratoTasaVisado(req.params.tasaVisadoId, function (err, contratoLineaTasa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoLineaTasa == null) {
                return res.status(404).send("Linea de contrato no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                contratosDb.putContratoTasaVisado(req.params.tasaVisadoId, req.body.contratoLineaTasa, function (err, contratoLineaTasa) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(contratoLineaTasa);
                    }
                });
            }
        }
    });
});


router.delete('/lineas/visado/tasas/:tasaVisadoId', function (req, res) {
    contratosDb.deleteContratoLineaTasa(req.params.tasaVisadoId, function (err, contratoLineaTasa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//LAMADAS DE LOS CONTRATOS DE ARQUITECTURA


router.get('/arquitectura', function (req, res) {
    contratosDb.getContratos(function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    })
});

router.get('/arquitectura/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send('Debe especificar el cÃ³digo de el contrato que desea consultar');
    contratosDb.getContratoArquitectura(contratoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        if (contratos.length == 0) return res.status(404).send('Contrato no encontrada');
        var contrato = contratos[0];
        res.json(contrato);
    })
});

router.get('/arquitectura/usuario/departamento/activos/:usuarioId/:departamentoId', function (req, res) {
    contratosDb.getContratosActivosUsuarioArquitectura(req.params.usuarioId, req.params.departamentoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    })
});

router.get('/arquitectura/todos/usuario/departamento/:usuarioId/:departamentoId', function (req, res) {
    contratosDb.getContratosUsuarioArquitectura(req.params.usuarioId, req.params.departamentoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    })
});

router.get('/arquitectura/preaviso/usuario/departamento/todos/:usuarioId/:departamentoId', function (req, res) {
    contratosDb.getContratosUsuarioPreavisoArquitectura(req.params.usuarioId, req.params.departamentoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        res.json(contratos);
    })
});
//restauraciÃ³n contratos actulizados con el IPC

router.get('/actualizados/precio/', async (req, res, next) => {
    try {
        let contratos = await contratosDb.getContratosActualizados(null)
        if (contratos.length == 0) contratos = null;
        res.json(contratos);
    } catch (err) {
        next(res.status(500).send(err.message));
    }
});

router.put('/actualizados/revertir/ipc', async (req, res, next) => {
    try {
        let data = req.body;
        let contratos = await contratosDb.getContratosActualizados(data);
        let result = await contratosDb.putRevertirIpc(contratos);
        res.json(result);

    } catch (err) {
        next(res.status(500).send(err.message));
    }
});

router.get('/arquitectura/visibles-novisibles/erp/:departamentoId/:visible', async (req, res, next) => {
    try {
        contratosDb.getContratosVisibesNoVisibles(req.params.departamentoId, parseInt(req.params.visible))
            .then((result) => {
                res.json(result)
            })
            .catch(err => next(err));
    } catch (error) {
        next(error);
    }
});


router.get('/arquitectura/visibles-novisibles/erp/:contratoId/:departamentoId/:visible', async (req, res, next) => {
    try {
        contratosDb.getContratoVisibeNoVisible(req.params.departamentoId, parseInt(req.params.visible), req.params.contratoId)
            .then((result) => {
                res.json(result)
            })
            .catch(err => next(err));
    } catch (error) {
        next(error);
    }
});

//crea el JSON del contrato solicitado
router.get('/obtiene/objeto/contrato/:contratoId', async (req, res, next) => {
    try {
        let contratoId = req.params.contratoId;
        let obj = await contratosDb.postCrearReportContrato(contratoId)
        let txt = JSON.stringify(obj);
        res.json(obj);
    } catch (e) {
        next(res.status(500).send(e.message));
    }
});


//crea el JSON del contrato adicional solicitado
router.post('/obtiene/objeto/contrato/adicional', async (req, res, next) => {
    try {
        let contratoId = req.body.contratoId;
        let refPresupuestoAdicional = req.body.refPresupuestoAdicional;
        let contratoInteresesId = req.body.contratoInteresesId;
        let obj = await contratosDb.postCrearReportAdicional(contratoId, refPresupuestoAdicional, contratoInteresesId)
        let txt = JSON.stringify(obj);
        res.json(obj);
    } catch (e) {
        next(res.status(500).send(e.message));
    }
});

//crea el JSON del contrato solicitado
router.get('/obtiene/objeto/contrato/acta/recepcion/:contratoId', async (req, res, next) => {
    try {
        let contratoId = req.params.contratoId;
        let obj = await contratosDb.postCrearReportContratoActaRecepcion(contratoId)
        let txt = JSON.stringify(obj);
        res.json(obj);
    } catch (e) {
        next(res.status(500).send(e.message));
    }
});

//nuevo mÃ©todo que da de alta un colaborador en un contrato pero comprtobando antes 
//que no haya yta ningun tipo de colaborador igual asociado al contrato
router.post('/crear/interes/:contratoId/:totalIntereses', async (req, res, next) => {
    var contratoId = req.params.contratoId;
    var totalIntereses = parseFloat(req.params.totalIntereses);
    try {
        if (!contratoId) throw new Error('Debe incluir el Id del contrato en la URL');
        contratosDb.postContratoIntereses(contratoId, totalIntereses)
            .then((result) => {
                if (!result) return res.status(404).send('ERROR, no se ha creado ningún registro');
                res.json(result);
            })
            .catch(err => next(err));
    } catch (e) {
        next(res.status(500).send(e.message));
    }
});
//PLANIFICACION TEMPORAL

router.get('/lineas/planificacion/temporal/:contratoId', async (req, res, next) => {
    var contratoId = req.params.contratoId
    try {
        contratosDb.getPlanificacionLineasTemp(contratoId)
            .then((result) => {
                res.json(result);

            })
            .catch(err => next(err));
    } catch (e) {
        next(e);
    }

});



router.get('/linea-planificacion/temporal/:contPlanificacionTempId', async (req, res, next) => {
    var id = req.params.contPlanificacionTempId
    try {
        contratosDb.getPlanificacionLineaTemp(id)
            .then((result) => {
                res.json(result);

            })
            .catch(err => next(err));
    } catch (e) {
        next(e);
    }

});

// PostConceptoCobroLinea
// permite dar de alta un ConceptoCobro
router.post('/planificacion/temporal', async (req, res, next) => {
    try {
        contratosDb.postPlanificacionLineasTemp(req.body.planificacion)
            .then((result) => {
                res.json(result);

            })
            .catch(err => next(err));
    } catch (e) {
        next(e);
    }
});

// PostConceptoCobroLinea
// permite dar de alta un ConceptoCobro
router.post('/planificacion/temporal/externo', async (req, res, next) => {
    try {
        contratosDb.postPlanificacionLineasTempExterno(req.body.planificacion)
            .then((result) => {
                res.json(result);

            })
            .catch(err => next(err));
    } catch (e) {
        next(e);
    }
});

//putPlanificacionLinea
router.put('/planificacion/temporal/:contPlanificacionTempId', async (req, res, next) => {
    try {
        var id = req.params.contPlanificacionTempId
        contratosDb.getPlanificacionLineaTemp(id)
            .then((result) => {
                if (result.length == 0) {
                    res.status(404).send("Registro no encontrado.");
                } else {
                    if (req.body.planificacion.contPlanificacionTempId != id) {
                        res.status(404).send("El id del ojeto y el de la url no coinciden.");
                    } else {
                        contratosDb.putPlanificacionLineaTemp(req.body.planificacion, id)
                            .then((result) => {
                                res.json(result);

                            })
                            .catch(err => next(err));
                    }
                }
            })
            .catch((e) => {
                next(e)
            })
    } catch (e) {
        next(e);
    }
});


//putPlanificacionLinea
router.delete('/planificacion/temporal/:contPlanificacionTempId', async (req, res, next) => {
    try {
        var id = req.params.contPlanificacionTempId
        contratosDb.getPlanificacionLineaTemp(id)
            .then((result) => {
                if (result.length == 0) {
                    res.status(404).send("Registro no encontrado.");
                } else {
                    contratosDb.deletePlanificacionLineaTemp(id)
                        .then((result) => {
                            res.json(result);

                        })
                        .catch(err => next(err));
                }
            })
            .catch((e) => {
                next(e)
            })
    } catch (e) {
        next(e);
    }
});

router.post('/generar-prefactura/temporal/:contratoId', function (req, res) {
    var prefacturas = req.body.prefacturas;
     var prefacturasIntereses = req.body.prefacturasIntereses;
    if (!prefacturas) return res.status(400).send('Debe incluir las prefacturas temporales a dar de alta en el cuerpo del mensaje');
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send('Debe hacer referencia al ID del contrato en la URL');
    contratosDb.postGenerarPrefacturasTemporales(contratoId, prefacturas, prefacturasIntereses,function (err) {
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});


router.post('/importa/palnificacion/lineas/temporales/:contratoId', async (req, res, next) => {
    var contratoId = req.params.contratoId
    try {
        let result = await contratosDb.getPlanificacionLineasTemp(contratoId);
        if (!result || result.length == 0) throw new Error("Fallo al recuperar la planificacion temporal");
        let result2 = await contratosDb.postImportarPlanificacion(result)

        res.json(result2);
    } catch (e) {
        next(e);
    }

});


router.post('/planificacion/obras/temporal/exportar/linea/intereses', async (req, res, next) => {
    var contPlanificacionTempId = req.body.contPlanificacionTempId;
    var contratoInteresesId = req.body.contratoInteresesId;
    var totalIntereses = req.body.totalIntereses;
    try {
        let result = await contratosDb.getPlanificacionLineaTemp(contPlanificacionTempId);
        if (!result || result.length == 0) throw new Error("Fallo al recuperar la planificacion temporal");
        let result2 = await contratosDb.postExportarPlanificacionIntereses(result, contratoInteresesId, totalIntereses)

        res.json(result2);
    } catch (e) {
        next(e);
    }

});


// Exports
module.exports = router;
