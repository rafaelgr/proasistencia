var express = require('express');
var router = express.Router();
var partesDb = require("./partes_db_mysql");


// GetPartes
// Devuelve una lista de objetos con todos los partes de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos partes
// que lo contengan.
router.get('/', function(req, res) {
    
        partesDb.getPartes(function(err, partes) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(partes);
            }
        });
});

// GetParte
// devuelve el parte con el id pasado
router.get('/:parteId', function(req, res) {
    partesDb.getParte(req.params.parteId, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});


// GetParte
// devuelve las partes de un servicio
router.get('/servicio/:servicioId', function(req, res) {
    partesDb.getParteServicio(req.params.servicioId, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});

// getParteServicioProfesional
// devuelve las partes de un servicio y un profesional concreto
router.get('/servicio/:servicioId/:proveedorId', function(req, res) {
    partesDb.getParteServicioProfesional(req.params.servicioId, req.params.proveedorId,function(err, partes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(partes);
        }
    });
});

// GetParteEstado
// devuelve las partes con un estado determinado
router.get('/estado/parte/:estadoParteId', function(req, res) {
    partesDb.getPartesEstado(req.params.estadoParteId, function(err, partes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(partes);
        }
    });
});

// GetParteEstadoComercial
// devuelve las partes con un estado determinado de un comercial
router.get('/estado/parte/:estadoParteId/:comercialId', function(req, res) {
    partesDb.getPartesEstadoComercial(req.params.estadoParteId, req.params.comercialId, function(err, partes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(partes);
        }
    });
});

// GetServicioComercial
// Devuelve los servicios que corresponden al comercial correspondiente
router.get('/nuevo/numero/parte/:servicioId/:numServicio', function (req, res) {
    partesDb.getSiguienteNumero(req.params.servicioId, req.params.numServicio,function (err, numero) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(numero);
        }
    });
});

// PostParte
// permite dar de alta un parte
router.post('/', function(req, res) {
    partesDb.postParte(req.body.parte, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});

// PostParte
// permite dar de alta un parte
router.post('/varios/:numServicio', function(req, res) {
    partesDb.postPartes(req.body.partes, req.params.numServicio,function(err, partes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(partes);
        }
    });
});

// GetParteEstados
// devuelve las partes de varios estados 
router.post('/varios/estados/parte', function(req, res) {
    partesDb.getPartesEstados(req.body.estados, function(err, partes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(partes);
        }
    });
});



// PutParte
// modifica el parte con el id pasado
router.put('/:parteId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    partesDb.getParte(req.params.parteId, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (parte == null) {
                res.status(404).send("Parte no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                partesDb.putParte(req.params.parteId, req.body.parte, function(err, parte) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(parte);
                    }
                });
            }
        }
    });
});

// putPartesServicio
// actualiza todos los partes de un servicio
router.put('/varios/:servicioId/:ofertaId', function(req, res) {
    try{
        partesDb.putPartesServicio(req.params.servicioId, req.body.parte, req.params.ofertaId)
        .then( parte => {
            res.json(parte);
        })
        .catch( e => {next(e.message);})
    }catch(err) {
        next(err);
    }
});

// putPartes
// actualiza partes pasados con un array
router.put('/varios/partes/desde/id', function(req, res) {
    partesDb.putPartes(req.body.partes, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});

// putPartesFactura
// actualiza todos los partes de un servicio
router.put('/varios/factura', function(req, res) {
    partesDb.putPartesFactura(req.body.forpaCliParte, function(err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// putPartesFactura
// actualiza todos los partes de un servicio
router.put('/varios/prefactura/nuevo/metodo', function(req, res) {
    partesDb.putPartesPrefactura(req.body.forpaCliParte, function(err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// DeleteParte
// elimina un parte de la base de datos
router.delete('/:parteId', function(req, res) {
   
    partesDb.deleteParte(req.params.parteId, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});



//FUNCIONES DE LINEAS 

// getLineasParte
// Devuelve las lineas de un parte correspondiente
router.get('/lineas/del/parte/servicio/:parteId', function (req, res) {
    partesDb.getLineasParte(req.params.parteId, function (err, partes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(partes);
        }
    });
});

// getLineasParte
// Devuelve una linea de un parte correspondiente
router.get('/linea/del/parte/servicio/:parteId/:lineaParteId', function (req, res) {
    partesDb.getLineaParte(req.params.parteId, req.params.lineaParteId,function (err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(parte[0]);
        }
    });
});

// PostLineaParte
// permite dar de alta una linea de  parte
router.post('/linea/:parteId/:servicioId', function(req, res) {
    partesDb.postLineaParte(req.body.lineaparte, req.params.parteId,  req.params.servicioId, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});






// PutLineaParte
// modifica una linea de parte con el id pasado
router.put('/linea/:parteLineaId/:servicioId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    partesDb.getLineaParte(req.body.parteLinea.parteId, req.params.parteLineaId, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (parte == null) {
                res.status(404).send("Parte no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                partesDb.putLineaParte(req.params.parteLineaId, req.body.parteLinea,  req.params.servicioId, function(err, parte) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(parte);
                    }
                });
            }
        }
    });
});

// getRefPresupuesto
// Devuelve una referencia de presupuesto que no se encuentre en la Id del servicio pasado si existe
router.get('/busca/presupuesto/lineas/:servicioId/:refPresupuesto', function (req, res) {
    partesDb.getRefPresupuestoLineas(req.params.servicioId, req.params.refPresupuesto,function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(lineas);
        }
    });
});

// DeleteParte
// elimina una linea parte de la base de datos con el id pasado
router.delete('/linea/:lineaParteId/:parteId/:servicioId', function(req, res) {
    partesDb.deleteLineaParte(req.params.lineaParteId, req.params.parteId, req.params.servicioId, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});

// DeleteParte
// elimina una linea parte de la base de datos con el id pasado
router.delete('/lineas/oferta/:servicioId/:referencia', function(req, res) {
    var ref = req.params.referencia;
    ref = ref.replace('@', '/');
    partesDb.deleteLineasPartesOfertas(req.params.servicioId, ref, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});

// getRefPresupuesto
// Devuelve una referencia de presupuesto que no se encuentre en la Id del servicio pasado si existe
router.post('/servicio/vinculados/proveedor/:refPresupuesto/:servicioId', function (req, res) {
    partesDb.getRefPresupuesto(req.params.servicioId, req.params.refPresupuesto,  req.body.proveedores, function (err, ref) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(ref);
        }
    });
});

//LLAMADAS DE FACTURACION 

// getPartesCerradosFacturar
// Devuelve los partes cerrados de un cliente que no se hayan facturado aún
router.get('/cerrados/facturar/:deFecha/:aFecha/:clienteId/:agenteId/:empresaId', function (req, res) {
    partesDb.getPartesCerradosFacturar(req.params.deFecha, req.params.aFecha, req.params.clienteId, req.params.agenteId, req.params.empresaId, function (err, ref) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(ref);
        }
    });
});


// getPartesCerradosFacturar
// Devuelve los partes cerrados de un profesional que no se hayan facturado aún
router.get('/profesional/cerrados/facturar/:deFecha/:aFecha/:clienteId/:agenteId/:empresaId', function (req, res) {
    partesDb.getPartesProfesionalesCerradosFacturar(req.params.deFecha, req.params.aFecha, req.params.clienteId, req.params.agenteId, req.params.empresaId, function (err, ref) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(ref);
        }
    });
});

//CREACIÓN DE VARIAS LINEAS DE PARTE DESDE OFERTAS

// PostLineaParte
// permite dar de alta una linea de  parte
router.post('/lineas/:servicioId', function(req, res) {
    partesDb.postLineasParte(req.body.lineasparte,  req.params.servicioId, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});


//LISTADO EXISTENCIAS

//crea el JSON de LISTADO DE EXISTENCIAS
router.post('/facturas/listado/existencias/crea/json/:dFecha/:hFecha/:clienteId/:empresaId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var clienteId = req.params.clienteId;
    var empresaId = req.params.empresaId;
    partesDb.postCrearListadoExistencias(dFecha, hFecha, clienteId, empresaId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});


//REPORTE ACTIVIDAD

//crea el JSON del INFORME REPORTE DE ACTIVIDAD
router.post('/facturas/reporte/actividad/crea/json/:dFecha/:hFecha', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    partesDb.postCrearReporteActividadBis(dFecha, hFecha, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

//crea el JSON de LISTADO DE PAGOS DE PROFESIONALES
router.post('/facturas/listado/pagos/profesionales/crea/json/:dFecha/:hFecha/:empresaId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var empresaId = req.params.empresaId;
    partesDb.postCrearListadoPagosProfesionales(dFecha, hFecha, empresaId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

//crea el JSON de LISTADO DE PAGOS DE ACTUACIONES CERRADAS POR USUARIO
router.post('/listado/actuaciones/cerradas/por/usuario/crea/json/:dFecha/:hFecha/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var usuarioId = req.params.usuarioId;
    partesDb.postCrearListadoActuacionesUsuario(dFecha, hFecha, usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// getMarcaConta
// Devuelve la marca de contabilizado de las facturas asociadas a un parte
router.get('/comprueba/marca/conta/:parteId', function (req, res) {
    partesDb.getMarcaConta(req.params.parteId, function (err, marca) {
        if (err)  return res.status(500).send(err.message);
        res.json(marca);
    });
});

//LLAMADA DE LA APLICACIÓN MOVIL

 //getLineasParteMovil
// Devuelve las lineas de un parte correspondiente
router.get('/lineas/del/parte/servicio/movil/:parteId', function (req, res) {
    partesDb.getLineasParteMovil(req.params.parteId, function (err, partes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(partes);
        }
    });
});

// PutParte
// modifica un parte sin asignar con el id del servicio pasado
router.put('/sin/asignar/:servicioId', function(req, res) {
    partesDb.putParteSinAsignar(req.params.servicioId, req.body.parte, function(err, parte) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});


// GetPartes
// Devuelve una lista de objetos con todos los partes de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos partes
// que lo contengan.
router.get('/del/proveedor/:proveedorId/:abiertos/:fecha/:hFecha/:direccionTrabajo', function(req, res) {
    var proveedorId = req.params.proveedorId;
    var abiertos = req.params.abiertos
    var fecha = req.params.fecha;
    var hFecha = req.params.hFecha;
    var direccionTrabajo = req.params.direccionTrabajo
    partesDb.getPartesProveedor(proveedorId, abiertos, fecha, hFecha, direccionTrabajo, function(err, partes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(partes);
        }
    });
});


//ENVIO CORREO PARTE RECHAZADO
router.post('/enviar/correo/rechazo', function (req, res) {
    partesDb.crearCorreosAEnviar(req.body.datos, (err, data) => {
        if (err) return res.status(500).send(err.message);
        var msg = data;
        res.json(msg);
    })
 });

 //ENVIO CORREO PARTE RECHAZADO
router.post('/enviar/correo/aceptar/cancelar/parte/general', function (req, res) {
    partesDb.crearCorreosAEnviar(req.body.datos, (err, data) => {
        if (err) return res.status(500).send(err.message);
        var msg = data;
        res.json(msg);
    })
 });


 router.post('/enviar/correo/cierre/parte', function (req, res) {
    partesDb.crearCorreosAEnviarCerrado(req.body.datos, (err, data) => {
        if (err) return res.status(500).send(err.message);
        var msg = data;
        res.json(msg);
    })
 });


 //GUARDAR FOTOS DEL PARTE
router.post('/guarda/fotos/del/parte', function (req, res) {
    partesDb.postParteFotos(req.body.parteFotos, (err, data) => {
        if (err) return res.status(500).send(err.message);
        var msg = data;
        res.json(msg);
    })
 });

//RECUPERAR FOTOS DEL PARTE
router.get('/recupera/fotos/del/parte/:parteId', function (req, res) {
    partesDb.getParteFotos(req.params.parteId, (err, data) => {
        if (err) return res.status(500).send(err.message);
        var fotos = data;
        res.json(fotos);
    })
 });

 //GENERA A PDF Y SUBE A S3 UN PARTE
router.get('/crea/parte/movil/pdf/codigo/:servicioId/:parteId/:codigo', function (req, res) {
    var cod = req.params.codigo;
    if(cod == 'null'|| !cod) cod = process.env.CODIGO_EMPRESA_MOVIL;
    partesDb.getPdfParte(req.params.servicioId, req.params.parteId, cod,(err, data) => {
        if (err) return res.status(500).send(err.message);
        res.json(data);
    })
 });

  //GENERA A PDF Y SUBE A S3 UN PARTE
router.get('/crea/parte/movil/pdf/:servicioId/:parteId', function (req, res) {
    var cod = req.params.codigo;
    if(cod == 'null' || !cod) cod = process.env.CODIGO_EMPRESA_MOVIL;
    partesDb.getPdfParte(req.params.servicioId, req.params.parteId, cod,(err, data) => {
        if (err) return res.status(500).send(err.message);
        res.json(data);
    })
 });


  //DEVUELVE UN OBJETO JSON PARA VISULIZAR UN PARTE EN EL VIEWER DE STIMULSOFT
router.get('/genera/parte/json/:servicioId/:parteId', function (req, res) {
    partesDb.getJsonParte(req.params.servicioId, req.params.parteId, (err, data) => {
        if (err) return res.status(500).send(err.message);
        res.json(data);
    })
 });

 //DECODIFICAR FOTOS
router.post('/decodifica/datos/del/parte/b64', function (req, res) {
    partesDb.decodeData(req.body.b64, (err, data) => {
        if (err) return res.status(500).send(err.message);
        var msg = data;
        res.json(msg);
    })
 });


 //DECODIFICAR FIRMA
router.post('/decodifica/firma/del/parte/b64/jpg', function (req, res) {
    partesDb.decodeFirma(req.body.b64, (err, data) => {
        if (err) return res.status(500).send(err.message);
        var msg = data;
        res.json(msg);
    })
 });


 // GetParte

router.get('/del/proveedor/:parteId', function(req, res) {
    var parteId = req.params.parteId;
    partesDb.getParteProveedor(parteId, function(err, partes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(partes);
        }
    });
});

//MYSQL2

// PostLineaParteNew
// permite dar de alta una linea de  parte, nuevo metodo implemantado con mysql2
router.post('/linea/nuevo/:parteId/:servicioId', async(req, res, next) => {
    try{
        partesDb.postLineaParteNew(req.body.lineaparte, req.params.parteId,  req.params.servicioId)
        .then( parte => {
            res.json(parte);
        })
        .catch( e => {next(e.message);})
    }catch(err) {
        next(err);
    }
});


// PutLineaParte
// modifica una linea de parte con el id pasado
router.put('/linea/nuevo/:parteLineaId/:servicioId', async (req, res, next) => {
    try{
                // antes de modificar comprobamos que el objeto existe
    partesDb.getLineaParteNew(req.body.parteLinea.parteId, req.params.parteLineaId)
    .then( (result) => {
        if (result.length == 0) {
            res.status(404).send("Parte no encontrado");
        } else {
            // ya sabemos que existe y lo intentamos modificar.
            partesDb.putLineaParteNew(req.params.parteLineaId, req.body.parteLinea,  req.params.servicioId)
            .then( (parte) => {
                res.json(parte);
            }).catch ( (e) => { next(e.message); })
        }
    })
    .catch( (e) => { next(e.message) })
    }catch(err) {
        next(err);
    }
});

// DeleteParte
// elimina una linea parte de la base de datos con el id pasado
router.delete('/linea/nuevo/:lineaParteId/:parteId/:servicioId', async (req, res, next) => {
    try{
        partesDb.deleteLineaParteNew(req.params.lineaParteId, req.params.parteId, req.params.servicioId)
        .then( parte => {
            res.json(parte);
        })
        .catch( e => {next(e.message);})
    }catch(err) {
        next(err);
    }
});

//DOCUMENTACION

//devuelve las carpetas del departamento de reparaciones con los documentos que pertenecen a una oferta o parte  determinado
router.get('/documentacion/parte/oferta/:ofertaId/:parteId', async (req, res, next) => {
    try {
        partesDb.getParteOfertaDocumentacion(req.params.ofertaId, req.params.parteId)
        .then((docum) => {
            if (!docum) return res.status(404).send("documentación no encontrada");
            res.json(docum)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});

//devuelve todos los registros de la tabla partedocuemntacion pertenecientes a una carpeta
router.get('/documentacion/documentos/carpeta/:carpetaId', async (req, res, next) => {
    try {
        partesDb.getDocumentosCarpeta(req.params.carpetaId)
        .then((docums) => {
            //if (!docums) return res.status(404).send("documentos no encontrados");
            res.json(docums)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});

//inserta un registro en la tabla partedocumentacion
router.post('/documentacion', async (req, res, next) => {
    try {
        partesDb.postParteDocumentacion(req.body.partedocumentacion)
        .then((docum) => {
            res.json(docum)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});

//Inserta un registro en la tabla carpetas
router.post('/documentacion/carpeta', async (req, res, next) => {
    try {
        partesDb.postParteDocumentacionCarpeta(req.body.carpeta)
        .then((carpeta) => {
            res.json(carpeta)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});

//Elimina un registro en la tabla ofertaDocumentacion
router.delete('/documentacion/elimina-documento/:parteDocumentoId', async (req, res, next) => {
    try {
        partesDb.deleteParteDocumentacion(req.params.parteDocumentoId)
        .then((result) => {
            res.json(null)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});


//Elimina todos los registros de la tabla ofertaDocumentacion asociados 
//a una carpeta y el registro correspondiente en la tabla carpetas.
router.delete('/documentacion/elimina-carpeta/:carpetaId', async (req, res, next) => {
    try {
        partesDb.deleteParteCarpeta(req.params.carpetaId)
        .then((result) => {
            res.json(result)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});



// Exports
module.exports = router;