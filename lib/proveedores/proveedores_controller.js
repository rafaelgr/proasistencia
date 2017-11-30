var express = require('express');
var router = express.Router();
var proveedoresDb = require("./Proveedores_db_mysql");

// GetProveedores
// Devuelve una lista de objetos con todos los Proveedores de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos Proveedores
// que lo contengan.
router.get('/', function (req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        proveedoresDb.getProveedores(nombre, function (err, proveedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(proveedores);
            }
        });

    } else {
        proveedoresDb.getProveedores('*', function (err, proveedores) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(proveedores);
            }
        });
    }
});


// Getproveedor
// devuelve el proveedor con el id pasado
router.get('/:proveedorId', function (req, res) {
    proveedoresDb.getProveedorById(req.params.proveedorId, function (err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (proveedor == null) {
                return res.status(404).send("proveedor no encontrado");
            } else {
                res.json(proveedor);
            }
        }
    });
});

// Postproveedor
// permite dar de alta un proveedor
router.post('/', function (req, res) {
    proveedoresDb.postProveedor(req.body.proveedor, function (err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(proveedor);
        }
    });
});



// Putproveedor
// modifica el proveedor con el id pasado
router.put('/:proveedorId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    proveedoresDb.getProveedor(req.params.proveedorId, function (err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (proveedor == null) {
                return res.status(404).send("proveedor no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                proveedoresDb.putProveedor(req.params.proveedorId, req.body.proveedor, function (err, proveedor) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(proveedor);
                    }
                });
            }
        }
    });
});

// Deleteproveedor
// elimina un proveedor de la base de datos
router.delete('/:proveedorId', function (req, res) {
    var proveedor = req.body.proveedor;
    proveedoresDb.deleteProveedor(req.params.proveedorId, proveedor, function (err, proveedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;