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

// PutProveedorplayerId
// modifica el proveedor con el id pasado
router.put('/playerId/usuPush/:proveedorId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    proveedoresDb.getProveedor(req.params.proveedorId, function(err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (proveedor == null) {
                return res.status(404).send("Proveedor no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                proveedoresDb.putProveedorUsupushPlayerId(req.params.proveedorId, req.body, function(err, proveedor) {
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


//PROVEEDORES ACTIVOS
router.get('/activos/proveedores/todos', function(req, res) {
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
    if(!nombre) {
        proveedoresDb.getProveedoresActivosSinNombre(proIds, function(err, proveedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(proveedores);
            }
        });
    }
});

//PROVEEDORES ACTIVOS SOLO COMERCIALES
router.post('/activos/proveedores/todos/comerciales', function(req, res) {
    var nombre = req.query.nombre;
    var proIds = null;
    if(req.body.proveedores) proIds = req.body.proveedores;
    if (nombre && nombre != 'null') {
        proveedoresDb.getProveedoresActivosComerciales(nombre, proIds, function(err, proveedores) {
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


router.post('/activos/proveedores/todos/comerciales/con/tipo', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre && nombre != 'null') {
        proveedoresDb.getProveedoresActivosComercialesConTipo(nombre, function(err, proveedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(proveedores);
            }
        });
    } else {
        try {
            throw new Error("Nombre no especificado");
        } catch(e) {
            return res.status(404).send(err.message);
        }
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

//PROVEEDORES/COLABORADORES ACTIVOS BUSCADOS POR NIF
router.get('/activos/proveedores/todos/colaboradores/por/nif', function(req, res) {
    var nif = req.query.nif;
    if (nif) {
        proveedoresDb.getProveedoresColaboradoresActivosNif(nif, function(err, proveedores) {
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

//LOGIN Y PASSWORD DEL PROVEEDOR NUEVO
router.post('/login/usuPush/password/registro', function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
        proveedoresDb.postLoginUsuPush(login, password, function(err, profesional) {
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

//USUARIOS DE LA APLICACION
router.get('/usuarios/proveedor/app/:proveedorId', function(req, res) {
    proveedoresDb.getusuariosProveedor(req.params.proveedorId, function(err, usuarios) {
        if (err) return res.status(500).send(err.message);
        res.json(usuarios);
    });
});
router.get('/usuario/proveedor/app/:proveedorUsuarioPushId', function(req, res) {
    proveedoresDb.getusuarioProveedor(req.params.proveedorUsuarioPushId, function(err, usuario) {
        if (err) return res.status(500).send(err.message);
        res.json(usuario[0]);
            
    });
});

router.post('/usuarios/proveedor/app/nuevo', function(req, res) {
    var usuarioPush = req.body.usuarioPush;
        proveedoresDb.postUsuarioPush(usuarioPush, function(err, data) {
            if (err) return res.status(500).send(err.message);
            res.json(data);
            
        });
});

// PutProveedor
// modifica el proveedor con el id pasado
router.put('/usuarios/proveedor/app/modifica/:proveedorUsuarioPushId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    proveedoresDb.putProveedorUsuarioPush(req.params.proveedorUsuarioPushId, req.body.usuarioPush, function(err, proveedor) {
        if (err) return res.status(500).send(err.message);
        res.json(proveedor);
    });    
});

// DeleteProveedor
// elimina un proveedor de la base de datos
router.delete('/usuarios/proveedor/app/elimina/:proveedorUsuarioPushId', function(req, res) {
    proveedoresDb.deleteProveedorUsuarioPush(req.params.proveedorUsuarioPushId, function(err, data) {
        if (err) return res.status(500).send(err.message);
        res.json(null);
    });
});

//BUSCA UN PROVEEDOR CON UN LOGIN Y PASSWORD CONCRETOS
router.get('/login/usuPush/password/registro/:login/:pass', function(req, res) {
    var login = req.params.login;
    var pass = req.params.pass;
        proveedoresDb.getLoginUsuPush(login, pass, function(err, profesional) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(profesional);
            }
        });
});

//NUEVA LLAMADA PARA LOS PROVEEDORES ACTIVOS CON DEPARTAMENTO

router.get('/activos/departamento/por/tipo/:tipoProveedorId/:departamentoId', async (req, res, next) => {
    try {
        proveedoresDb.getProveedoresActivoDepTipo(req.params.tipoProveedorId, req.params.departamentoId)
        .then( (proveedores) => {
            res.json(proveedores)
        })
        .catch(( err) => {
            next(err);
        })

    } catch(error) {
        next(error);
    }
});

//INDICES CORRECTORES

//Devuelve los indices correctores de un proveedor
router.get('/indices-correctores/proveedor/:proveedorId', async (req, res, next) => {
    try {
        let indices = await proveedoresDb.getIndicesCorectoresProveedor(req.params.proveedorId);
        res.json(indices);
    } catch(error) {
        next(error);
    }
});


//Devuelve los indices correctores de un proveedor y un tipo profesional
router.get('/indices-correctores/proveedor/:proveedorId/:tipoPropfesionalId', async (req, res, next) => {
    try {
        let indices = await proveedoresDb.getIndicesCorectoresProveedorProfesion(req.params.proveedorId, req.params.tipoPropfesionalId);
        res.json(indices);
    } catch(error) {
        next(error);
    }
});

//Devuelve un indice corrector con su id pasado
router.get('/indices-correctores/:indiceCorrectorId', async (req, res, next) => {
    try {
        let indices = await proveedoresDb.getIndiceCorector(req.params.indiceCorrectorId);
        res.json(indices);
    } catch(error) {
        next(error);
    }
});

//da de alta un registro en la tabla indices_correctores
router.post('/indices-correctores/proveedor/', async (req, res, next) => {
    try {
        let indiceCorrector = req.body.indiceCorrector;
        let [result] = await proveedoresDb.postIndiceCorectoreProveedor(indiceCorrector);
        res.json(result);
    } catch(error) {
        next(error);
    }
});

//modifica un registro en la tabla indices_correctores con su identificador pasado
router.put('/indices-correctores/proveedor/:indiceCorrectorId', async (req, res, next) => {
    try {
        let indiceCorrector = req.body.indiceCorrector;
        let id = req.params.indiceCorrectorId
        let [result] = await proveedoresDb.putIndiceCorectoreProveedor(indiceCorrector, id);
        res.json(result);
    } catch(error) {
        next(error);
    }
});

//elimina un registro en la tabla indices_correctores con su identificador pasado
router.delete('/indices-correctores/:indiceCorrectorId', async (req, res, next) => {
    try {
        let id = req.params.indiceCorrectorId
        let [result] = await proveedoresDb.deleteIndiceCorector(id);
        res.json(result);
    } catch(error) {
        next(error);
    }
});

//LOGIN EN LA APLICACIÓN DE ARQUITECTURA

router.post('/login/arquitectura/por/nif', function(req, res) {
    var password = req.body.usuario.password;
        proveedoresDb.postLoginArquitectura(password, function(err, profesional) {
            if (err) {
                return res.status(500).send(err);
            } else {
                res.json(profesional);
            }
        });
});



// Exports
module.exports = router;