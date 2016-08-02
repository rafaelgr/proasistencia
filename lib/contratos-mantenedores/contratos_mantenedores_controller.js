var express = require('express');
var router = express.Router();
var contratosMantenedoresDb = require("./contratos_mantenedores_db_mysql");

// GetContratosMantenedores
// Devuelve una lista de objetos con todos los contratosMantenedores de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos contratosMantenedores
// que lo contengan.
router.get('/', function(req, res) {
    contratosMantenedoresDb.getContratosMantenedores(function(err, contratosMantenedores) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratosMantenedores);
        }
    });
});

// GetContratoMantenedor
// devuelve el contrato contratoMantenedor con el id pasado
router.get('/:contratoMantenedorId', function(req, res) {
    contratosMantenedoresDb.getContratoMantenedor(req.params.contratoMantenedorId, function(err, contratoMantenedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoMantenedor == null) {
                return res.status(404).send("Contrato comercial no encontrado");
            } else {
                res.json(contratoMantenedor);
            }
        }
    });
});

//getContratoMantenedorEmpresa
router.get('/mantenedor_empresa/:comercialId/:empresaId', function(req, res) {
    var comercialId = req.params.comercialId;
    var empresaId = req.params.empresaId;
    if (comercialId == "null") comercialId = null;
    if (empresaId == "null") empresaId = null;
    if (!comercialId && !empresaId){
        return res.status(400).send('Falta identificdor de mantenedor y/o empresa');
    }
    contratosMantenedoresDb.getContratoMantenedorEmpresa(comercialId, empresaId, function(err, contratoComercial) {
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

// PostContratoMantenedor
// permite dar de alta un contrato contratoMantenedor
router.post('/', function(req, res) {
    contratosMantenedoresDb.postContratoMantenedor(req.body.contratoMantenedor
, function(err, contratoMantenedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(contratoMantenedor);
        }
    });
});



// PutContratoMantenedor
// modifica el contrato comercial con el id pasado
router.put('/:contratoMantenedorId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    contratosMantenedoresDb.getContratoMantenedor(req.params.contratoMantenedorId, function(err, contratoMantenedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (contratoMantenedor == null) {
                return res.status(404).send("Contrato comercial no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                contratosMantenedoresDb.putContratoMantenedor(req.params.contratoMantenedorId, req.body.contratoMantenedor, function(err, contratoMantenedor) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(contratoMantenedor);
                    }
                });
            }
        }
    });
});

// DeleteContratoMantenedor
// elimina un contratoMantenedor de la base de datos
router.delete('/:contratoMantenedorId', function(req, res) {
    var contratoMantenedor = req.body.contratoMantenedor;
    contratosMantenedoresDb.deleteMantenedor(req.params.contratoMantenedorId, contratoMantenedor, function(err, contratoMantenedor) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;
