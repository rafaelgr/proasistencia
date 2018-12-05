var express = require('express');
var router = express.Router();
var grupoArticulosDb = require("./grupo_articulo_db_mysql");

// GetGrupoArticulos
// Devuelve una lista de objetos con todos los articulos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos articulos
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        grupoArticulosDb.getGrupoArticulosBuscar(nombre, function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });

    } else {
        grupoArticulosDb.getGrupoArticulos(function(err, grupos) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupos);
            }
        });
    }
});

// GetGrupoArticulo
// devuelve el grupo de articulo con el id pasado
router.get('/:grupoArticuloId', function(req, res) {
    grupoArticulosDb.getGrupoArticulo(req.params.grupoArticuloId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (grupo == null) {
                return res.status(404).send("Capitulo no encontrado");
            } else {
                res.json(grupo);
            }
        }
    });
});

// PostGrupoArticulo
// permite dar de alta un grupo de articulos
router.post('/', function(req, res) {
    //comprobamos que las cuentas contables asociadas estén en todas las bases de datos
    grupoArticulosDb.comprobarComprasVentas(req.body.grupoArticulo, function (err, result) {
        if (err) return callback(err);
        if(!result) return res.status(404).send("Alguna de las cuentas asociadas no existen en todas las contabilidades. Por favor creelas y vualva a intentarlo");
        //si todo correcto  lo intentamos crear.
        grupoArticulosDb.postGrupoArticulo(req.body.grupoArticulo, function(err, grupo) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.json(grupo);
            }
        });
    });
});



// PutGrupoArticulo
// modifica el articulo con el id pasado
router.put('/:grupoArticuloId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    grupoArticulosDb.getGrupoArticulo(req.params.grupoArticuloId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            if (grupo == null) {
                return res.status(404).send("Articulo no encontrado");
            } else {
                // ya sabemos que existe, comprobamos que las cuentas contables asociadas estén en todas las bases de datos
                grupoArticulosDb.comprobarComprasVentas(req.body.grupoArticulo, function (err, result) {
                    if (err) return callback(err);
                    if(!result) return res.status(404).send("Alguna de las cuentas asociadas no existen en todas las contabilidades. Por favor creelas y vuelva a intentarlo");
                    //si todo correcto  lo intentamos modificar.
                    grupoArticulosDb.putGrupoArticulo(req.params.grupoArticuloId, req.body.grupoArticulo, function(err, grupo) {
                        if (err) {
                            return res.status(500).send(err.message);
                        } else {
                            res.json(grupo);
                        }
                    });
                });
            }
        }
    });
});

// DeleteGrupoArticulo
// elimina un articulo de la base de datos
router.delete('/:grupoArticuloId', function(req, res) {
    grupoArticulosDb.deleteGrupoArticulo(req.params.grupoArticuloId, function(err, grupo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;