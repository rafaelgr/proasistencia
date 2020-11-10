var express = require('express'),
    router = express.Router(),
    contratosDb = require('./contratos_db_mysql');

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
    if (!contratoId) return res.status(400).send('Debe especificar el código de el contrato que desea consultar');
    contratosDb.getContrato(contratoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        if (contratos.length == 0) return res.status(404).send('Contrato no encontrada');
        var contrato = contratos[0];
        res.json(contrato);
    })
});

router.get('/concat/referencia/direccion/tipo/:empresaId', function (req, res) {
    var empresaId = req.params.empresaId;
    if (!empresaId) return res.status(400).send('Debe especificar el código de el contrato que desea consultar');
    contratosDb.getContratoConcat(empresaId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        if (contratos.length == 0) return res.status(404).send('Contrato no encontrada');
        res.json(contratos);
    })
});

router.get('/siguiente_referencia/:abrv', function (req, res) {
    var abrv = req.params.abrv;
    if (!abrv) return res.status(400).send('Debe especificar el comienzo de la referencia');
    contratosDb.getSiguienteReferencia(abrv, function (err, nuevaReferencia) {
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
        return res.status(400).send("Debe incluir en la URL los parámetros necesarios");
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
    contratosDb.postGenerarPrefacturas(contratoId, prefacturas, function (err) {
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
    contratosDb.putContratosCliente(contrato, clienteId,function (err, contrato) {
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
        return res.status(400).send('Faltan parámetros para el recálculo de el contrato');
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
    if (!contratoId) return res.status(400).send('Debe especificar el código de el contrato del que desea consultar las comisiones');
    contratosDb.getComisionistasDeUnContrato(contratoId, function (err, comisionistas) {
        if (err) return res.status(500).send(err.message);
        res.json(comisionistas);
    })
});

router.get('/comisionista/:contratoComisionistaId', function (req, res) {
    var contratoComisionistaId = req.params.contratoComisionistaId;
    if (!contratoComisionistaId) return res.status(400).send('Debe incluir el identificador de la relación en la URL');
    contratosDb.getContratoComisionista(contratoComisionistaId, function (err, comisionistas) {
        if (err) return res.status(500).send(err.message);
        if (comisionistas.length == 0) return res.status(404).send('Colabordor asociado a contrato no encontrado');
        res.json(comisionistas[0]);
    });
});

router.get('/colaborador/asociado/defecto/:agenteId', function (req, res) {
    var agenteId = req.params.agenteId;
    if (!agenteId) return res.status(400).send('Debe especificar el código de el contrato del que desea consultar las comisiones');
    contratosDb.getColaborador(agenteId, function (err, colaborador) {
        if (err) return res.status(500).send(err.message);
        res.json(colaborador);
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
    if (!contratoComisionistaId) return res.status(400).send('Debe indicar el identificador del la relación con el colaborador a eliminar');
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
    if (!facproveId) return res.status(400).send('Debe especificar el código de la factura que desea consultar');
    contratosDb.getContratoAsociadoFacprove(facproveId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        if (contratos.length == 0) return res.status(404).send('Contrato no encontrado');
        res.json(contratos);
    })
});


router.get('/asociado/antprove/resultado/:antproveId', function (req, res) {
        var antproveId = req.params.antproveId;
        if (!antproveId) return res.status(400).send('Debe especificar el código de la factura que desea consultar');
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
    if (!contratoId) return res.status(400).send('Debe especificar el código de el contrato que desea consultar');
    contratosDb.getContratoConDepartamento(contratoId, function (err, contratos) {
        if (err) return res.status(500).send(err.message);
        if (contratos.length == 0) return res.status(404).send('Contrato no encontrada');
        var contrato = contratos[0];
        res.json(contrato);
    })
});




router.get('/empresa-cliente/usuario/departamentos/:empresaId/:clienteId/:usuarioId/:departamentoId/:usaContrato/:fecha', function (req, res) {
    var empresaId = req.params.empresaId;
    var clienteId = req.params.clienteId;
    var usuarioId = req.params.usuarioId;
    var usaContrato = req.params.usaContrato;
    var departamentoId = req.params.departamentoId;
    var fecha = req.params.fecha;
    if (!empresaId || !clienteId) return res.status(400).send("Debe incluir en la URL la empresa y el cliente a consultar");
    contratosDb.getContratosEmpresaClienteDepartamento(empresaId, clienteId, usuarioId, departamentoId, usaContrato, fecha,function (err, contratos) {
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
    contratosDb.putConceptoCobroLinea(req.params.contratoPorcenId,req.body.cobroPorcen, function (err, cobroPorcen) {
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
    contratosDb.deleteConceptoCobroLinea(req.params.contratoPorcenId,  function (err, conceptoPorcen) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

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




// Exports
module.exports = router;