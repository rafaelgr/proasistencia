var express = require('express');
var router = express.Router();
var anticiposProveedoresDb = require("./anticiposProveedores_db_mysql");
var facturasProveedoresDb = require("../facturas_proveedores/facturasProveedores_db_mysql");

// GetPreanticipos
// Devuelve una lista de objetos con todos los preanticipos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos preanticipos
// que lo contengan.
router.get('/', function (req, res) {
    anticiposProveedoresDb.getAnticiposProveedores(function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});

router.get('/all/', function (req, res) {
    anticiposProveedoresDb.getAnticiposAll(function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});

// Getanticipo
// devuelve la anticipo con el id pasado
router.get('/:antproveId', function (req, res) {
    anticiposProveedoresDb.getAnticipoProveedor(req.params.antproveId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});


// Getanticipo
// devuelve las anticipos de un proveedor completos
router.get('/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/:proveedorId/:departamentoId', function (req, res) {
    anticiposProveedoresDb.getAnticipoProveedorId(req.params.proveedorId, req.params.departamentoId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});

// Getanticipo
// devuelve las anticipos de un proveedor incompletos
router.get('/muestra/anticipos/incompletos/no-asociados/:proveedorId/:departamentoId', function (req, res) {
    anticiposProveedoresDb.getAnticipoProveedorIdIncompleto(req.params.proveedorId, req.params.departamentoId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});

// Getanticipo
// devuelve las anticipos de un proveedor incompletos
router.get('/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/incompleto/completo/:proveedorId/:facproveId/:departamentoId', function (req, res) {
    anticiposProveedoresDb.getAnticipoProveedorTodos(req.params.proveedorId,  req.params.facproveId, req.params.departamentoId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});


router.post('/vincula/varios/', function (req, res) {
    var antProve = req.body;
    anticiposProveedoresDb.vinculaAntProves(antProve, function (err, antProve) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//borra un anticipos vinculados
router.delete('/desvincula/', function (req, res) {
    anticiposProveedoresDb.deleteFacturaAntProve(req.body.antprove, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        }  else {
            res.json(data);
        }
    });
});


router.get('/contrato/:contratoId/:esColaborador', function(req, res){
    var contratoId = req.params.contratoId;
    var esColaborador = req.params.esColaborador;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    anticiposProveedoresDb.getAnticiposContrato(contratoId, esColaborador, function(err, preanticipos){
        if (err) return res.status(500).send(err.message);
        res.json(preanticipos);
    })
});





//devuelve el tipo de cliente de un contrato
router.get('/contrato/tipo/cliente/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    anticiposProveedoresDb.getTipoCliente(contratoId, function(err, datos){
        if (err) return res.status(500).send(err.message);
        res.json(datos);
    })
});


// obtiene las anticipos entre las fechas pasadas y que no han sido contabilizadas con anterioridad.
router.get('/emision2/:dFecha/:hFecha/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId;
    anticiposProveedoresDb.getPreContaAnticipos(dFecha, hFecha,departamentoId, usuarioId, function (err, anticipos) {
        if (err) return res.status(500).send(err.message);
        res.json(anticipos);
    });
})


// PostAnticipo
// permite dar de alta una anticipo de proveedor
router.post('/', function (req, res) {
    var antprove = req.body[0].antprove;
    anticiposProveedoresDb.postAnticipo(antprove,function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipo);
        }
    });
});

// PostAnticipo
// permite dar de alta una anticipo de proveedor
router.post('/reparaciones', function (req, res) {
    var antprove = req.body.antprove;
    anticiposProveedoresDb.postAnticipo(antprove,function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipo);
        }
    });
});


// PutAnticipo
// modifica el anticipo con el id pasado
router.put('/:antproveId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    anticiposProveedoresDb.getAnticipoProveedor(req.params.antproveId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (anticipo == null) {
                return res.status(404).send("anticipo no encontrado");
            } else {
                 // ya sabemos que existe y lo intentamos modificar.
                if(req.body[0]) {
                    var antprove = req.body[0].antprove;
                } else {
                    var antprove = req.body.antprove;
                }
                anticiposProveedoresDb.putAnticipo(req.params.antproveId, antprove,function (err, anticipo2) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(anticipo);
                    }
                });
            }
        }
    });
});

// PutRecalculo
// Recalcula las líneas y totales de una anticipo de proveedores dada
// en función de los porcentajes pasados.
router.put('/recalculo/:antproveId/:coste/:porcentajeBeneficio/:porcentajeAgente/:tipoClienteId', function (req, res) {
    var antproveId = req.params.antproveId,
        coste = req.params.coste,
        porcentajeBeneficio = req.params.porcentajeBeneficio,
        porcentajeAgente = req.params.porcentajeAgente,
        tipoClienteId = req.params.tipoClienteId;
    if (!antproveId || !coste || !porcentajeBeneficio || !porcentajeAgente) {
        return res.status(400).send('Faltan parámetros para el recálculo de la anticipo');
    }
    anticiposProveedoresDb.recalculoLineasAnticipo(antproveId, coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId, function(err){
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

// DeleteAnticipo
// elimina un anticipo de la base de datos
router.delete('/:antproveId', function (req, res) {
    var antprove = req.body;
    var antprove2 = {
        facproveId: antprove.facproveId,
        antproveId: null
    }
    facturasProveedoresDb.putFacturaAntproveToNull( antprove2, function (err, anticipo2) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            anticiposProveedoresDb.deleteAnticipo(req.params.antproveId, function (err, anticipo) {
                if (err) {
                    return res.status(500).send(err.message);
                } else {
                    res.json(anticipo);
                }
            });
        }
    });
});



/* ----------------------
    LINEAS DE FACTURA de proveedores
-------------------------*/

// GetNextanticipoLine
// devuelve el anticipo con el id pasado
router.get('/nextlinea/:antproveId', function (req, res) {
    anticiposProveedoresDb.getNextAnticipoLineas(req.params.antproveId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (anticipo == null) {
                return res.status(404).send("anticipo no encontrado");
            } else {
                res.json(anticipo);
            }
        }
    });
});

// GetPreanticipoLineas
// devuelve las lineas de una anticipo con el id de la anticipo pasado
router.get('/lineas/:antproveId', function (req, res) {
    anticiposProveedoresDb.getAnticipoLineas(req.params.antproveId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("Preanticipo sin lineas");
            } else {
                res.json(lineas);
            }
        }
    });
});

// GetPreanticipoLinea
// devuelve las lineas de una anticipo con el id pasado
router.get('/linea/:antproveLineaId', function (req, res) {
    anticiposProveedoresDb.getAnticipoLinea(req.params.antproveLineaId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("No existe la linea de preanticipo solicitada");
            } else {
                res.json(lineas);
            }
        }
    });
});


// PostAnticipoLinea
// permite dar de alta un linea de anticipo proveedor
router.post('/lineas/', function (req, res) {
    anticiposProveedoresDb.postAnticipoLinea(req.body.antproveLinea, function (err, preanticipoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(preanticipoLinea);
        }
    });
});



// PutAnticipoLinea
// modifica la anticipo con el id pasado
router.put('/lineas/:antproveLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    anticiposProveedoresDb.putAnticipoLinea(req.params.antproveLineaId, req.body.antproveLinea, function (err, antproveLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (antproveLinea == null) {
                return res.status(404).send("Linea de anticipo no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                anticiposProveedoresDb.putAnticipoLinea(req.params.antproveLineaId, req.body.antproveLinea, function (err, antproveLinea) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(antproveLinea);
                    }
                });
            }
        }
    });
});

// DeleteAnticipoLinea
// elimina un anticipo de proveedor de la base de datos
router.delete('/lineas/:antproveLineaId', function (req, res) {
    var antproveLinea = req.body.antproveLinea;
    anticiposProveedoresDb.deleteAnticipoLinea(req.params.antproveLineaId, antproveLinea, function (err, antproveLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// GetAnticipoBases
// devuelve la anticipo con el id pasado
router.get('/bases/:antproveId', function (req, res) {
    anticiposProveedoresDb.getAnticipoBases(req.params.antproveId, function (err, bases) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (bases == null) {
                return res.status(404).send("Anticipo sin bases");
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
//devuelve todas las empresas serviciadas asociadas a una anticipo
router.get('/servicidas/anticipos/proveedor/todas/:antproveId', function (req, res) {
    anticiposProveedoresDb.getserviciadasAnticipo(req.params.antproveId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

router.get('/servicidas/anticipos/proveedor/una/para/editar/:antproveId', function (req, res) {
    anticiposProveedoresDb.getserviciadaAnticipo(req.params.antproveId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});




//postServiciada
//permite dar de alta una empresa serviciada asociada a una anticipo
router.post('/nueva/serviciada', function (req, res) {
    var serviciada = req.body.antproveServiciada;
    anticiposProveedoresDb.postServiciada(serviciada, function (err, serviciada) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(serviciada);
        }
    });
});

//putserviciada
//modifica una empresa serviciada con su id pasado
router.put('/serviciada/edita/:antproveserviciadoId', function (req, res) {
    anticiposProveedoresDb.putServiciada(req.params.antproveserviciadoId, req.body.antproveServiciada, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(data);
        }
    });
});

//deleteServiciadas
//permite borrar una empresa serviciada de una anticipo
router.delete('/serviciada/anticipo/proveedor/:antproveServiciadaId', function(req, res){
    var antproveServiciadaId = req.params.antproveServiciadaId;
    if (!antproveServiciadaId) return res.status(400).send("Falta la referencia a la EMPRESA SERVICIADA en la URL de la solicitud");
    anticiposProveedoresDb.deleteServiciadas(antproveServiciadaId, function(err){
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});

//----- CONTABILIZACION ---------------------------
// PostContabilizarAnticipos
router.post('/contabilizar/:dFecha/:hFecha/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId;
    anticiposProveedoresDb.postContabilizarAnticipos(dFecha, hFecha,  departamentoId, usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});


//-----VISADAS--------------------
//devuelve todas las anticipos de proveedores sin visar
router.get('/visadas/anticipos-proveedor/todas/:visada', function (req, res) {
    anticiposProveedoresDb.getVisadasAnticipo(req.params.visada, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// PutAnticipo
// modifica al campo visada de la antprove con el id pasado
router.put('/visadas/modificar/:antproveId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    anticiposProveedoresDb.getAnticipoProveedor(req.params.antproveId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (anticipo == null) {
                return res.status(404).send("anticipo no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                var antprove = req.body[0].antprove;
                
                anticiposProveedoresDb.putAnticipoVisada(req.params.antproveId, antprove, function (err, anticipo) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(anticipo);
                    }
                });
            }
        }
    });
});

//recuperamos los datos para el informe de anticipos y sus contratos asociados
router.get('/visadas/anticipos-proveedor/informe/detalle:visada', function (req, res) {
    anticiposProveedoresDb.getInformesAnticipo(req.params.visada, function (err, result) {
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

// GetPreanticipoLineas
// devuelve el preanticipo con el id pasado
router.get('/retenciones/:antproveId', function (req, res) {
    anticiposProveedoresDb.getAnticipoRetenciones(req.params.antproveId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("Preanticipo sin retenciones");
            } else {
                res.json(lineas);
            }
        }
    });
});

//GetTiposRetencion
//devuelve los tipos de retención 0 1 y 3 de la tabla usuarios.wtiposreten
router.get('/retenciones/tiposreten/antprove', function (req, res) {
    anticiposProveedoresDb.getTiposRetencion(function (err, tipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipos == null) {
                return res.status(404).send("Preanticipo sin retenciones");
            } else {
                res.json(tipos);
            }
        }
    });
});


//GetTipoRetencion
//devuelve un tipo de retención de la tabla usuarios.wtiposreten con el codigo pasado
router.get('/retenciones/tiposreten/antprove/:codigo', function (req, res) {
    var codigo = req.params.codigo;
    anticiposProveedoresDb.getTipoRetencion(codigo, function (err, tipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipos == null) {
                return res.status(404).send("Preanticipo sin retenciones");
            } else {
                res.json(tipos);
            }
        }
    });
});



//LLAMADAS  POR DEPARTAMENTO DE USUARIO

// getFacturasProveedoresUsuario
// Devuelve las facturas de proveedores que pertenezcan a los departamentos
//que el usuario tenga asignados
router.get('/usuario/logado/departamento/:usuarioId/:departamentoId/:esColaborador', function (req, res) {
    anticiposProveedoresDb.getAnticiposProveedoresUsuario(req.params.usuarioId, req.params.departamentoId, req.params.esColaborador, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

router.get('/usuario/logado/departamento/all/:usuarioId/:departamentoId/:esColaborador', function (req, res) {
    anticiposProveedoresDb.getAnticiposAllUsuario(req.params.usuarioId, req.params.departamentoId,  req.params.esColaborador, function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});

//devuelve todas las anticipos de proveedores sin visar
router.get('/visadas/anticipos-proveedor/todas/usuario/logado/departamento/:visada/:usuarioId/:departamentoId', function (req, res) {
    anticiposProveedoresDb.getVisadasAnticipoUsuario(req.params.visada, req.params.usuarioId, req.params.departamentoId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});



// BorrarAntproveDesdeParte
router.delete('/borrar/desde/parte/:numeroAnticipoProveedor/:proveedorId', function (req, res) {
    anticiposProveedoresDb.BorrarAntproveDesdeParte(req.params.numeroAnticipoProveedor, req.params.proveedorId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
                res.json(null);
        }
    });
});

router.get('/proveedor/recupera/todos/:proveedorId', function (req, res) {
    anticiposProveedoresDb.getAnticiposProveedor(req.params.proveedorId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

//ANTICIPOS DEL SERVICIO

router.get('/proveedor/recupera/todos/servicio/:servicioId', function (req, res) {
    anticiposProveedoresDb.getAnticiposProveedorServicio(req.params.servicioId, function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});


//nuevas llamadas sistema nuevo anticipos

// getFacturasProveedoresUsuario
// Devuelve las facturas de proveedores que pertenezcan a los departamentos
//que el usuario tenga asignados
router.get('/usuario/logado/departamento/nueva/:usuarioId/:departamentoId/:esColaborador', function (req, res) {
    anticiposProveedoresDb.getAnticiposProveedoresUsuarioNueva(req.params.usuarioId, req.params.departamentoId, req.params.esColaborador, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

router.get('/usuario/logado/departamento/all/nueva/:usuarioId/:departamentoId/:esColaborador', function (req, res) {
    anticiposProveedoresDb.getAnticiposAllUsuarioNueva(req.params.usuarioId, req.params.departamentoId,  req.params.esColaborador, function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});

// Getanticipo
// devuelve las anticipos de un proveedor completos
router.get('/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/:proveedorId', function (req, res) {
    anticiposProveedoresDb.getAnticipoProveedorId2(req.params.proveedorId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});


// Exports
module.exports = router;