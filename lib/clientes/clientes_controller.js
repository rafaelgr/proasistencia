var express = require('express');
var router = express.Router();
var clientesDb = require("./clientes_db_mysql");
var correoAPI = require('../correoElectronico/correoElectronico');

// GetClientes
// Devuelve una lista de objetos con todos los clientes de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos clientes
// que lo contengan.
router.get('/', function (req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        clientesDb.getClientes(nombre, function (err, clientes) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(clientes);
            }
        });

    } else {
        clientesDb.getClientes('*', function (err, clientes) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(clientes);
            }
        });
    }
});

//nuevo get, devuelve todos los clientes
router.get('/todosClientes', function(req, res){
    clientesDb.getTodosClientes(function(err, clientes){
        if (err)  return res.status(500).send(err.message);
        res.json(clientes);
    })
});

router.get('/clientes_activos', function(req, res){
    var nombreABuscar = req.query.nombre;
    clientesDb.getClientesEnActivo(nombreABuscar, function(err, clientes){
        if (err) return res.status(500).send(err.message);
        res.json(clientes);
    });
})

router.get('/mantenedores_activos', function(req, res){
    var nombreABuscar = req.query.nombre;
    clientesDb.getMantenedoresEnActivo(nombreABuscar, function(err, clientes){
        if (err) return res.status(500).send(err.message);
        res.json(clientes);
    });
})


// nuevas búsquedas para desplegables


router.get('/activos', function (req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        clientesDb.getClientesActivosNombre(nombre, function (err, clientes) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(clientes);
            }
        });

    } else {
        clientesDb.getClientesActivos(function (err, clientes) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(clientes);
            }
        });
    }
});

router.get('/ampliado', function(req, res){
    clientesDb.getClientesAmpliadoTodos(function(err, clientes){
        if (err) return res.status(500).send(err.message);
        res.json(clientes);
    })
});

router.get('/ampliado/activos', function(req, res){
    clientesDb.getClientesAmpliadoActivos(function(err, clientes){
        if (err) return res.status(500).send(err.message);
        res.json(clientes);
    })
});

router.get('/buscar', function(req, res){
    var proId = req.query.Codigo;
    var nombre = req.query.Nombre;
    var nif = req.query.Nif;
    var direccion = req.query.Direccion;
    var telefono = req.query.Telefono;
    var cuentaContable = req.query.Cuenta;
    clientesDb.getClientes2(proId, nombre,nif,telefono,direccion, cuentaContable, function(err, clientes){
        if (err) return res.status(500).send(err.message);
        res.json(clientes);
    })
});

router.get('/buscar/activos', function(req, res){
    var proId = req.query.Codigo;
    var nombre = req.query.Nombre;
    var nif = req.query.Nif;
    var direccion = req.query.Direccion;
    var telefono = req.query.Telefono;
    var cuentaContable = req.query.Cuenta;
    clientesDb.getClientesActivos2(proId, nombre,nif,telefono,direccion, cuentaContable, function(err, clientes){
        if (err) return res.status(500).send(err.message);
        res.json(clientes);
    })
});


router.get('/mantenedores/', function (req, res) {
    clientesDb.getMantenedores(function (err, clientes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});

router.get('/soloclientes/', function (req, res) {
    clientesDb.getSoloClientes(function (err, clientes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});

router.get('/nuevocodigo/', function (req, res) {
    clientesDb.getNuevoCodigo(function (err, clientes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});

// GetCliente
// devuelve el cliente con el id pasado
router.get('/:clienteId', function (req, res) {
    clientesDb.getCliente(req.params.clienteId, function (err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (cliente == null) {
                return res.status(404).send("Cliente no encontrado");
            } else {
                res.json(cliente);
            }
        }
    });
});

// GetClienteByProId
// devuelve el cliente con el id pasado
router.get('/codigo/:codigo', function (req, res) {
    clientesDb.getClienteByProId(req.params.codigo, function (err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (cliente == null) {
                return res.status(404).send("Cliente no encontrado");
            } else {
                res.json(cliente);
            }
        }
    });
});

// GetMantenedorByProId
// devuelve el cliente con el id pasado
router.get('/mantenedorc/:codigo', function (req, res) {
    clientesDb.getMantenedorByProId(req.params.codigo, function (err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (cliente == null) {
                return res.status(404).send("Mantenedor no encontrado");
            } else {
                res.json(cliente);
            }
        }
    });
});


// GetClientesAgente
// devuelve los clientes de un determinado agente
router.get('/agente/:agenteId', function (req, res) {
    clientesDb.getClientesAgente(req.params.agenteId, function (err, clientes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});

// GetClientesAgente
// devuelve los clientes de un determinado agente
router.get('/agente/clientes-activos/:agenteId', function (req, res) {
    clientesDb.getClientesAgenteActivos(req.params.agenteId, function (err, clientes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});

// GetClientesAgente
// devuelve los clientes de un determinado agente con el nombre pasado del cliente pasado y la id delñ agente
router.get('/agente/cliente/:nombre/:id', function (req, res) {
    clientesDb.getClientesAgenteConNombre(req.params.nombre, req.params.id, function (err, clientes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});


router.get('/comisionistas/:clienteId', function (req, res) {
    clientesDb.getClienteComisionistas(req.params.clienteId, function (err, comisionistas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (comisionistas == null) {
                comisionistas = [];
            }
            res.json(comisionistas);

        }
    });
});

//devuelve todos los ProId 
router.get('/cod/cliente/proId/', function (req, res) {
    clientesDb.getProId( function (err, proId) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(proId);

        }
    });
});

// PostCliente
// permite dar de alta un cliente
router.post('/', function (req, res) {
    clientesDb.postCliente(req.body.cliente, function (err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cliente);
        }
    });
});



// PutCliente
// modifica el cliente con el id pasado
router.put('/:clienteId', function (req, res) {
    var cuen;
    // antes de modificar comprobamos que el objeto existe
    clientesDb.getCliente(req.params.clienteId, function (err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (cliente == null) {
                return res.status(404).send("Cliente no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                if(req.body.cliente.cuentaContable != req.body.cliente.antCuentaContable) {
                    cuen = null;
                } else {
                    cuen = cliente.cuentaContable
                }
                delete req.body.cliente.antCuentaContable;
                clientesDb.putCliente(req.params.clienteId, req.body.cliente, cuen, function (err, cliente) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(cliente);
                    }
                });
            }
        }
    });
});

// PutClienteDesdeAgnte
// modifica los clientes con un agente asociadp
router.put('/desde/agente/:agenteId', function (req, res) {
    clientesDb.putClienteDesdeAgente(req.params.agenteId, req.body.cliente, function (err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cliente);
        }
    });

});

// putClienteLogin
// modifica el usuario y contraseña del cliente en laweb de clientes/egentes
router.put('/restablece/loginPass/:clienteId', function (req, res) {
    clientesDb.putClienteLogin(req.params.clienteId, req.body.cliente, function (err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cliente);
        }
    });

});
     

// DeleteCliente
// elimina un cliente de la base de datos
router.delete('/:clienteId', function (req, res) {
    var cliente = req.body.cliente;
    clientesDb.deleteCliente(req.params.clienteId, cliente, function (err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//FUNCIONES RELACIONADAS  CON LA TABLA CLIENTES_AGENTES

//GetClientesAgentes
router.get('/historial/agentes/:clienteId', function (req, res) {
    clientesDb.getClientesAgentes(req.params.clienteId, function (err, clienteAgente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (clienteAgente == null) {
                return res.status(404).send("clienteAgente no encontrado");
            } else {
                res.json(clienteAgente);
            }
        }
    });
});

// PostCambiaAgente
// guarda agente en la tabla clientes_agentes
router.post('/agente', function (req, res) {
    clientesDb.postCambiaAgente(req.body.clienteAgente, function (err, clienteAgente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clienteAgente);
        }
    });
});

//DeleteClienteAgente
//elimina un clienteAgente de la base de datos
router.delete('/clienteAgente/:clienteAgenteId', function (req, res) {
    clientesDb.getClientesAgenteUnico(req.params.clienteAgenteId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            clientesDb.deleteClienteAgente(req.params.clienteAgenteId, function (err, resultado) {
                if (err) {
                    return res.status(500).send(err.message);
                } else {
                    res.json(result);
                }
            });
        }
    });
    
});

//TARIFAS
router.get('/tarifa/por/codigo/:clienteId/:codigoReparacion', function (req, res) {
    clientesDb.getPrecioUnitario(req.params.clienteId, req.params.codigoReparacion,function (err, precio) {
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

router.get('/tarifa/por/articuloId/:clienteId/:articuloId', function (req, res) {
    clientesDb.getPrecioUnitarioPorArticuloId(req.params.clienteId, req.params.articuloId,function (err, precio) {
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



//

router.get('/comprueba/cuentaContable/repetida/:cuentacontable', function(req, res) {
    clientesDb.getClientePorCuentaContable(req.params.cuentacontable, function(err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } 
        res.json(cliente);
    });
});

router.get('/comprueba/nif/repetido/:nif', function(req, res) {
    clientesDb.getClientePorNif(req.params.nif, function(err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } 
        res.json(cliente);
    });
});



router.post('/comprueba/codigo/repetido', function(req, res) {
    clientesDb.postClientePorCodigo(req.body.cod, function(err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } 
        res.json(cliente);
    });
});


router.post('/activo/login', function(req, res) {
    clientesDb.postClienteActivoLogin(req.body.cliente, function(err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } 
        res.json(cliente);
    });
});

router.post('/recupera/cliente/activo/campo', function(req, res) {
    var valor = req.body.valor;
    var key = Object.keys(valor);
    key = key[0];
    clientesDb.getClientePorCampo(valor, key, function(err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } 
        res.json(cliente);
    });
});

//ENVÍO DE CORREO
router.post('/enviar/correo/cliente/web', async (req, res, next) => {
    try {
        var data = req.body.correo
        
        var datos = correoAPI.sendCorreoNew(data)
        if(datos.err) {
            next(datos.err);
        }
           
             // 3- Enviar el correo propiamente dicho
             datos.transporter.sendMail(datos.mailOptions)
             .then (result => {
                res.json(result);
             })
             .catch( err => {
                next(err.response); 
             });

    }catch(e) {
        next(e)
    }
});




// Exports
module.exports = router;
