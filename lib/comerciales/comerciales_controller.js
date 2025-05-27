var express = require('express');
var router = express.Router();
var comercialesDb = require("./comerciales_db_mysql");

// GetComerciales
// Devuelve una lista de objetos con todos los comerciales de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos comerciales
// que lo contengan.
router.get('/', function (req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        comercialesDb.getComercialesBuscar(nombre, function (err, comerciales) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(comerciales);
            }
        });

    } else {
        comercialesDb.getComerciales(function (err, comerciales) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(comerciales);
            }
        });
    }
});

router.get('/comerciales_activos', function(req, res){
    var nombreABuscar = req.query.nombre;
    comercialesDb.getComercialesEnActivo(nombreABuscar, function(err, comerciales){
        if (err) return res.status(500).send(err.message);
        res.json(comerciales);
    });
});

router.get('/comerciales_activos/:tipoComercialId', function(req, res){
    var nombreABuscar = req.query.nombre;
    let tipo = req.params.tipoComercialId;
    comercialesDb.getComercialesEnActivoTipo(tipo, nombreABuscar, function(err, comerciales){
        if (err) return res.status(500).send(err.message);
        res.json(comerciales);
    });
});

router.get('/agentes_activos', function(req, res){
    var nombreABuscar = req.query.nombre;
    comercialesDb.getAgentesEnActivo(nombreABuscar, function(err, agentes){
        if (err) return res.status(500).send(err.message);
        res.json(agentes);
    });
});

router.get('/activos', function (req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        comercialesDb.getComercialesActivosBuscar(nombre, function (err, comerciales) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(comerciales);
            }
        });

    } else {
        comercialesDb.getComercialesActivos(function (err, comerciales) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(comerciales);
            }
        });
    }
});

// getAgentes
router.get('/agentes', function (req, res) {
    comercialesDb.getAgentes(function (err, comerciales) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(comerciales);
        }
    });
});

router.get('/agentes/activos', function (req, res) {
    comercialesDb.getAgentesActivos(function (err, comerciales) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(comerciales);
        }
    });
});

router.get('/colaboradores', function (req, res) {
    comercialesDb.getColaboradores(function (err, comerciales) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(comerciales);
        }
    });
});

router.get('/colaboradores/activos', function (req, res) {
    comercialesDb.getColaboradoresActivos(function (err, comerciales) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(comerciales);
        }
    });
});

// GetComercial
// devuelve el comercial con el id pasado
router.get('/:comercialId', function (req, res) {
    comercialesDb.getComercial(req.params.comercialId, function (err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (comercial == null) {
                return res.status(404).send("Agente / Colaborador no encontrado");
            } else {
                res.json(comercial);
            }
        }
    });
});

// GetComercialCliente
// devuelve el comercial de un cliente
router.get('/agente/cliente/:clienteId', function (req, res) {
    comercialesDb.getComercialCliente(req.params.clienteId, function (err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (comercial == null) {
                return res.status(404).send("Agente / Colaborador no encontrado");
            } else {
                res.json(comercial);
            }
        }
    });
});

// GetComercialByCodigo
// devuelve el comercial con el id pasado
router.get('/codigo/:codigo', function (req, res) {
    comercialesDb.getComercialByCodigo(req.params.codigo, function (err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (comercial == null) {
                return res.status(404).send("Agente / Colaborador no encontrado");
            } else {
                res.json(comercial);
            }
        }
    });
});

// GetComision
// obtiene la comisión que corresponde en los parámetros pasados
router.get('/comision/:comercialId/:clienteId/:empresaId/:tipoMantenimientoId', function (req, res) {
    comercialesDb.buscarComision(req.params.comercialId,
        req.params.clienteId,
        req.params.empresaId,
        req.params.tipoMantenimientoId,
        function (err, comision) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(comision);
            }
        });
});

// GetComision
// obtiene la comisión que corresponde en los parámetros pasados
router.get('/comision/:comercialId/:empresaId/:tipoMantenimientoId', function (req, res) {
    comercialesDb.buscarComision2(req.params.comercialId,
        req.params.empresaId,
        req.params.tipoMantenimientoId,
        function (err, comision) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(comision);
            }
    });
});

// GetComision
// obtiene la comisión que corresponde en los parámetros pasados
router.get('/comisiones/varias/:comercialId/:empresaId/:tipoMantenimientoId', function (req, res) {
    comercialesDb.buscarComisiones(req.params.comercialId,
        req.params.empresaId,
        req.params.tipoMantenimientoId,
        function (err, comision) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(comision);
            }
        });
});

router.get('/solo/beneficio', function(req, res){
    comercialesDb.getComercialesBeneficio(function(err, comerciales){
        if (err) return res.status(500).send(err.message);
        res.json(comerciales);
    });
});

router.get('/colaboradores/activos/por/tipo/:tipoComercialId', function (req, res) {
    comercialesDb.getColaboradoresActivosPorTipo(req.params.tipoComercialId, function (err, comerciales) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(comerciales);
        }
    });
});

// PostComercial
// permite dar de alta un comercial
router.post('/', function (req, res) {
    comercialesDb.postComercial(req.body.comercial, function (err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(comercial);
        }
    });
});

// PostLogin
// Login de un comercial en la aplicación
router.post('/login', function (req, res) {
    comercialesDb.loginColaborabor(req.body.login, req.body.password, function (err, comercial) {
        if (err) {
            if (err.message == 'No autorizado') return res.status(401).send(err.message);
            return res.status(500).send(err.message);
        } else {
            res.json(comercial);
        }
    });
});



// PutComercial
// modifica el comercial con el id pasado
router.put('/:comercialId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    comercialesDb.getComercial(req.params.comercialId, function (err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (comercial == null) {
                return res.status(404).send("Comercial no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                comercialesDb.putComercial(req.params.comercialId, req.body.comercial, function (err, comercial) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(comercial);
                    }
                });
            }
        }
    });
});

// DeleteComercial
// elimina un comercial de la base de datos
router.delete('/:comercialId', function (req, res) {
    var comercial = req.body.comercial;
    comercialesDb.deleteComercial(req.params.comercialId, comercial, function (err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//FUNCIONES RELACIONADAS  CON LA TABLA AGENTES_COLABORADORES

//getAgentesColaboradores
router.get('/historial/agentes/:agenteId', function (req, res) {
    comercialesDb.getAgentesColaboradores(req.params.agenteId, function (err, agenteColaborador) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (agenteColaborador == null) {
                return res.status(404).send("agenteColaborador no encontrado");
            } else {
                res.json(agenteColaborador);
            }
        }
    });
});

// PostCambiaAgente
// guarda agente en la tabla clientes_agentes
router.post('/agente', function (req, res) {
    comercialesDb.postCambiaColaborador(req.body.AgenteColaborador, function (err, agenteColaborador) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(agenteColaborador);
        }
    });
});

//DeleteagenteColaborador
//elimina un agenteColaborador de la base de datos
router.delete('/agenteColaborador/:agenteColaboradorId', function (req, res) {
    comercialesDb.getAgenteColaboradorUnico(req.params.agenteColaboradorId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            comercialesDb.deleteAgenteColaborador(req.params.agenteColaboradorId, function (err, resultado) {
                if (err) {
                    return res.status(500).send(err.message);
                } else {
                    res.json(result);
                }
            });
        }
    });
    
});

router.post('/recupera/comercial/activo/campo', function(req, res) {
    var valor = req.body.valor;
    var key = Object.keys(valor);
    key = key[0];
    comercialesDb.getComercialPorCampo(valor, key, function(err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } 
        res.json(comercial);
    });
});

// putComercialLogin
// modifica el usuario y contraseña del cliente en laweb de clientes/egentes
router.put('/restablece/loginPass/:comercialId', function (req, res) {
    comercialesDb.putComercialLogin(req.params.comercialId, req.body.comercial, function (err, comercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(comercial);
        }
    });

});

//busca comerciales con liquidaciomnes en el periodo
//getAgentesColaboradoresConLiquidacion
router.get('/envio/liquidacion/:dFecha/:hFecha/:comercialId/:tipoComercialId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var comercialId = req.params.comercialId;
    var tipoComercialId = req.params.tipoComercialId;
    comercialesDb.getAgentesColaboradoresConLiquidacion(dFecha, hFecha, comercialId, tipoComercialId, function (err, agenteColaborador) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (agenteColaborador == null) {
                return res.status(404).send("agenteColaborador no encontrado");
            } else {
                res.json(agenteColaborador);
            }
        }
    });
});

router.get('/colaboradores/por/tipo/:tipoComercialId', function (req, res) {
    comercialesDb.getColaboradoresPorTipo(req.params.tipoComercialId, function (err, comerciales) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(comerciales);
        }
    });
});

router.post('/colaboradores/por/tipos/', function (req, res) {
    comercialesDb.getColaboradoresPorTipos(req.body.tiposComercialesId, function (err, comerciales) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(comerciales);
        }
    });
});

//busqueda de limite del anticipo por colaborador
router.get('/limite/anticipo/:proveedorId/:empresaServiciadaId/:contratoId/:comercialId', async (req, res, next) => {
    try  {
        let result =  await comercialesDb.getLimiteAnticipo(req.params.proveedorId, req.params.empresaServiciadaId, req.params.contratoId,  req.params.comercialId);
        res.json(result);
    }catch(err) {
        next(res.status(500).send(err.message))
    }
});



//  tab correos comercial

//busqueda de los correos de un comercial
router.get('/obten/correos/empresa/:comercialId', async (req, res, next) => {
    try  {
        let result =  await comercialesDb.getCorreosComercial(req.params.comercialId);
        res.json(result);
    }catch(err) {
        next(res.status(500).send(err.message))
    }
});


//busqueda de los correos de un comercial
router.get('/obten/un-correo/empresa/:comercialCorreoId', async (req, res, next) => {
    try  {
        let result =  await comercialesDb.getCorreoComercial(req.params.comercialCorreoId);
        res.json(result);
    }catch(err) {
        next(res.status(500).send(err.message))
    }
});

//busqueda de los correos de un comercial
router.post('/lineas/nuevo-correo/', async (req, res, next) => {
    try  {
        let result =  await comercialesDb.postCorreosComercial(req.body.comercialCorreo);
        res.json(result);
    }catch(err) {
        next(res.status(500).send(err.message))
    }
});


//busqueda de los correos de un comercial
router.put('/lineas/edita-correo/', async (req, res, next) => {
    try  {
        let result =  await comercialesDb.putCorreoComercial(req.body.comercialCorreo);
        res.json(result);
    }catch(err) {
        next(res.status(500).send(err.message))
    }
});

//busqueda de los correos de un comercial
router.delete('/lineas/delete-correo/:comercialCorreoId', async (req, res, next) => {
    try  {
        let result =  await comercialesDb.deleteCorreoComercial(req.params.comercialCorreoId);
        res.json(result);
    }catch(err) {
        next(res.status(500).send(err.message))
    }
});




     
// Exports
module.exports = router;