var express = require('express');
var router = express.Router();
var departamentosDb = require("./departamentos_db_mysql");

// GetDepartamentos
// Devuelve una lista de objetos con todos los departamentos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos departamentos
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        departamentosDb.getDepartamentosBuscar(nombre, function(err, departamentos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(departamentos);
            }
        });

    } else {
        departamentosDb.getDepartamentos(function(err, departamentos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(departamentos);
            }
        });
    }
});



// GetDepartamento
// devuelve el departamento con el id pasado
router.get('/:departamentoId', function(req, res) {
    departamentosDb.getDepartamento(req.params.departamentoId, function(err, departamento) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (departamento == null) {
                res.status(404).send("Departamento no encontrado");
            } else {
                res.json(departamento);
            }
        }
    });
});


// GetDepartamentosUsuario
// devuelve los departamentos de un usuario con su id pasado
router.get('/usuario/:usuarioId', function(req, res) {
    departamentosDb.getDepartamentosUsuario(req.params.usuarioId, function(err, departamentos) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (departamentos == null) {
                res.status(404).send("Departamentos no encontrados");
            } else {
                res.json(departamentos);
            }
        }
    });
});


// GetDepartamentoContrato
// devuelve el departamento de un contrato
router.get('/contrato/asociado/:contratoId', function(req, res) {
    departamentosDb.getDepartamentoContrato(req.params.contratoId, function(err, departamento) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (departamento == null) {
                res.status(404).send("Departamentos no encontrados");
            } else {
                res.json(departamento[0]);
            }
        }
    });
});


// PostDepartamento
// permite dar de alta un departamento
router.post('/', function(req, res) {
    departamentosDb.postDepartamento(req.body.departamento, function(err, departamento) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(departamento);
        }
    });
});



// PutDepartamento
// modifica el departamento con el id pasado
router.put('/:departamentoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    departamentosDb.getDepartamento(req.params.departamentoId, function(err, departamento) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (departamento == null) {
                res.status(404).send("Departamento no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                departamentosDb.putDepartamento(req.params.departamentoId, req.body.departamento, function(err, departamento) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(departamento);
                    }
                });
            }
        }
    });
});

// DeleteDepartamento
// elimina un departamento de la base de datos
router.delete('/:departamentoId', function(req, res) {
    var departamento = req.body.departamento;
    departamentosDb.deleteDepartamento(req.params.departamentoId, departamento, function(err, departamento) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;