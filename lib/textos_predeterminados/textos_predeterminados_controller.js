var express = require('express');
var router = express.Router();
var textosPredeterminadosDb = require("./textos_predeterminados_db_mysql");

// GetTextosPredeterminados
// Devuelve una lista de objetos con todos los textosPredeterminados de la 
// base de datos.
// Si en la url se le pasa un texto devuelve aquellos textosPredeterminados
// que lo contengan.
router.get('/', function(req, res) {
    var texto = req.query.texto;
    if (texto) {
        textosPredeterminadosDb.getTextosPredeterminadosBuscar(texto, function(err, textosPredeterminados) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(textosPredeterminados);
            }
        });

    } else {
        textosPredeterminadosDb.getTextosPredeterminados(function(err, textosPredeterminados) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(textosPredeterminados);
            }
        });
    }
});

// GetTextoPredeterminado
// devuelve el textoPredeterminado con el id pasado
router.get('/:textoPredeterminadoId', function(req, res) {
    textosPredeterminadosDb.getTextoPredeterminado(req.params.textoPredeterminadoId, function(err, textoPredeterminado) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (textoPredeterminado == null) {
                res.status(404).send("Texto predeterminado no encontrado");
            } else {
                res.json(textoPredeterminado);
            }
        }
    });
});

// PostTextoPredeterminado
// permite dar de alta un textoPredeterminado
router.post('/', function(req, res) {
    textosPredeterminadosDb.postTextoPredeterminado(req.body.textoPredeterminado, function(err, textoPredeterminado) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(textoPredeterminado);
        }
    });
});



// PutTextoPredeterminado
// modifica el textoPredeterminado con el id pasado
router.put('/:textoPredeterminadoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    textosPredeterminadosDb.getTextoPredeterminado(req.params.textoPredeterminadoId, function(err, textoPredeterminado) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (textoPredeterminado == null) {
                res.status(404).send("Texto predeterminado no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                textosPredeterminadosDb.putTextoPredeterminado(req.params.textoPredeterminadoId, req.body.textoPredeterminado, function(err, textoPredeterminado) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(textoPredeterminado);
                    }
                });
            }
        }
    });
});

// DeleteTextoPredeterminado
// elimina un textoPredeterminado de la base de datos
router.delete('/:textoPredeterminadoId', function(req, res) {
    var textoPredeterminado = req.body.textoPredeterminado;
    textosPredeterminadosDb.deleteTextoPredeterminado(req.params.textoPredeterminadoId, textoPredeterminado, function(err, textoPredeterminado) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;