var express = require('express');
var router = express.Router();
var usuariosDb = require("./usuarios_db_mysql");

// GetUsuarios
// Devuelve una lista de objetos con todos los usuarios de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos usuarios
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        usuariosDb.getUsuariosBuscar(nombre, function(err, usuarios) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(usuarios);
            }
        });

    } else {
        usuariosDb.getUsuarios(function(err, usuarios) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(usuarios);
            }
        });
    }
});

// GetUsuario
// devuelve el usuario con el id pasado
router.get('/:usuarioId', function(req, res) {
    usuariosDb.getUsuario(req.params.usuarioId, function(err, usuario) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (usuario == null) {
                res.status(404).send("Usuario no encontrado");
            } else {
                res.json(usuario);
            }
        }
    });
});

// Login
// comprueba si hay algún usuario con el login y password pasados
// si lo encuentra lo devuelve como objeto, si no devuelve nulo.
router.post('/login', function(req, res){
    usuariosDb.loginUsuarios(req.body.usuario, function(err, usuario){
        if (err){
            res.status(500).send(err.message);
        }else{
            if (usuario == null) {
                res.status(404).send("Login o contraseña incorrectos");
            } else {
                res.json(usuario);
            }
        }
    });
});

// PostUsuario
// permite dar de alta un usuario
router.post('/', function(req, res) {
    usuariosDb.postUsuario(req.body.usuario, function(err, usuario) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(usuario);
        }
    });
});



// PutUsuario
// modifica el usuario con el id pasado
router.put('/:usuarioId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    usuariosDb.getUsuario(req.params.usuarioId, function(err, usuario) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (usuario == null) {
                res.status(404).send("Usuario no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                usuariosDb.putUsuario(req.params.usuarioId, req.body.usuario, function(err, usuario) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(usuario);
                    }
                });
            }
        }
    });
});

// DeleteUsuario
// elimina un usuario de la base de datos
router.delete('/:usuarioId', function(req, res) {
    var usuario = req.body.usuario;
    usuariosDb.deleteUsuario(req.params.usuarioId, usuario, function(err, usuario) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;