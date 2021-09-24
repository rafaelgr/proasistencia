var express = require('express');
var router = express.Router();
var mensajesDb = require("./mensajes_db_mysql");

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


// Exports
module.exports = router;