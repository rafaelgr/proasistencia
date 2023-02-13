var express = require('express'),
    router = express.Router(),
    ofertasDb = require('./ofertas_db_mysql');
    

router.get('/', function (req, res) {
    ofertasDb.getOfertas(function (err, ofertas) {
        if (err) return res.status(500).send(err.message);
        res.json(ofertas);
    })
});

router.get('/no-aceptadas', function (req, res) {
    ofertasDb.getOfertasNoAceptadas(function (err, ofertas) {
        if (err) return res.status(500).send(err.message);
        res.json(ofertas);
    })
});

router.get('/no-aceptadas/cliente/:clienteId', function (req, res) {
    ofertasDb.getOfertasNoAceptadasClienteReparaciones(req.params.clienteId, function (err, ofertas) {
        if (err) return res.status(500).send(err.message);
        res.json(ofertas);
    })
})

router.get('/:ofertaId', function (req, res) {
    var ofertaId = req.params.ofertaId;
    if (!ofertaId) return res.status(400).send('Debe especificar el código de la oferta que desea consultar');
    ofertasDb.getOferta(ofertaId, function (err, ofertas) {
        if (err) return res.status(500).send(err.message);
        if (ofertas.length == 0) return res.status(404).send('Oferta no encontrada');
        var oferta = ofertas[0];
        res.json(oferta);
    })
});

router.get('/siguiente_referencia/:abrv/:arquitectura', function(req, res){
    var abrv = req.params.abrv;
    var arquitectura = req.params.arquitectura;
    if (!abrv) return res.status(400).send('Debe especificar el comienzo de la referencia');
    ofertasDb.getSiguienteReferencia(abrv, arquitectura, function(err, nuevaReferencia){
        if (err) return res.status(500).send(err.message);
        res.json(nuevaReferencia);
    });
});

router.get('/siguiente_referencia/reparaciones/:empresaId/:comision/:ano', function(req, res){
    var empresaId = req.params.empresaId;
    var comision = req.params.comision;
    var ano = req.params.ano;
    if (!empresaId && !comision && !ano) return res.status(400).send('Faltan parametros necesarios');
    ofertasDb.getSiguienteReferenciaReparaciones(empresaId, comision, ano, function(err, nuevaReferencia){
        if (err) return res.status(500).send(err.message);
        res.json(nuevaReferencia);
    });
});

router.post('/', function (req, res) {
    var oferta = req.body.oferta;
    if (!oferta) return res.status(400).send('Debe incluir la oferta a dar de alta en el cuerpo del mensaje');
    ofertasDb.postOferta(oferta, function (err, oferta) {
        if (err) return res.status(500).send(err.message);
        res.json(oferta);
    });
});

router.put('/:ofertaId', function (req, res) {
    var oferta = req.body.oferta;
    if (!oferta) return res.status(400).send('Debe incluir la oferta a modificar en el cuerpo del mensaje');
    ofertasDb.putOferta(oferta, function (err, oferta) {
        if (err) return res.status(500).send(err.message);
        res.json(oferta);
    });
});

router.delete('/:ofertaId', function (req, res) {
    var ofertaId = req.params.ofertaId;
    if (!ofertaId) return res.status(400).send('Debe indicar el identificador de la oferta a eliminar');
    var oferta = {
        ofertaId: ofertaId
    };
    ofertasDb.deleteOferta(oferta, function (err, oferta) {
        if (err) return res.status(500).send(err.message);
        res.json(oferta);
    });
});

router.put('/recalculo/:ofertaId/:coste/:porcentajeBeneficio/:porcentajeAgente', function (req, res) {
    var ofertaId = req.params.ofertaId,
        coste = req.params.coste,
        porcentajeBeneficio = req.params.porcentajeBeneficio,
        porcentajeAgente = req.params.porcentajeAgente;
    if (!ofertaId || !coste || !porcentajeBeneficio || !porcentajeAgente) {
        return res.status(400).send('Faltan parámetros para el recálculo de la oferta');
    }
    ofertasDb.recalculoLineasOferta(ofertaId, coste, porcentajeBeneficio, porcentajeAgente, function (err) {
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

/* ----------------------
    LINEAS DE OFERTA
-------------------------*/

// GetNextOfertaLine
// devuelve el oferta con el id pasado
router.get('/nextlinea/:ofertaId', function (req, res) {
    ofertasDb.getNextOfertaLineas(req.params.ofertaId, function (err, oferta) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (oferta == null) {
                return res.status(404).send("Oferta no encontrado");
            } else {
                res.json(oferta);
            }
        }
    });
});

// GetOfertaLineas
// devuelve el oferta con el id pasado
router.get('/lineas/:ofertaId/:desdeparte/:proveedorId', function (req, res) {
    ofertasDb.getOfertaLineas(req.params.ofertaId, req.params.desdeparte, req.params.proveedorId,function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("Oferta sin lineas");
            } else {
                res.json(lineas);
            }
        }
    });
});

// GetOfertaLinea
// devuelve el oferta con el id pasado
router.get('/linea/:ofertaLineaId', function (req, res) {
    ofertasDb.getOfertaLinea(req.params.ofertaLineaId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("No existe la linea de oferta solicitada");
            } else {
                res.json(lineas);
            }
        }
    });
});


// PostOfertaLinea
// permite dar de alta un linea de oferta
router.post('/lineas/', function (req, res) {
    ofertasDb.postOfertaLinea(req.body.ofertaLinea, function (err, ofertaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(ofertaLinea);
        }
    });
});

router.post('/generar-contrato/:ofertaId', function (req, res) {
    var ofertaId = req.params.ofertaId;
    var datosAceptacion = req.body;
    if (!ofertaId || !datosAceptacion) return res.status(400).send('Se precisa un identificador de oferta y unos datos de aceptación.');
    ofertasDb.generarContratoDesdeOferta(ofertaId, datosAceptacion, function (err, nuevoContrato) {
        if (err) return res.status(500).send(err.message);
        res.json(nuevoContrato);
    });
});


// PutOfertaLinea
// modifica el oferta con el id pasado
router.put('/lineas/:ofertaLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    ofertasDb.getOfertaLinea(req.params.ofertaLineaId, function (err, ofertaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (ofertaLinea == null) {
                return res.status(404).send("Linea de oferta no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                ofertasDb.putOfertaLinea(req.params.ofertaLineaId, req.body.ofertaLinea, function (err, ofertaLinea) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(ofertaLinea);
                    }
                });
            }
        }
    });
});

// DeleteOfertaLinea
// elimina un oferta de la base de datos
router.delete('/lineas/:ofertaLineaId', function (req, res) {
    var ofertaLinea = req.body.ofertaLinea;
    ofertasDb.deleteOfertaLinea(req.params.ofertaLineaId, ofertaLinea, function (err, ofertaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// GetOfertaBases
// devuelve el oferta con el id pasado
router.get('/bases/:ofertaId', function (req, res) {
    ofertasDb.getOfertaBases(req.params.ofertaId, function (err, bases) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (bases == null) {
                return res.status(404).send("Oferta sin bases");
            } else {
                res.json(bases);
            }
        }
    });
});

//CARGA OFERTAS DE DEPARTAMENTOS DE USUARIO

// getOfertasUsuario
// Devuelve una lista de objetos con todos las ofertas de la 
// base de datos que tengan un contrato asociado con departamento asignado al usuario logado.
router.get('/usuario/logado/departamento/:usuarioId/:departamentoId', function (req, res) {
    ofertasDb.getOfertasUsuario(req.params.usuarioId, req.params.departamentoId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

// getOfertasUsuarioComercial
// Devuelve una lista de objetos con todos las ofertas de la 
// base de datos, si se le pasa un departamento y un comercial filtra por esos parámetros
router.get('/usuario/logado/departamento/:usuarioId/:departamentoId/:comercialId', async (req, res, next) => {
    try{
        ofertasDb.getOfertasUsuarioComercial(req.params.usuarioId, req.params.departamentoId, req.params.comercialId)
        .then( (ofertas) => {
            res.json(ofertas);
        })
        .catch( (err) => next(err));	
    } catch(e) {
        next(e);
    }
});


router.get('/no-aceptadas/usuario/logado/departamento/:usuarioId/:departamentoId', function (req, res) {
    ofertasDb.getOfertasNoAceptadasDepartamentos(req.params.usuarioId, req.params.departamentoId, function (err, ofertas) {
        if (err) return res.status(500).send(err.message);
        res.json(ofertas);
    })
});

router.get('/no-aceptadas/usuario/logado/departamento/:usuarioId/:departamentoId/:comercialId', async (req, res, next) => {
    try {
        ofertasDb.getOfertasNoAceptadasDepartamentosComercial(req.params.usuarioId, req.params.departamentoId, req.params.comercialId)
        .then( (ofertas) => {
            res.json(ofertas);
        })
        .catch( (err) => {
            next(err);
        });

    } catch(e) {
        next(e);
    }
    
})

//CONCEPTOS PORCENTAJES

// GetLineasConceptoCobro
// devuelve las lineas de una forma de pago
router.get('/conceptos/porcentaje/:ofertaId', function (req, res) {
    ofertasDb.getConceptoCobroLineas(req.params.ofertaId, function (err, conceptos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(conceptos);
        }
    });
});

// GetLineaConceptoCobro
// devuelve una linea de la tabla formaspago_porcentajes
router.get('/concepto/porcenteje/registro/:ofertaPorcenId', function (req, res) {
    ofertasDb.getConceptoCobroLinea(req.params.ofertaPorcenId, function (err, concepto) {
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
    ofertasDb.postConceptoCobroLineas(req.body.cobroPorcen, function (err, cobroPorcen) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cobroPorcen);
        }
    });
});

// PutConceptoCobro
// modifica el ConceptoCobro con el id pasado
router.put('/concepto/:ofertaPorcenId', function (req, res) {
    ofertasDb.putConceptoCobroLinea(req.params.ofertaPorcenId,req.body.cobroPorcen, function (err, cobroPorcen) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cobroPorcen);
        }
    });
});

// DeletetarifaClienteLinea
// elimina un tarifaCliente de la base de datos
router.delete('/concepto/:ofertaPorcenId', function (req, res) {
    ofertasDb.deleteConceptoCobroLinea(req.params.ofertaPorcenId,  function (err, conceptoPorcen) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});


router.post('/generar-lineas/concepto', function (req, res) {
    var datosAceptacion = req.body;
    if (!datosAceptacion) return res.status(400).send('Se precisa un identificador de oferta');
    ofertasDb.generarLineasConceptoDesdeOferta(datosAceptacion, function (err, lineasConcepto) {
        if (err) return res.status(500).send(err.message);
        res.json(lineasConcepto);
    });
});


/* TOTALES DE PROVEEDORES DE LA OFERTA */

// getProveedoresTotales
// devuelve los totales de los proveedores de una oferta
router.get('/proveedores/lineas/totales/:ofertaId', function (req, res) {
    ofertasDb.getProveedoresTotales(req.params.ofertaId, function (err, totales) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(totales);
        }
    });
});

//DOCUMENTACION DE LA OFERTA

router.get('/documentacion/:ofertaId', async (req, res, next) => {
    try {
        ofertasDb.getOfertaDocumentacion(req.params.ofertaId)
        .then((docum) => {
            if (!docum) return res.status(404).send("documentación no encontrada");
            res.json(docum)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});

router.get('/documentacion/docuento/:ofertaDocumentoId', async (req, res, next) => {
    try {
        ofertasDb.getOfertaDocumento(req.params.ofertaDocumentoId)
        .then((docum) => {
            if (!docum) return res.status(404).send("documento no encontrado");
            res.json(docum)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});



router.post('/documentacion', async (req, res, next) => {
    try {
        ofertasDb.postOfertaDocumentacion(req.body.ofertaDocumentacion)
        .then((docum) => {
            res.json(docum)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});

router.post('/documentacion/carpeta', async (req, res, next) => {
    try {
        ofertasDb.postOfertaDocumentacionCarpeta(req.body.carpeta)
        .then((carpeta) => {
            res.json(carpeta)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});

router.delete('/documentacion/elimina-documento/:ofertaDocumentoId', async (req, res, next) => {
    try {
        ofertasDb.deleteOfertaDocumentacion(req.params.ofertaDocumentoId)
        .then((result) => {
            res.json(null)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
})


// Exports
module.exports = router;