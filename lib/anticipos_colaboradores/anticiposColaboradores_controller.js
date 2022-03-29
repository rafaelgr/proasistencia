var express = require('express');
var router = express.Router();
var anticiposColaboradoresDb = require("./anticiposColaboradores_db_mysql");
var facturasProveedoresDb = require("../facturas_proveedores/facturasProveedores_db_mysql");

// GetPreanticipos
// Devuelve una lista de objetos con todos los preanticipos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos preanticipos
// que lo contengan.
router.get('/', function (req, res) {
    anticiposColaboradoresDb.getAnticiposColaboradores(function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});

router.get('/all/', function (req, res) {
    anticiposColaboradoresDb.getAnticiposAll(function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});

// Getanticipo
// devuelve la anticipo con el id pasado
router.get('/:antcolId', function (req, res) {
    anticiposColaboradoresDb.getAnticipoColaborador(req.params.antcolId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});


// Getanticipo
// devuelve las anticipos de un colaborador completos
router.get('/colaborador/anticipos/solapa/muestra/tabla/datos/anticipo/:colaboradorId', function (req, res) {
    anticiposColaboradoresDb.getAnticipoColaboradorId(req.params.colaboradorId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});

// Getanticipo
// devuelve las anticipos de un colaborador incompletos
router.get('/colaborador/anticipos/solapa/muestra/tabla/datos/anticipo/incompleto/:colaboradorId', function (req, res) {
    anticiposColaboradoresDb.getAnticipoColaboradorIdIncompleto(req.params.colaboradorId,function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});

// Getanticipo
// devuelve las anticipos de un colaborador incompletos
router.get('/colaborador/anticipos/solapa/muestra/tabla/datos/anticipo/incompleto/completo/:colaboradorId/:facproveId', function (req, res) {
    anticiposColaboradoresDb.getAnticipoColaboradorTodos(req.params.colaboradorId,  req.params.facproveId,function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});

router.post('/vincula/varios/', function (req, res) {
    var antcol = req.body;
    anticiposColaboradoresDb.vinculaAntCol(antcol, function (err, antcol) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//borra un anticipos vinculados
router.delete('/desvincula/:antcolId', function (req, res) {
    anticiposColaboradoresDb.deleteFacturaAntCol(req.params.antcolId, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        }  else {
            res.json(data);
        }
    });
});


router.get('/contrato/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    anticiposColaboradoresDb.getAnticiposContrato(contratoId, function(err, preanticipos){
        if (err) return res.status(500).send(err.message);
        res.json(preanticipos);
    })
});





//devuelve el tipo de cliente de un contrato
router.get('/contrato/tipo/cliente/:contratoId', function(req, res){
    var contratoId = req.params.contratoId;
    if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
    anticiposColaboradoresDb.getTipoCliente(contratoId, function(err, datos){
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
    anticiposColaboradoresDb.getPreContaAnticipos(dFecha, hFecha,departamentoId, usuarioId, function (err, anticipos) {
        if (err) return res.status(500).send(err.message);
        res.json(anticipos);
    });
})


// PostAnticipo
// permite dar de alta una anticipo de colaborador
router.post('/', function (req, res) {
    var antcol = req.body[0].antcol;
    anticiposColaboradoresDb.postAnticipo(antcol,function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipo);
        }
    });
});

// PostAnticipo
// permite dar de alta una anticipo de colaborador
router.post('/reparaciones', function (req, res) {
    var antcol = req.body.antcol;
    anticiposColaboradoresDb.postAnticipo(antcol,function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipo);
        }
    });
});


// PutAnticipo
// modifica el anticipo con el id pasado
router.put('/:antcolId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    anticiposColaboradoresDb.getAnticipoColaborador(req.params.antcolId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (anticipo == null) {
                return res.status(404).send("anticipo no encontrado");
            } else {
                 // ya sabemos que existe y lo intentamos modificar.
                if(req.body[0]) {
                    var antcol = req.body[0].antcol;
                } else {
                    var antcol = req.body.antcol;
                }
                anticiposColaboradoresDb.putAnticipo(req.params.antcolId, antcol,function (err, anticipo2) {
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

// DeleteAnticipo
// elimina un anticipo de la base de datos
router.delete('/:antcolId', function (req, res) {
    var antcol = req.body;
    var antcol2 = {
        facproveId: antcol.facproveId,
        antcolId: null
    }
    facturasProveedoresDb.putFacturaAntcolToNull( antcol2, function (err, anticipo2) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            anticiposColaboradoresDb.deleteAnticipo(req.params.antcolId, function (err, anticipo) {
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
    SOLAPA SERVICIADAS
-------------------------*/

//GetServiciadas
//devuelve todas las empresas serviciadas asociadas a una anticipo
router.get('/servicidas/anticipos/colaborador/todas/:antcolId', function (req, res) {
    anticiposColaboradoresDb.getserviciadasAnticipo(req.params.antcolId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

router.get('/servicidas/anticipos/colaborador/una/para/editar/:antcolId', function (req, res) {
    anticiposColaboradoresDb.getserviciadaAnticipo(req.params.antcolId, function (err, result) {
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
    var serviciada = req.body.antcolServiciada;
    anticiposColaboradoresDb.postServiciada(serviciada, function (err, serviciada) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(serviciada);
        }
    });
});

//putserviciada
//modifica una empresa serviciada con su id pasado
router.put('/serviciada/edita/:antcolserviciadoId', function (req, res) {
    anticiposColaboradoresDb.putServiciada(req.params.antcolserviciadoId, req.body.antcolServiciada, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(data);
        }
    });
});

//deleteServiciadas
//permite borrar una empresa serviciada de una anticipo
router.delete('/serviciada/anticipo/colaborador/:antcolServiciadaId', function(req, res){
    var antcolServiciadaId = req.params.antcolServiciadaId;
    if (!antcolServiciadaId) return res.status(400).send("Falta la referencia a la EMPRESA SERVICIADA en la URL de la solicitud");
    anticiposColaboradoresDb.deleteServiciadas(antcolServiciadaId, function(err){
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});



//LLAMADAS  POR DEPARTAMENTO DE USUARIO

// getFacturasColaboradoresUsuario
// Devuelve las facturas de colaboradores que pertenezcan a los departamentos
//que el usuario tenga asignados
router.get('/usuario/logado/departamento/:usuarioId/:departamentoId', function (req, res) {
    anticiposColaboradoresDb.getAnticiposColaboradoresUsuario(req.params.usuarioId, req.params.departamentoId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});

router.get('/usuario/logado/departamento/all/:usuarioId/:departamentoId', function (req, res) {
    anticiposColaboradoresDb.getAnticiposAllUsuario(req.params.usuarioId, req.params.departamentoId, function (err, anticipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipos);
        }
    });
});



router.get('/colaborador/recupera/todos/:colaboradorId', function (req, res) {
    anticiposColaboradoresDb.getAnticiposColaborador(req.params.colaboradorId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});



// Exports
module.exports = router;