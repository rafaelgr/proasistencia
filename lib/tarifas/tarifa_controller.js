

var express = require('express');
var router = express.Router();
var tarifasDb = require("./tarifas_db_mysql");

// GetTarifas
// Devuelve una lista de objetos con todos los tarifas de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos tarifas
// que lo contengan.
router.get('/', function (req, res) {
    tarifasDb.getTarifas(function (err, tarifas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifas);
        }
    });
});


// GetTarifa
// devuelve el tarifa con el id pasado
router.get('/:tarifaId', function (req, res) {
    tarifasDb.getTarifa(req.params.tarifaId, function (err, tarifa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifa == null) {
                return res.status(404).send("Tarifa no encontrado");
            } else {
                res.json(tarifa);
            }
        }
    });
});

// GetArticuloTarifa
// devuelve la linea de tarifa con el id del articulo  y la id de la tar4ifa pasadade un articulo pasado
router.get('/articulo/:articuloId/:tarifaId', function (req, res) {
    tarifasDb.getArticuloTarifa(req.params.articuloId, req.params.tarifaId, function (err, tarifa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifa == null) {
                return res.status(404).send("Tarifa no encontrado");
            } else {
                res.json(tarifa);
            }
        }
    });
});

//Devuelve todos las tarifas que pertevezcana un grupo
router.get('/grupo/todos/lineas/:grupoId/', function (req, res) {
    tarifasDb.getTarifasGrupo(req.params.grupoId, function (err, tarifas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifas == null) {
                return res.status(404).send("Tarifas no encontradas");
            } else {
                res.json(tarifas);
            }
        }
    });
});



// PostTarifa
// permite dar de alta un tarifa
router.post('/', function (req, res) {
    tarifasDb.postTarifa(req.body.tarifa, function (err, tarifa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifa);
        }
    });
});



// PutTarifa
// modifica el tarifa con el id pasado
router.put('/:tarifaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    tarifasDb.getTarifa(req.params.tarifaId, function (err, tarifa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifa == null) {
                return res.status(404).send("Tarifa no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tarifasDb.putTarifa(req.params.tarifaId, req.body.tarifa, function (err, tarifa) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tarifa);
                    }
                });
            }
        }
    });
});



// DeleteTarifa
// elimina un tarifa de la base de datos
router.delete('/:tarifaId', function (req, res) {
    var tarifaId = req.params.tarifaId;
    tarifasDb.deleteTarifa(tarifaId, function (err, tarifa) {
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

// GetNextTarifaLine
// devuelve el tarifa con el id pasado
router.get('/nextlinea/:tarifaId', function (req, res) {
    tarifasDb.getNextTarifaLineas(req.params.tarifaId, function (err, tarifa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifa == null) {
                return res.status(404).send("tarifa no encontrado");
            } else {
                res.json(tarifa);
            }
        }
    });
});

// GetTarifaLineas
// devuelve el tarifa con el id pasado
router.get('/lineas/:tarifaId', function (req, res) {
    tarifasDb.getTarifaLineas(req.params.tarifaId, function (err, lineas) {
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

// GetTarifaLinea
// devuelve el tarifa con el id pasado
router.get('/linea/:tarifaLineaId', function (req, res) {
    tarifasDb.getTarifaLinea(req.params.tarifaLineaId, function (err, lineas) {
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


// PostTarifaLinea
// permite dar de alta un linea de tarifa
router.post('/lineas/', function (req, res) {
    tarifasDb.postTarifaLinea(req.body.tarifaLinea, function (err, tarifaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tarifaLinea);
        }
    });
});



// PutTarifaLinea
// modifica el tarifa con el id pasado
router.put('/lineas/:tarifaLineaId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    tarifasDb.getTarifaLinea(req.params.tarifaLineaId, function (err, tarifaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tarifaLinea == null) {
                return res.status(404).send("Linea de tarifa no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tarifasDb.putTarifaLinea(req.params.tarifaLineaId, req.body.tarifaLinea, function (err, tarifaLinea) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tarifaLinea);
                    }
                });
            }
        }
    });
});

// DeleteTarifaLinea
// elimina un tarifa de la base de datos
router.delete('/lineas/:tarifaLineaId', function (req, res) {
    var tarifaLinea = req.body.tarifaLinea;
    tarifasDb.deleteTarifaLinea(req.params.tarifaLineaId, tarifaLinea, function (err, tarifaLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;
