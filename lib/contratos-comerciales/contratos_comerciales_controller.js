var express = require('express');
var router = express.Router();
var contratosComercialesDb = require("./contratos_comerciales_db_mysql");

// GetContratosComerciales
// Devuelve una lista de objetos con todos los contratosComerciales de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos contratosComerciales
// que lo contengan.
router.get('/', function(req, res) {
    contratosComercialesDb.getContratosComerciales(function(err, contratosComerciales) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratosComerciales);
        }
    });
});

// GetContratoComercial
// devuelve el contrato contratoComercial con el id pasado
router.get('/:contratoComercialId', function(req, res) {
    contratosComercialesDb.getContratoComercial(req.params.contratoComercialId, function(err, contratoComercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoComercial == null) {
                return res.status(404).send("Contrato comercial no encontrado");
            } else {
                res.json(contratoComercial);
            }
        }
    });
});

// GetContratosComercial
// devuelve los constratos del comercial con el id pasado
router.get('/comercial/:comercialId', function(req, res) {
    contratosComercialesDb.getContratosComercial(req.params.comercialId, function(err, contratoComercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoComercial == null) {
                return res.status(404).send("Contrato comercial no encontrado");
            } else {
                res.json(contratoComercial);
            }
        }
    });
});


//getContratoComercialEmpresa
router.get('/comercial_empresa/:comercialId/:empresaId', function(req, res) {
    var comercialId = req.params.comercialId;
    var empresaId = req.params.empresaId;
    if (comercialId == "null") comercialId = null;
    if (empresaId == "null") empresaId = null;
    if (!comercialId && !empresaId){
        return res.status(400).send('Falta identificdor de comercial y/o empresa');
    }
    contratosComercialesDb.getContratoComercialEmpresa(comercialId, empresaId, function(err, contratoComercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoComercial == null) {
                return res.status(404).send("Contrato comercial no encontrado");
            } else {
                res.json(contratoComercial);
            }
        }
    });
});


// PostContratoComercial
// permite dar de alta un contrato contratoComercial
router.post('/', function(req, res) {
    contratosComercialesDb.postContratoComercial(req.body.contratoComercial
, function(err, contratoComercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratoComercial);
        }
    });
});

// PostUpcContratoComercial
// permite dar de alta un contrato contratoComercial
// y actualizar en el resto de empresas 
router.post('/upc/', function(req, res) {
    contratosComercialesDb.postUpcContratoComercial(req.body.contratoComercial
, function(err, contratoComercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratoComercial);
        }
    });
});

// PutContratoComercial
// modifica el contrato comercial con el id pasado
router.put('/:contratoComercialId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    contratosComercialesDb.getContratoComercial(req.params.contratoComercialId, function(err, contratoComercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoComercial == null) {
                return res.status(404).send("Contrato comercial no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                contratosComercialesDb.putContratoComercial(req.params.contratoComercialId, req.body.contratoComercial, function(err, contratoComercial) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(contratoComercial);
                    }
                });
            }
        }
    });
});

// PutUpcContratoComercial
// modifica el contrato comercial con el id pasado
// y actualiza el resto de empresas
router.put('/upc/:contratoComercialId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    contratosComercialesDb.getContratoComercial(req.params.contratoComercialId, function(err, contratoComercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoComercial == null) {
                return res.status(404).send("Contrato comercial no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                contratosComercialesDb.putUpcContratoComercial(req.params.contratoComercialId, req.body.contratoComercial, function(err, contratoComercial) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(contratoComercial);
                    }
                });
            }
        }
    });
});


// DeleteContratoComercial
// elimina un contratoComercial de la base de datos
router.delete('/:contratoComercialId', function(req, res) {
    var contratoComercial = req.body.contratoComercial;
    contratosComercialesDb.deleteComercial(req.params.contratoComercialId, contratoComercial, function(err, contratoComercial) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;
