var express = require('express');
var router = express.Router();
var mensajesDb = require("./mensajes_db_mysql");


router.get('/', function (req, res) {
    mensajesDb.getMensajes(function (err, mensajes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(mensajes);
        }
    });
});

router.get('/:mensajeId', function (req, res) {
    mensajesDb.getMensaje(req.params.mensajeId, function (err, mensaje) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(mensaje);
        }
    });
});

// GetMensajesUsuaio
// devuelve el mensaje con el id pasado
router.get('/usuario/:proveedorId', function(req, res) {
    mensajesDb.getMensajesUsuario(req.params.proveedorId, function(err, mensajes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(mensajes);
        }
    });
});

router.get('/proveedores/mensaje/:mensajeId', function (req, res) {
    mensajesDb.getProveedoresAsociados(req.params.mensajeId, function (err, mensaje) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(mensaje);
        }
    });
});

// postMensaje
// permite dar de alta un mensaje
router.post('/', function (req, res) {
    mensajesDb.postMensaje(req.body.mensaje,function (err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// sendpush
// Envia una notificación push
router.post('/sendPush', function (req, res) {
    mensajesDb.sendPush(req.body.mensaje, function (err, confirm) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(confirm);
        }
    });
});


// PostMensaje
// permite dar de alta un mensaje
router.post('/send', function(req, res) {
    mensajesDb.postSendMensaje(req.body.mensaje, function(err, mensaje) {
        if (err) {
            console.log("SEND (ERR): ", err);
            res.status(500).send(err.message);
        } else {
            res.json(mensaje);
        }
    });
});

// PostMensaje
// permite dar de alta un mensaje
router.post('/send/webPush', function(req, res) {
    mensajesDb.postSendMensajeWebPush( req.body.datos, function(err, mensaje) {
        if (err) {
            console.log("SEND (ERR): ", err);
            res.status(500).send(err.message);
        } else {
            res.json(mensaje);
        }
    });
});

// PutMensaje
// modifica el mensaje con el id pasado
router.put('/:mensajeId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    mensajesDb.getMensaje(req.params.mensajeId, function(err, mensaje) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (mensaje == null) {
                res.status(404).send("Mensaje no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                mensajesDb.putMensaje(req.params.mensajeId, req.body.mensaje, function(err, mensaje) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(mensaje);
                    }
                });
            }
        }
    });
});

// PutMensajeProveedor
// modifica el mensaje con el id pasado
router.put('/:mensajeId/:proveedorId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    mensajesDb.getMensajeLineaProveedor(req.params.mensajeId, req.params.proveedorId, function(err, mensaje) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (mensaje == null) {
                res.status(404).send("Mensaje no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                mensajesDb.putMensajeProveedorLinea(req.params.mensajeId, req.params.proveedorId, req.body.mensaje, function(err, mensaje) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(mensaje);
                    }
                });
            }
        }
    });
});

// DeleteMensaje
// elimina un mensaje de la base de datos
router.delete('/:mensajeId', function(req, res) {
    mensajesDb.deleteMensaje(req.params.mensajeId, function(err, mensaje) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;