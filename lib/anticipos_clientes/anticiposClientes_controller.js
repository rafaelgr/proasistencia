var express = require('express');
var router = express.Router();
var anticiposClientesDb = require("./anticiposClientes_db_mysql");
var facturasClientesDb = require("../facturas/facturas_db_mysql");

// GetPreanticipos
// Devuelve una lista de objetos con todos los preanticipos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos preanticipos
// que lo contengan.
router.get('/', function (req, res) {
    anticiposClientesDb.getAnticiposClientes(function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});

router.get('/all/', function (req, res) {
    anticiposClientesDb.getAnticiposAll(function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});

// Getanticipo
// devuelve la anticipo con el id pasado
router.get('/:antClienId', function (req, res) {
    anticiposClientesDb.getAnticipoCliente(req.params.antClienId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});


// Getanticipo
// devuelve las anticipos de un cliente y contrato que están vinculados a una factura
router.get('/cliente/anticipos/solapa/muestra/tabla/datos/anticipo/:clienteId/:contratoId/:facturaId', function (req, res) {
    anticiposClientesDb.getAnticipoClienteId(req.params.clienteId,  req.params.contratoId, req.params.facturaId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});

// Getanticipo
// devuelve las anticipos de un cliente y contrato que están vinculados a una factura
router.get('/cliente/anticipos/solapa/muestra/tabla/datos/anticipo/no/vinculados/:clienteId/:contratoId', function (req, res) {
    var contratoId = req.params.contratoId;
    if(contratoId == "null") contratoId = null;
    anticiposClientesDb.getAnticipoClienteIdNoVinculados(req.params.clienteId, contratoId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});


router.get('/contrato/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    anticiposClientesDb.getAnticiposContrato(contratoId, function(err, preanticipos){
        if (err) return res.status(500).send(err.message);
        res.json(preanticipos);
    })
});





//devuelve el tipo de cliente de un contrato
router.get('/contrato/tipo/cliente/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    anticiposClientesDb.getTipoCliente(contratoId, function(err, datos){
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
    anticiposClientesDb.getPreContaAnticipos(dFecha, hFecha,departamentoId, usuarioId, function (err, anticipos) {
        if (err) return res.status(500).send(err.message);
        res.json(anticipos);
    });
})


// PostAnticipo
// permite dar de alta una anticipo de proveedor
router.post('/', function (req, res) {
    var antClien = req.body.antClien;
    anticiposClientesDb.postAnticipo(antClien,function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipo);
        }
    });
});



// PutAnticipo
// modifica el preanticipo con el id pasado
router.put('/:antClienId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    anticiposClientesDb.getAnticipoCliente(req.params.antClienId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (anticipo == null) {
                return res.status(404).send("anticipo no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                anticiposClientesDb.putAnticipo(req.params.antClienId, req.body.antClien,function (err, anticipo2) {
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



//Actuliza la referncia cunado se cambie de empresa
router.post('/nueva/ref/cambio/empresa', function (req, res) {
    var antClien = req.body.antClien;
    anticiposClientesDb.getNuevaRef(antClien, function (err, antClien) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(antClien);
        }
    });
});

// DeleteAnticipo
// elimina un anticipo de la base de datos
router.delete('/:antClienId', function (req, res) {
    //borramos primero el anticipo de la tabla factura_antcliens
    anticiposClientesDb.deleteFacturaAntCliens(req.params.antClienId, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            anticiposClientesDb.deleteAnticipo(req.params.antClienId, function (err, anticipo) {
                if (err) {
                    return res.status(500).send(err.message);
                } else {
                    if(data) {
                        anticiposClientesDb.actualizaVinculada(data, function(err, result) {
                            if(err)  return res.status(500).send(err.message);
                            res.json(result);
                        });
                    } else {
                        res.json(anticipo);
                    }
                }
            });
        }
    });
});





//----- CONTABILIZACION ---------------------------
// PostContabilizarAnticipos
router.post('/contabilizar/:dFecha/:hFecha/:departamentoId/:usuarioId', function (req, res) {
    var dFecha = req.params.dFecha;
    var hFecha = req.params.hFecha;
    var departamentoId = req.params.departamentoId;
    var usuarioId = req.params.usuarioId;
    anticiposClientesDb.postContabilizarAnticipos(dFecha, hFecha,  departamentoId, usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});


//-----VISADAS--------------------
//devuelve todas las anticipos de proveedores sin visar
router.get('/visadas/anticipos-proveedor/todas/:visada', function (req, res) {
    anticiposClientesDb.getVisadasAnticipo(req.params.visada, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// PutAnticipo
// modifica al campo visada de la antClien con el id pasado
router.put('/visadas/modificar/:antClienId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    anticiposClientesDb.getAnticipoCliente(req.params.antClienId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (anticipo == null) {
                return res.status(404).send("anticipo no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                var antClien = req.body[0].antClien;
                
                anticiposClientesDb.putAnticipoVisada(req.params.antClienId, antClien, function (err, anticipo) {
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
    anticiposClientesDb.getInformesAnticipo(req.params.visada, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});




//LLAMADAS  POR DEPARTAMENTO DE USUARIO

// getAnticiposClientesUsuario
// Devuelve los anticipos que pertenezcan a los departamentos
//que el usuario tenga asignados
router.get('/usuario/logado/departamento/:usuarioId/:departamentoId', function (req, res) {
    anticiposClientesDb.getAnticiposClientesUsuario(req.params.usuarioId, req.params.departamentoId, function (err, antCliens) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(antCliens);
        }
    });
});

router.get('/usuario/logado/departamento/all/:usuarioId/:departamentoId', function (req, res) {
    anticiposClientesDb.getAnticiposAllUsuario(req.params.usuarioId, req.params.departamentoId, function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});

//devuelve todas las anticipos de proveedores sin visar
router.get('/visadas/anticipos-proveedor/todas/usuario/logado/departamento/:visada/:usuarioId/:departamentoId', function (req, res) {
    anticiposClientesDb.getVisadasAnticipoUsuario(req.params.visada, req.params.usuarioId, req.params.departamentoId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

//devuelve si un anticipo tiene una facturas asociada
router.get('/factura/asociada/:antClienId', function (req, res) {
    anticiposClientesDb.getFacturaAsociada(req.params.antClienId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

//VINCULAR ANTICIPOS


router.post('/vincula/varios/', function (req, res) {
    var antClien = req.body;
    anticiposClientesDb.vinculaAntCliens(antClien, function (err, antClien) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});


//borra un anticipos vinculados
router.delete('/desvincula/:antclienId', function (req, res) {
    anticiposClientesDb.deleteFacturaAntClien(req.params.antclienId, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        }  else {
            res.json(data);
        }
    });
});

// BorrarAntproveDesdeParte
router.delete('/borrar/desde/parte/:parteLineaId/:clienteId', function (req, res) {
    anticiposClientesDb.BorrarAntclienDesdeParte(req.params.parteLineaId, req.params.clienteId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
                res.json(null);
        }
    });
});

router.get('/cliente/recupera/todos/:clienteId', function (req, res) {
    anticiposClientesDb.getAnticiposCliente(req.params.clienteId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

//ANTICIPOS DEL SERVICIO

router.get('/cliente/recupera/todos/servicio/:servicioId', function (req, res) {
    anticiposClientesDb.getAnticiposClienteServicio(req.params.servicioId, function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});



// Exports
module.exports = router;