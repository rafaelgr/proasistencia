var express = require('express');
var router = express.Router();
var mensajesDb = require("./mensajes_db_mysql");


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
    mensajesDb.postMensaje(req.body.mensaje,function (err, servicio) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(servicio);
        }
    });
});


// Exports
module.exports = router;