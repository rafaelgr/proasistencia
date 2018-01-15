var express = require('express');
var router = express.Router();
var tiposProveedorDb = require("./tipos_proveedor_db_mysql");

// GetTiposProveedor
// Devuelve una lista de objetos con todos los formasPago de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos formasPago
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        tiposProveedorDb.getTiposProveedoresBuscar(nombre, function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });

    } else {
        tiposProveedorDb.getTiposProveedor(function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });
    }
});

// GetTipoProveedor
// devuelve el tipoProveedor con el id pasado
router.get('/:tipoProveedorId', function(req, res) {
    tiposProveedorDb.getTipoProveedor(req.params.tipoProveedorId, function(err, tipoProveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoProveedor == null) {
                return res.status(404).send("TipoProveedor no encontrado");
            } else {
                res.json(tipoProveedor);
            }
        }
    });
});

// PostTipoProveedor
// permite dar de alta un tipoProveedor
router.post('/', function(req, res) {
    tiposProveedorDb.postTipoProveedor(req.body.tipoProveedor, function(err, tipoProveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tipoProveedor);
        }
    });
});



// PutTipoProveedor
// modifica el tipoProveedor con el id pasado
router.put('/:tipoProveedorId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    tiposProveedorDb.getTipoProveedor(req.params.tipoProveedorId, function(err, tipoProveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoProveedor == null) {
                return res.status(404).send("TipoProveedor no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tiposProveedorDb.putTipoProveedor(req.params.tipoProveedorId, req.body.tipoProveedor, function(err, tipoProveedor) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tipoProveedor);
                    }
                });
            }
        }
    });
});

// DeleteTipoProveedor
// elimina un tipoProveedor de la base de datos
router.delete('/:tipoProveedorId', function(req, res) {
    tiposProveedorDb.deleteTipoProveedor(req.params.tipoProveedorId, function(err, tipoProveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;