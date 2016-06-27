var express = require('express');
var router = express.Router();
var tiposFormaPagoDb = require("./tipos_forma_pago_db_mysql");

// GetTiposFormasPago
// Devuelve una lista de objetos con todos los clientes de la 
// base de datos.
router.get('/', function(req, res) {
    tiposFormaPagoDb.getTiposFormaPago(function(err, tipos) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tipos);
        }
    });
});


// Exports
module.exports = router;
