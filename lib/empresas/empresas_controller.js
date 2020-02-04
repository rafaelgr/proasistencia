var express = require('express');
var router = express.Router();
var empresasDb = require("./empresas_db_mysql");

// GetEmpresas
// Devuelve una lista de objetos con todos los empresas de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos empresas
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        empresasDb.getEmpresasBuscar(nombre, function(err, empresas) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(empresas);
            }
        });

    } else {
        empresasDb.getEmpresas(function(err, empresas) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(empresas);
            }
        });
    }
});

// GetEmpresa
// devuelve el empresa con el id pasado
router.get('/:empresaId', function(req, res) {
    empresasDb.getEmpresa(req.params.empresaId, function(err, empresa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (empresa == null) {
                return res.status(404).send("Empresa no encontrado");
            } else {
                res.json(empresa);
            }
        }
    });
});

// GetNumSerie
// devuelve los numeros de serie de la contabilidad de una empresa
router.get('/series/:contabilidad', function(req, res) {
    empresasDb.getSeries(req.params.contabilidad, function(err, series) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (series == null) {
                return res.status(404).send("Paramametros no encontrados");
            } else {
                res.json(series);
            }
        }
    });
});

// PostEmpresa
// permite dar de alta un empresa
router.post('/', function(req, res) {
    empresasDb.postEmpresa(req.body.empresa, function(err, empresa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(empresa);
        }
    });
});



// PutEmpresa
// modifica el empresa con el id pasado
router.put('/:empresaId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    empresasDb.getEmpresa(req.params.empresaId, function(err, empresa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (empresa == null) {
                return res.status(404).send("Empresa no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                empresasDb.putEmpresa(req.params.empresaId, req.body.empresa, function(err, empresa) {
                    if (err) {
                        return res.status(500).send(err.message);
                    } else {
                        res.json(empresa);
                    }
                });
            }
        }
    });
});

// DeleteEmpresa
// elimina un empresa de la base de datos
router.delete('/:empresaId', function(req, res) {
    var empresa = req.body.empresa;
    empresasDb.deleteEmpresa(req.params.empresaId, empresa, function(err, empresa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});


//FUNCIONES RALECIONADAS CON LAS SERIES DE LAS EMPRESAS

// getSeriesEmpresa
// devuelve las series de facturación de una empresa
router.get('/empresaSerie/:empresaId', function(req, res) {
    empresasDb.getSeriesEmpresa(req.params.empresaId, function(err, empresa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (empresa == null) {
                return res.status(404).send("Empresa no encontrado");
            } else {
                res.json(empresa);
            }
        }
    });
});


// getSeriesEmpresa
// devuelve un registro de la tabla empresas_series
router.get('/empresaSerie/un/registro/:empresaSerieId', function(req, res) {
    empresasDb.getEmpresaSerie(req.params.empresaSerieId, function(err, empresa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (empresa == null) {
                return res.status(404).send("Empresa no encontrado");
            } else {
                res.json(empresa);
            }
        }
    });
});

// PostEmpresaSerie
// permite dar de alta un registro en la tabla empresas_series
router.post('/empresaSerie', function(req, res) {
    empresasDb.postEmpresaSerie(req.body.empresaSerie, function(err, empresaSerie) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(empresaSerie);
        }
    });
});


// putEmpresaSerie
// permite modoficar un registro en la tabla empresas_series
router.put('/empresaSerie/:empresaSerieId', function(req, res) {
    empresasDb.putEmpresaSerie(req.body.empresaSerie, req.params.empresaSerieId, function(err, empresaSerie) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(empresaSerie);
        }
    });
});

// DeleteEmpresa
// elimina un empresa de la base de datos
router.delete('/empresaSerie/del/contrato/:empresaSerieId', function(req, res) {
    empresasDb.deleteEmpresaSerie(req.params.empresaSerieId, function(err, empresa) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});


// Exports
module.exports = router;