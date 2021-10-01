var express = require('express');
var router = express.Router();
var proveedoresDb = require("./proveedores_db_mysql");

// Getproveedores
// Devuelve una lista de objetos con todos los proveedores de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos proveedores
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    var activos = req.query.activos;
    if (nombre) {
        proveedoresDb.getProveedoresBuscar(nombre, activos, function(err, proveedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(proveedores);
            }
        });

    } else {
        proveedoresDb.getProveedores( function(err, proveedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(proveedores);
            }
        });
    }
});


// GetProveedor
// devuelve el Proveedor con el id pasado
router.get('/:proveedorId', function(req, res) {
    proveedoresDb.getProveedor(req.params.proveedorId, function(err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (proveedor == null) {
                return res.status(404).send("Proveedor no encontrado");
            } else {
                res.json(proveedor);
            }
        }
    });
});


router.get('/codigo/proveedor/:cuentaContable', function(req, res) {
    proveedoresDb.getProveedorCuentaContable(req.params.cuentaContable, function(err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (proveedor == null) {
                res.json(proveedor);
            } else {
                res.json(proveedor);
            }
        }
    });
});




router.get('/nuevoCod/proveedor/:inicioCuenta', function (req, res) {
    proveedoresDb.getNuevoCodProveedor(req.params.inicioCuenta, function (err, clientes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});

router.get('/nuevoCod/proveedor/acreedor/autogenerado', function (req, res) {
    proveedoresDb.getNuevoCodProveedorAcreedor(function (err, clientes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});



router.get('/comprueba/nif/repetido/:nif', function(req, res) {
    proveedoresDb.getProveedorPorNif(req.params.nif, function(err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (proveedor == null) {
                res.json(proveedor);
            } else {
                res.json(proveedor);
            }
        }
    });
});

router.get('/tipo/proveedor/por/tipo/:tipoProveedorId/:departamentoId/:fechaSolicitud', function(req, res) {
    proveedoresDb.getProveedorPorTipo(req.params.tipoProveedorId, req.params.departamentoId, req.params.fechaSolicitud, function(err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (proveedor == null) {
                res.json(proveedor);
            } else {
                res.json(proveedor);
            }
        }
    });
});

// PostProveedor
// permite dar de alta un proveedor
router.post('/', function(req, res) {
    proveedoresDb.postProveedor(req.body, function(err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(proveedor);
        }
    });
});



// PutProveedor
// modifica el proveedor con el id pasado
router.put('/:proveedorId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    proveedoresDb.getProveedor(req.params.proveedorId, function(err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (proveedor == null) {
                return res.status(404).send("Proveedor no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                proveedoresDb.putProveedor(req.params.proveedorId, req.body, function(err, proveedor) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(proveedor);
                    }
                });
            }
        }
    });
});

// PutProveedorplayerId
// modifica el proveedor con el id pasado
router.put('/playerId/:proveedorId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    proveedoresDb.getProveedor(req.params.proveedorId, function(err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (proveedor == null) {
                return res.status(404).send("Proveedor no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                proveedoresDb.putProveedorPlayerId(req.params.proveedorId, req.body, function(err, proveedor) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(proveedor);
                    }
                });
            }
        }
    });
});

// DeleteProveedor
// elimina un proveedor de la base de datos
router.delete('/:proveedorId', function(req, res) {
    var proveedor = req.body.proveedor;
    proveedoresDb.deleteProveedor(req.params.proveedorId, proveedor, function(err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});


//TARIFAS
router.get('/tarifa/por/codigo/:proveedorId/:codigoReparacion', function (req, res) {
    proveedoresDb.getPrecioUnitario(req.params.proveedorId, req.params.codigoReparacion,function (err, precio) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (precio == null) {
                precio = [];
            }
            res.json(precio);

        }
    });
});

router.get('/tarifa/por/articuloId/:proveedorId/:articuloId', function (req, res) {
    proveedoresDb.getPrecioUnitarioPorArticuloId(req.params.proveedorId, req.params.articuloId,function (err, precio) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (precio == null) {
                precio = [];
            }
            res.json(precio);

        }
    });
});


//PROVEEDORES ACTIVOS
router.post('/activos/proveedores/todos', function(req, res) {
    var nombre = req.query.nombre;
    var proIds = null;
    if(req.body.proveedores) proIds = req.body.proveedores;
    if (nombre && nombre != 'null') {
        proveedoresDb.getProveedoresActivos(nombre, proIds, function(err, proveedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(proveedores);
            }
        });
    } 
    if(nombre == 'null') {
        proveedoresDb.getProveedoresActivosSinNombre(proIds, function(err, proveedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(proveedores);
            }
        });
    }
});

//PROVEEDORES ACTIVOS BUSCADOS POR NIF
router.post('/activos/proveedores/todos/por/nif', function(req, res) {
var datos = req.body;
    if (datos.length > 0) {
        
        proveedoresDb.getProveedoresActivosNif(datos, function(err, proveedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(proveedores);
            }
        });
    } 
});


//DEPARTAMENTOS DEL PROVEEDOR
router.get('/departamentos/asociados/:proveedorId', function(req, res) {
    var proveedorId = req.params.proveedorId;
        proveedoresDb.getDepartamentosAsociados(proveedorId, function(err, departamentos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(departamentos);
            }
        });
});

//CODIGO PAIS DEL PROVEEDOR
router.get('/recupera/cod/pais', function(req, res) {
        proveedoresDb.getCodPais(function(err, paises) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(paises);
            }
        });
});

//PROVEEDORES ACTIVOS BUSCADOS POR NIF
router.get('/activos/proveedores/todos/por/nif', function(req, res) {
    var nif = req.query.nif;
    if (nif) {
        proveedoresDb.getProveedoresActivosNifBis(nif, function(err, proveedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(proveedores);
            }
        });
    } 
});


//PROFESIONES DEL PROVEEDOR
router.get('/profesiones/asociadas/todas/:proveedorId', function(req, res) {
    var proveedorId = req.params.proveedorId;
        proveedoresDb.getProfesionesAsociadas(proveedorId, function(err, profesiones) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(profesiones);
            }
        });
});

//LOGIN Y PASSWORD DEL PROVEEDOR

router.post('/login/password/registro', function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
        proveedoresDb.postLogin(login, password, function(err, profesional) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(profesional);
            }
        });
});

//PROVEEDORES CON PLAYERID

router.get('/tipo/proveedor/por/tipo/playerId/:tipoProveedorId/:departamentoId/:fechaSolicitud', function(req, res) {
    proveedoresDb.getProveedorPorTipoPlayerId(req.params.tipoProveedorId, req.params.departamentoId, req.params.fechaSolicitud, function(err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (proveedor == null) {
                res.json(proveedor);
            } else {
                res.json(proveedor);
            }
        }
    });
});





// Exports
module.exports = router;