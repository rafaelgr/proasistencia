var express = require('express');
var router = express.Router();
var partesDb = require("./partes_db_mysql");

// GetPartes
// Devuelve una lista de objetos con todos los partes de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos partes
// que lo contengan.
router.get('/', function(req, res) {
    
        partesDb.getPartes(function(err, partes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(partes);
            }
        });
});

// GetParte
// devuelve el parte con el id pasado
router.get('/:parteId', function(req, res) {
    partesDb.getParte(req.params.parteId, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});


// GetParte
// devuelve las partes de un servicio
router.get('/servicio/:servicioId', function(req, res) {
    partesDb.getParteServicio(req.params.servicioId, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});

// GetParteEstado
// devuelve las partes con un estado determinado
router.get('/estado/parte/:estadoParteId', function(req, res) {
    partesDb.getPartesEstado(req.params.estadoParteId, function(err, partes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(partes);
        }
    });
});

// GetServicioComercial
// Devuelve los servicios que corresponden al comercial correspondiente
router.get('/nuevo/numero/parte/:servicioId/:numServicio', function (req, res) {
    partesDb.getSiguienteNumero(req.params.servicioId, req.params.numServicio,function (err, numero) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(numero);
        }
    });
});




// PostParte
// permite dar de alta un parte
router.post('/', function(req, res) {
    partesDb.postParte(req.body.parte, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});



// PutParte
// modifica el parte con el id pasado
router.put('/:parteId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    partesDb.getParte(req.params.parteId, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (parte == null) {
                res.status(404).send("Parte no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                partesDb.putParte(req.params.parteId, req.body.parte, function(err, parte) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(parte);
                    }
                });
            }
        }
    });
});

// DeleteParte
// elimina un parte de la base de datos
router.delete('/:parteId', function(req, res) {
   
    partesDb.deleteParte(req.params.parteId, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});



//FUNCIONES DE LINEAS 

// getLineasParte
// Devuelve las lineas de un parte correspondiente
router.get('/lineas/del/parte/servicio/:parteId', function (req, res) {
    partesDb.getLineasParte(req.params.parteId, function (err, partes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(partes);
        }
    });
});

// getLineasParte
// Devuelve una linea de un parte correspondiente
router.get('/linea/del/parte/servicio/:parteId/:lineaParteId', function (req, res) {
    partesDb.getLineaParte(req.params.parteId, req.params.lineaParteId,function (err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(parte[0]);
        }
    });
});

// PostLineaParte
// permite dar de alta una linea de  parte
router.post('/linea/:parteId', function(req, res) {
    partesDb.postLineaParte(req.body.lineaparte, req.params.parteId, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(parte);
        }
    });
});

// PutLineaParte
// modifica una linea de parte con el id pasado
router.put('/linea/:parteLineaId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    partesDb.getLineaParte(req.body.parteLinea.parteId, req.params.parteLineaId, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (parte == null) {
                res.status(404).send("Parte no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                partesDb.putLineaParte(req.params.parteLineaId, req.body.parteLinea, function(err, parte) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(parte);
                    }
                });
            }
        }
    });
});

// DeleteParte
// elimina una linea parte de la base de datos con el id pasado
router.delete('/linea/:lineaParteId', function(req, res) {
    partesDb.deleteLineaParte(req.params.lineaParteId, function(err, parte) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;