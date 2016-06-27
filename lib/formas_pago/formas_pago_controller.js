var express = require('express');
var router = express.Router();
var formasPagoDb = require("./formas_pago_db_mysql");

// GetFormasPago
// Devuelve una lista de objetos con todos los formasPago de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos formasPago
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        formasPagoDb.getFormasPagoBuscar(nombre, function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });

    } else {
        formasPagoDb.getFormasPago(function(err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });
    }
});

// GetFormaPago
// devuelve el formaPago con el id pasado
router.get('/:formaPagoId', function(req, res) {
    formasPagoDb.getFormaPago(req.params.formaPagoId, function(err, formaPago) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (formaPago == null) {
                return res.status(404).send("FormaPago no encontrado");
            } else {
                res.json(formaPago);
            }
        }
    });
});

// PostFormaPago
// permite dar de alta un formaPago
router.post('/', function(req, res) {
    formasPagoDb.postFormaPago(req.body.formaPago, function(err, formaPago) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(formaPago);
        }
    });
});



// PutFormaPago
// modifica el formaPago con el id pasado
router.put('/:formaPagoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    formasPagoDb.getFormaPago(req.params.formaPagoId, function(err, formaPago) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (formaPago == null) {
                return res.status(404).send("FormaPago no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                formasPagoDb.putFormaPago(req.params.formaPagoId, req.body.formaPago, function(err, formaPago) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(formaPago);
                    }
                });
            }
        }
    });
});

// DeleteFormaPago
// elimina un formaPago de la base de datos
router.delete('/:formaPagoId', function(req, res) {
    var formaPago = req.body.formaPago;
    formasPagoDb.deleteFormaPago(req.params.formaPagoId, formaPago, function(err, formaPago) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;