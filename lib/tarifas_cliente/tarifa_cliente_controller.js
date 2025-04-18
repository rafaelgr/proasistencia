

var express = require('express');
var router = express.Router();
var TarifasClienteDb = require("./tarifas_cliente_db_mysql");

// GetTarifasCliente
// Devuelve una lista de objetos con todos los TarifasCliente_cliente de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos TarifasCliente_cliente
// que lo contengan.
router.get('/', function (req, res) {
    TarifasClienteDb.getTarifasCliente(function (err, tarifas_cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifas_cliente);
        }
    });
});


// GetTarifa
// devuelve el tarifaCliente con el id pasado
router.get('/:tarifaId', function (req, res) {
    TarifasClienteDb.getTarifaCliente(req.params.tarifaId, function (err, tarifaCliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifaCliente == null) {
                return res.status(404).send("Tarifa no encontrado");
            } else {
                res.json(tarifaCliente);
            }
        }
    });
});

// GetArticuloTarifa
// devuelve la linea de tarifaCliente con el id del articulo  y la id de la tar4ifa pasadade un articulo pasado
router.get('/articulo/:articuloId/:tarifaId', function (req, res) {
    TarifasClienteDb.getArticuloTarifa(req.params.articuloId, req.params.tarifaId, function (err, tarifaCliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifaCliente == null) {
                return res.status(404).send("Tarifa no encontrado");
            } else {
                res.json(tarifaCliente);
            }
        }
    });
});



//Devuelve todos las tarifas_cliente que pertevezcana un grupo
router.get('/grupo/todos/lineas/:grupoId/', function (req, res) {
    TarifasClienteDb.getTarifasClienteGrupo(req.params.grupoId, function (err, tarifas_cliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifas_cliente == null) {
                return res.status(404).send("Tarifas no encontradas");
            } else {
                res.json(tarifas_cliente);
            }
        }
    });
});






// PostTarifa
// permite dar de alta un tarifaCliente
router.post('/', function (req, res) {
    TarifasClienteDb.postTarifaCliente(req.body.tarifaCliente, function (err, tarifaCliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifaCliente);
        }
    });
});



// PutTarifa
// modifica el tarifaCliente con el id pasado
router.put('/:tarifaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    TarifasClienteDb.getTarifaCliente(req.params.tarifaId, function (err, tarifaCliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifaCliente == null) {
                return res.status(404).send("Tarifa no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                TarifasClienteDb.putTarifaCliente(req.params.tarifaId, req.body.tarifaCliente, function (err, tarifaCliente) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tarifaCliente);
                    }
                });
            }
        }
    });
});



// DeleteTarifa
// elimina un tarifaCliente de la base de datos
router.delete('/:tarifaId', function (req, res) {
    var tarifaId = req.params.tarifaId;
    TarifasClienteDb.deleteTarifaCliente(tarifaId, function (err, tarifaCliente) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

/* ----------------------
    LINEAS DE TARIFA
-------------------------*/

// GettarifaClienteLineas
// devuelve el tarifaCliente con el id pasado
router.get('/lineas/:tarifaId', function (req, res) {
    TarifasClienteDb.getTarifaClienteLineas(req.params.tarifaId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("Tarifa sin lineas");
            } else {
                res.json(lineas);
            }
        }
    });
});



// GettarifaClienteLinea
// devuelve el tarifaCliente con el id pasado
router.get('/linea/:tarifaClienteLineaId', function (req, res) {
    TarifasClienteDb.getTarifaClienteLinea(req.params.tarifaClienteLineaId, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("No existe la linea de tarifa solicitada");
            } else {
                res.json(lineas);
            }
        }
    });
});

// GettarifaClienteLineas
// devuelve el tarifaCliente con el id pasado
router.post('/lineas/:tarifaId', function (req, res) {
    var tipos = null;
    if(req.body.tiposProfesionales) {
        tipos = req.body.tiposProfesionales;
    } else {
        tipos =  req.body;
    }
    TarifasClienteDb.getTarifaClienteLineasProfesion(req.params.tarifaId, tipos, function (err, lineas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (lineas == null) {
                return res.status(404).send("Tarifa sin lineas");
            } else {
                res.json(lineas);
            }
        }
    });
});


// PosttarifaClienteLinea
// permite dar de alta un linea de tarifaCliente
router.post('/lineas/', function (req, res) {
    TarifasClienteDb.postTarifaClienteLinea(req.body.tarifaClienteLinea, function (err, tarifaClienteLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifaClienteLinea);
        }
    });
});

//posttarifaClienteLineaMultiple
//permite dar de alta multiples lienas de tarifaCliente en función de la Id del grupo de articulos pasado
router.post('/lineas/multiples/', function (req, res) {
    TarifasClienteDb.postTarifaClienteLineaMultiple(req.body.tarifaClienteLinea, function (err, tarifaClienteLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifaClienteLinea);
        }
    });
});

//posttarifaClienteLineaMultipleTodos
//permite dar de alta multiples lienas de tarifaCliente para todos los grupos de articulos
router.post('/lineas/multiples/todos', function (req, res) {
    TarifasClienteDb.postTarifaClienteLineaMultipleTodos(req.body.tarifaClienteLinea, function (err, tarifaClienteLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifaClienteLinea);
        }
    });
});



// PuttarifaClienteLinea
// modifica el tarifaCliente con el id pasado
router.put('/lineas/:tarifaClienteLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    TarifasClienteDb.getTarifaClienteLinea(req.params.tarifaClienteLineaId, function (err, tarifaClienteLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifaClienteLinea == null) {
                return res.status(404).send("Linea de tarifa no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                TarifasClienteDb.putTarifaClienteLinea(req.params.tarifaClienteLineaId, req.body.tarifaClienteLinea, function (err, tarifaClienteLinea) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tarifaClienteLinea);
                    }
                });
            }
        }
    });
});

// DeletetarifaClienteLinea
// elimina un tarifaCliente de la base de datos
router.delete('/lineas/:tarifaClienteLineaId', function (req, res) {
    var tarifaClienteLinea = req.body.tarifaClienteLinea;
    TarifasClienteDb.deleteTarifaClienteLinea(req.params.tarifaClienteLineaId, tarifaClienteLinea, function (err, tarifaClienteLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});


// DeletetarifaClienteLineaPorTipos
// elimina un tarifaCliente de la base de datos
router.delete('/Borrar/por/tipos/:tarifaClienteId', function (req, res) {
    TarifasClienteDb.deleteTarifaClienteLineaPorTipos(req.params.tarifaClienteId, req.body, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//COPIA DE TARIFA

//postTarifaClienteCopia
//copia las lineas de una tarifa de proveedor y las inserta en una nueva tarifa
router.post('/copia/tarifa/cliente/nombre', function (req, res) {
    TarifasClienteDb.postTarifaClienteCopia(req.body.tarifaCliente, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});


//INCREMENTO/DECREMENTO PRECIO POR %

router.put('/aplicar/porcentaje/precio/:porcentaje/:tarifaId', function (req, res) {
    var tipos = req.body.tiposProfesionales
    TarifasClienteDb.putTarifaClienteLineaPorcentaje(req.params.porcentaje, tipos, req.params.tarifaId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

//DEVUELVE LAS FACTURAS DE UN CLIENTE O UN AGENTE ASOCIADO Y UN DEPARTAMENTO, DEPENDIENDO DE LOS PARAMETROS PASADOS

router.get('/cliente-agente/recupera/tarifa-profesiones/:id/:esCliente', function (req, res) {
    TarifasClienteDb.getTarifaClienteAgente(req.params.id,  req.params.esCliente, function (err, tarifa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifa);
        }
    });
});



// Exports
module.exports = router;
