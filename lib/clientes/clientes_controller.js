var express = require('express');
var router = express.Router();
var clientesDb = require("./clientes_db_mysql");

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
        clientesDb.getClientes(function (err, clientes) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(clientes);
            }
        });
    }
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
        clientesDb.getClientesActivos(nombre, function (err, clientes) {
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
    clientesDb.getClientes2(proId, nombre,nif,telefono,direccion, function(err, clientes){
        if (err) return res.status(500).send(err.message);
        res.json(clientes);
    })
});

router.get('/buscar/activos', function(req, res){
    var proId = req.query.proId;
    var nombre = req.query.nombre;
    var nif = req.query.nif;
    var direccion = req.query.direccion;
    var telefono = req.query.telefono;
    clientesDb.getClientesActivos2(proId, nombre,nif,telefono,direccion, function(err, clientes){
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
    // antes de modificar comprobamos que el objeto existe
    clientesDb.getCliente(req.params.clienteId, function (err, cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (cliente == null) {
                return res.status(404).send("Cliente no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                clientesDb.putCliente(req.params.clienteId, req.body.cliente, function (err, cliente) {
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

// Exports
module.exports = router;
