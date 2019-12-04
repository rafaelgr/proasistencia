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
    anticiposClientesDb.getAnticiposProveedores(function (err, anticipos) {
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
router.get('/:antclienId', function (req, res) {
    anticiposClientesDb.getAnticipoProveedor(req.params.antclienId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});


// Getanticipo
// devuelve las anticipos de un proveedor
router.get('/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/:proveedorId', function (req, res) {
    anticiposClientesDb.getAnticipoProveedorId(req.params.proveedorId, function (err, anticipo) {
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



router.get('/nuevo/Cod/proveedor/anticipo/ultima/ref/:fecha', function (req, res) {
    var fecha = req.params.fecha;
    anticiposClientesDb.getNuevaRefAntclien(fecha, function (err, antclien) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(antclien);
        }
    });
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
    var antclien = req.body[0].antclien;
    
    
    anticiposClientesDb.postAnticipo(antclien,function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(anticipo);
        }
    });
});



// PutAnticipo
// modifica el preanticipo con el id pasado
router.put('/:antclienId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    anticiposClientesDb.getAnticipoProveedor(req.params.antclienId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (anticipo == null) {
                return res.status(404).send("anticipo no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                var antclien = req.body[0].antclien;
                anticiposClientesDb.putAnticipo(req.params.antclienId, antclien,function (err, anticipo2) {
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
    var antclien = req.body.antclien;
anticiposClientesDb.getNuevaRef(antclien, function (err, factura) {
    if (err) {
        return res.status(500).send(err.message);
    } else {
        res.json(factura);
    }
});
});

// DeleteAnticipo
// elimina un preanticipo de la base de datos
router.delete('/:antclienId', function (req, res) {
    var antclien = req.body;
    var antclien2 = {
        facproveId: antclien.facproveId,
        antclienId: null
    }
    facturasClientesDb.putFacturaAntclienToNull( antclien2, function (err, anticipo2) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            anticiposClientesDb.deleteAnticipo(req.params.antclienId, function (err, anticipo) {
                if (err) {
                    return res.status(500).send(err.message);
                } else {
                    res.json(anticipo);
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
// modifica al campo visada de la antclien con el id pasado
router.put('/visadas/modificar/:antclienId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    anticiposClientesDb.getAnticipoProveedor(req.params.antclienId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (anticipo == null) {
                return res.status(404).send("anticipo no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                var antclien = req.body[0].antclien;
                
                anticiposClientesDb.putAnticipoVisada(req.params.antclienId, antclien, function (err, anticipo) {
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

// getFacturasProveedoresUsuario
// Devuelve las facturas de proveedores que pertenezcan a los departamentos
//que el usuario tenga asignados
router.get('/usuario/logado/departamento/:usuarioId/:departamentoId', function (req, res) {
    anticiposClientesDb.getFacturasProveedoresUsuario(req.params.usuarioId, req.params.departamentoId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
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

// Exports
module.exports = router;