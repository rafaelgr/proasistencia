var express = require('express');
var router = express.Router();
var tiposComercialesDb = require("./tipos_comerciales_db_mysql");

// GetTiposComerciales
// Devuelve una lista de objetos con todos los clientes de la 
// base de datos.
router.get('/', function(req, res) {
    tiposComercialesDb.getTiposComerciales(function(err, tiposColaborador) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tiposColaborador);
        }
    });
});

router.get('/:tipoComercialId', function(req, res) {
    tiposComercialesDb.getTipoComercial(req.params.tipoComercialId, function(err, tipoColaborador) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tipoColaborador);
        }
    });
});

// Exports
module.exports = router;
