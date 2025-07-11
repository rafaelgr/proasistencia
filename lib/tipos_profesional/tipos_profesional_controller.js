var express = require('express');
var router = express.Router();
var tiposProfesionalDb = require("./tipos_profesional_db_mysql");

// GetTiposProfesional
// Devuelve una lista de objetos con todos los formasPago de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos formasPago
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        tiposProfesionalDb.getTiposProfesionalesBuscar(nombre, function(err, tipoProfesional) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(tipoProfesional);
            }
        });

    } else {
        tiposProfesionalDb.getTiposProfesionales(function(err, tipoProfesional) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(tipoProfesional);
            }
        });
    }
});

// GetTipoProfesional
// devuelve el tipoProfesional con el id pasado
router.get('/:tipoProfesionalId', function(req, res) {
    tiposProfesionalDb.getTipoProfesional(req.params.tipoProfesionalId, function(err, tipoProfesional) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoProfesional == null) {
                return res.status(404).send("TipoProfesional no encontrado");
            } else {
                res.json(tipoProfesional);
            }
        }
    });
});

// getTipoProfesionalTarifaProveedor
// devuelve los tipoProfesionales incluidos en una tarifa de proveedor con el id pasado
router.get('/tarifa/:tarifaProveedorId', function(req, res) {
    tiposProfesionalDb.getTipoProfesionalTarifaProveedor(req.params.tarifaProveedorId, function(err, tiposProfesionales) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tiposProfesionales == null) {
                return res.status(404).send("tarifaProveedor no encontrada");
            } else {
                res.json(tiposProfesionales);
            }
        }
    });
});

// getTiposProfesionalesIndice
// devuelve los tipos Profesionales de un indice corrector con el id pasado
router.get('/indice/:indiceCorrectorId', async (req, res, next) => {
    try {
        let tipoProfesional = await tiposProfesionalDb.getTiposProfesionalesIndice(req.params.indiceCorrectorId);
        //if (tipoProfesional == null) return res.status(404).send("Tipo profesional no encontrado");
        res.json(tipoProfesional);
    } catch(err) {
        return next(res.status(500).send(err.message));
    }
});

// PostTipoProfesional
// permite dar de alta un tipoProfesional
router.post('/', function(req, res) {
    let departamentos = null;
    if(req.body.departamentos) {
        departamentos = req.body.departamentos;
    }
    tiposProfesionalDb.postTipoProfesional(req.body.tipoProfesional, departamentos, function(err, tipoProfesional) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(tipoProfesional);
        }
    });
});



// PutTipoProfesional
// modifica el tipoProfesional con el id pasado
router.put('/:tipoProfesionalId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    tiposProfesionalDb.getTipoProfesional(req.params.tipoProfesionalId, function(err, tipoProfesional) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoProfesional == null) {
                return res.status(404).send("TipoProfesional no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                let departamentos = null;
                if(req.body.departamentos) {
                    departamentos = req.body.departamentos;
                }
                tiposProfesionalDb.putTipoProfesional(req.params.tipoProfesionalId, req.body.tipoProfesional, departamentos, function(err, tipoProfesional) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(tipoProfesional);
                    }
                });
            }
        }
    });
});

// DeleteTipoProfesional
// elimina un tipoProfesional de la base de datos
router.delete('/:tipoProfesionalId', function(req, res) {
    tiposProfesionalDb.deleteTipoProfesional(req.params.tipoProfesionalId, function(err, tipoProfesional) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// GetTipoProfesional
// devuelve el tipoProfesional con el id pasado
router.get('/departamentos/:tipoProfesionalId', function(req, res) {
    tiposProfesionalDb.getTipoProfesionalDepartamentos(req.params.tipoProfesionalId, function(err, tipoProfesional) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoProfesional == null) {
                return res.status(404).send("Tipo Profesional no encontrado");
            } else {
                res.json(tipoProfesional);
            }
        }
    });
});


// GetTipoProfesional
// devuelve el tipoProfesional con el id pasado
router.get('/departamentos/muestra/todos/', function(req, res) {
    var nombre = req.query.nombre;
    tiposProfesionalDb.getTiposProfesionalesDepartamentos(nombre, function(err, tipoProfesional) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoProfesional == null) {
                return res.status(404).send("Tipo Profesional no encontrado");
            } else {
                res.json(tipoProfesional);
            }
        }
    });
});

// GetTipoProfesional
// devuelve el tipoProfesional con el id pasado
router.get('/tipos/por/departamento/:departamentoId', function(req, res) {
    tiposProfesionalDb.getTipoProfesionalesDepartamento(req.params.departamentoId, function(err, tipoProfesional) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (tipoProfesional == null) {
                return res.status(404).send("Tipo Profesional no encontrado");
            } else {
                res.json(tipoProfesional);
            }
        }
    });
});

// Exports
module.exports = router;