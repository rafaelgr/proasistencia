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



// Exports
module.exports = router;