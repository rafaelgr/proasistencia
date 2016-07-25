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
        clientesDb.getClientesBuscar(nombre, function (err, clientes) {
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


router.get('/activos', function (req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        clientesDb.getClientesActivosBuscar(nombre, function (err, clientes) {
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
