var express = require('express');
var router = express.Router();
var formasPagoDb = require("./formas_pago_db_mysql");

// GetFormasPago
// Devuelve una lista de objetos con todos los formasPago de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos formasPago
// que lo contengan.
router.get('/', function (req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        formasPagoDb.getFormasPagoBuscar(nombre, function (err, formasPago) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(formasPago);
            }
        });

    } else {
        formasPagoDb.getFormasPago(function (err, formasPago) {
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
router.get('/:formaPagoId', function (req, res) {
    formasPagoDb.getFormaPago(req.params.formaPagoId, function (err, formaPago) {
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

router.get('/codcontable/siguiente', function (req, res) {
    formasPagoDb.getSiguienteCodigoContable(function (err, codigo) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(codigo);
    });
});

// PostFormaPago
// permite dar de alta un formaPago
router.post('/', function (req, res) {
    formasPagoDb.postFormaPago(req.body.formaPago, function (err, formaPago) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(formaPago);
        }
    });
});



// PutFormaPago
// modifica el formaPago con el id pasado
router.put('/:formaPagoId', function (req, res) {
    // antes de modificar comprobamos que el objeto existe
    formasPagoDb.getFormaPago(req.params.formaPagoId, function (err, formaPago) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (formaPago == null) {
                return res.status(404).send("FormaPago no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                formasPagoDb.putFormaPago(req.params.formaPagoId, req.body.formaPago, function (err, formaPago) {
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
router.delete('/:formaPagoId', function (req, res) {
    var formaPago = req.body.formaPago;
    formasPagoDb.deleteFormaPago(req.params.formaPagoId, formaPago, function (err, formaPago) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

//LINEAS

// GetLineasFormaPago
// devuelve las lineas de una forma de pago
router.get('/linea/:formaPagoId', function (req, res) {
    formasPagoDb.getFormaPagoLineas(req.params.formaPagoId, function (err, formaPago) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(formaPago);
        }
    });
});

// GetLineaFormaPago
// devuelve una linea de la tabla formaspago_porcentajes
router.get('/linea/porcen/:formaPagoPorcenId', function (req, res) {
    formasPagoDb.getFormaPagoLinea(req.params.formaPagoPorcenId, function (err, formaPagoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (formaPagoLinea == null) {
                return res.status(404).send("FormaPagoLinea no encontrado");
            } else {
                res.json(formaPagoLinea);
            }
        }
    });
});

// PostFormaPagoLinea
// permite dar de alta un formaPago
router.post('/linea', function (req, res) {
    formasPagoDb.postFormaPagoLineas(req.body.pagoPorcen, function (err, formaPagoLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(formaPagoLinea);
        }
    });
});

// PutFormaPago
// modifica el formaPago con el id pasado
router.put('/linea/:formaPagoPorcenId', function (req, res) {
    formasPagoDb.putFormaPagoLinea(req.params.formaPagoPorcenId,req.body.pagoPorcen, function (err, formaPago) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(formaPago);
        }
    });
});

// DeletetarifaClienteLinea
// elimina un tarifaCliente de la base de datos
router.delete('/linea/:formaPagoPorcenId', function (req, res) {
    formasPagoDb.deleteFormaPagoLinea(req.params.formaPagoPorcenId,  function (err, tarifaClienteLinea) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;