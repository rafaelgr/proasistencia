var express = require('express');
var router = express.Router();
var tiposMantenimientosDb = require("./tipos_mantenimientos_db_mysql");

// GetTiposMantenimientos
// Devuelve una lista de objetos con todos los clientes de la 
// base de datos.
router.get('/', function(req, res) {
    tiposMantenimientosDb.getTiposMantenimientos(function(err, clientes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});


// Exports
module.exports = router;
