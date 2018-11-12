

var express = require('express');
var router = express.Router();
var TarifasProveedorDb = require("./tarifas_proveedor_db_mysql");

// GetTarifasProveedor
// Devuelve una lista de objetos con todos los Tarifas_proveedor de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos TarifasProveedor
// que lo contengan.
router.get('/', function (req, res) {
    TarifasProveedorDb.getTarifasProveedor(function (err, tarifas_proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifas_proveedor);
        }
    });
});


// GetTarifa
// devuelve el tarifaProveedor con el id pasado
router.get('/:tarifaId', function (req, res) {
    TarifasProveedorDb.getTarifaProveedor(req.params.tarifaId, function (err, tarifaProveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifaProveedor == null) {
                return res.status(404).send("Tarifa no encontrado");
            } else {
                res.json(tarifaProveedor);
            }
        }
    });
});

// GetArticuloTarifa
// devuelve la linea de tarifaProveedor con el id del articulo  y la id de la tar4ifa pasadade un articulo pasado
router.get('/articulo/:articuloId/:tarifaId', function (req, res) {
    TarifasProveedorDb.getArticuloTarifa(req.params.articuloId, req.params.tarifaId, function (err, tarifaProveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifaProveedor == null) {
                return res.status(404).send("Tarifa no encontrado");
            } else {
                res.json(tarifaProveedor);
            }
        }
    });
});



//Devuelve todos las tarifas_proveedor que pertevezcana un grupo
router.get('/grupo/todos/lineas/:grupoId/', function (req, res) {
    TarifasProveedorDb.getTarifasProveedorGrupo(req.params.grupoId, function (err, tarifas_proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifas_proveedor == null) {
                return res.status(404).send("Tarifas no encontradas");
            } else {
                res.json(tarifas_proveedor);
            }
        }
    });
});







// PostTarifa
// permite dar de alta un tarifaProveedor
router.post('/', function (req, res) {
    TarifasProveedorDb.postTarifaProveedor(req.body.tarifaProveedor, function (err, tarifaProveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifaProveedor);
        }
    });
});



// PutTarifa
// modifica el tarifaProveedor con el id pasado
router.put('/:tarifaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    TarifasProveedorDb.getTarifaProveedor(req.params.tarifaId, function (err, tarifaProveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifaProveedor == null) {
                return res.status(404).send("Tarifa no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                TarifasProveedorDb.putTarifaProveedor(req.params.tarifaId, req.body.tarifaProveedor, function (err, tarifaProveedor) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tarifaProveedor);
                    }
                });
            }
        }
    });
});



// DeleteTarifa
// elimina un tarifaProveedor de la base de datos
router.delete('/:tarifaId', function (req, res) {
    var tarifaId = req.params.tarifaId;
    TarifasProveedorDb.deleteTarifaProveedor(tarifaId, function (err, tarifaProveedor) {
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

// GettarifaProveedorLineas
// devuelve el tarifaProveedor con el id pasado
router.get('/lineas/:tarifaId', function (req, res) {
    TarifasProveedorDb.getTarifaProveedorLineas(req.params.tarifaId, function (err, lineas) {
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

// GettarifaProveedorLinea
// devuelve el tarifaProveedor con el id pasado
router.get('/linea/:tarifaProveedorLineaId', function (req, res) {
    TarifasProveedorDb.getTarifaProveedorLinea(req.params.tarifaProveedorLineaId, function (err, lineas) {
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


// PosttarifaProveedorLinea
// permite dar de alta un linea de tarifaProveedor
router.post('/lineas/', function (req, res) {
    TarifasProveedorDb.postTarifaProveedorLinea(req.body.tarifaProveedorLinea, function (err, tarifaProveedorLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifaProveedorLinea);
        }
    });
});

//posttarifaProveedorLineaMultiple
//permite dar de alta multiples lienas de tarifaProveedor en función de la Id del grupo de articulos pasado
router.post('/lineas/multiples/', function (req, res) {
    TarifasProveedorDb.postTarifaProveedorLineaMultiple(req.body.tarifaProveedorLinea, function (err, tarifaProveedorLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifaProveedorLinea);
        }
    });
});

//posttarifaProveedorLineaMultipleTodos
//permite dar de alta multiples lienas de tarifaProveedor para todos los grupos de articulos
router.post('/lineas/multiples/todos', function (req, res) {
    TarifasProveedorDb.postTarifaProveedorLineaMultipleTodos(req.body.tarifaProveedorLinea, function (err, tarifaProveedorLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifaProveedorLinea);
        }
    });
});



// PuttarifaProveedorLinea
// modifica el tarifaProveedor con el id pasado
router.put('/lineas/:tarifaProveedorLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    TarifasProveedorDb.getTarifaProveedorLinea(req.params.tarifaProveedorLineaId, function (err, tarifaProveedorLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifaProveedorLinea == null) {
                return res.status(404).send("Linea de tarifa no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                TarifasProveedorDb.putTarifaProveedorLinea(req.params.tarifaProveedorLineaId, req.body.tarifaProveedorLinea, function (err, tarifaProveedorLinea) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tarifaProveedorLinea);
                    }
                });
            }
        }
    });
});

// DeletetarifaProveedorLinea
// elimina un tarifaProveedor de la base de datos
router.delete('/lineas/:tarifaProveedorLineaId', function (req, res) {
    var tarifaProveedorLinea = req.body.tarifaProveedorLinea;
    TarifasProveedorDb.deleteTarifaProveedorLinea(req.params.tarifaProveedorLineaId, tarifaProveedorLinea, function (err, tarifaProveedorLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;
