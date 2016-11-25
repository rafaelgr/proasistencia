var express = require('express');
var router = express.Router();
var clientesComisionistasDb = require("./clientes_comisionistas_db_mysql");

// GetClientesComisionistas
// Devuelve una lista de objetos con todos los clienteComisionistas de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos clienteComisionistas
// que lo contengan.
router.get('/', function (req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        clientesComisionistasDb.getClientesComisionistasBuscar(nombre, function (err, clienteComisionistas) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(clienteComisionistas);
            }
        });

    } else {
        clientesComisionistasDb.getClientesComisionistas(function (err, clienteComisionistas) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(clienteComisionistas);
            }
        });
    }
});

// GetClienteComisionista
// devuelve el clienteComisionista con el id pasado
router.get('/:clienteComisionistaId', function (req, res) {
    clientesComisionistasDb.getClienteComisionista(req.params.clienteComisionistaId, function (err, clienteComisionista) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (clienteComisionista == null) {
                return res.status(404).send("Comisionista de cliente no encontrado");
            } else {
                res.json(clienteComisionista);
            }
        }
    });
});

// GetClienteComisionistaComercial
// devuelve el clienteComisionista del cliente y comercial pasado
router.get('/comercial/:idCliente/:idComercial', function (req, res) {
    clientesComisionistasDb.getClienteComisionistaComercial(req.params.idCliente, req.params.idComercial, function (err, clienteComisionista) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clienteComisionista);
        }
    });
});

// PostClienteComisionista
// permite dar de alta un clienteComisionista
router.post('/', function (req, res) {
    clientesComisionistasDb.postClienteComisionista(req.body.clienteComisionista, function (err, clienteComisionista) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clienteComisionista);
        }
    });
});



// PutClienteComisionista
// modifica el clienteComisionista con el id pasado
router.put('/:clienteComisionistaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    clientesComisionistasDb.getClienteComisionista(req.params.clienteComisionistaId, function (err, clienteComisionista) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (clienteComisionista == null) {
                return res.status(404).send("ClienteComisionista no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                clientesComisionistasDb.putClienteComisionista(req.params.clienteComisionistaId, req.body.clienteComisionista, function (err, clienteComisionista) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(clienteComisionista);
                    }
                });
            }
        }
    });
});

// DeleteClienteComisionista
// elimina un clienteComisionista de la base de datos
router.delete('/:clienteComisionistaId', function (req, res) {
    var clienteComisionista = req.body.clienteComisionista;
    clientesComisionistasDb.deleteClienteComisionista(req.params.clienteComisionistaId, clienteComisionista, function (err, clienteComisionista) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;