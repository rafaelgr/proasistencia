var express = require('express');
var router = express.Router();
var cuentasDb = require("./cuentas_db_mysql");


// Getcuenta
// devuelve el cuenta con el id pasado
router.get('/:cuentaId', function (req, res) {
    cuentasDb.getCuenta(req.params.cuentaId, function (err, cuenta) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(cuenta);
        }
    });
});

// Exports
module.exports = router;