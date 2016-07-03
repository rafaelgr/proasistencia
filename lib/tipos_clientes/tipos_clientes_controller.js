var express = require('express');
var router = express.Router();
var tiposClientesDb = require("./tipos_clientes_db_mysql");

// GetTiposClientes
// Devuelve una lista de objetos con todos los tipos de clientes de la 
// base de datos.
router.get('/', function(req, res) {
    tiposClientesDb.getTiposclientes(function(err, clientes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});


// Exports
module.exports = router;
