var express = require('express');
var router = express.Router();
var serviciosDb = require("./servicios_db_mysql");

// GetServicios
// Devuelve una lista de objetos con todos los servicios de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos servicios
// que lo contengan.
router.get('/', function (req, res) {
    serviciosDb.getServicios(function (err, servicios) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(servicios);
        }
    });
});

// GetServicio
// devuelve el servicio con el id pasado
router.get('/:servicioId', function (req, res) {
    serviciosDb.getServicio(req.params.servicioId, function (err, servicio) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (servicio == null) {
                res.status(404).send("Servicio no encontrado");
            } else {
                res.json(servicio);
            }
        }
    });
});

// GetServicioComercial
// Devuelve los servicios que corresponden al comercial correspondiente
router.get('/agente/:comercialId', function (req, res) {
    serviciosDb.getServicioComercial(req.params.comercialId, function (err, servicio) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(servicio);
        }
    });
});

// GetServicioComercial
// Devuelve los servicios que corresponden al comercial correspondiente
router.get('/nuevo/numero/servicio', function (req, res) {
    serviciosDb.getSiguienteNumero(function (err, numero) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(numero);
        }
    });
});



// PostServicio
// permite dar de alta un servicio
router.post('/', function (req, res) {
    serviciosDb.postServicio(req.body.servicio,function (err, servicio) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(servicio);
        }
    });
});



// PutServicio
// modifica el servicio con el id pasado
router.put('/:servicioId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    serviciosDb.getServicio(req.params.servicioId, function (err, servicio) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (servicio == null) {
                res.status(404).send("Servicio no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                serviciosDb.putServicio(req.params.servicioId, req.body.servicio, function (err, servicio) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(servicio);
                    }
                });
            }
        }
    });
});

// DeleteServicio
// elimina un servicio de la base de datos
router.delete('/:servicioId', function (req, res) {
    var servicio = req.body.servicio;
    serviciosDb.deleteServicio(req.params.servicioId, servicio, function (err, servicio) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;