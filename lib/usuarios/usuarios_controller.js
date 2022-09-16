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

// GetUsuarioDepartamentoTrabajo
// devuelve el usuario con el dfepartamento trabjo pasado
router.get('/departamento/trabajo/:departamentoTrabjoId', function(req, res) {
    usuariosDb.getUsuarioDepartamentoTrabajo(req.params.departamentoTrabjoId, function(err, usuario) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (usuario == null) {
               res.json(null);
            } else {
                res.json(usuario);
            }
        }
    });
});

// getUsuarioDepartamentos
// devuelve los departamentos asociados a un usuario con su id pasada
router.get('/departamentos/:usuarioId', function(req, res) {
    usuariosDb.getUsuarioDepartamentos(req.params.usuarioId, function(err, departamentos) {
        if (err) {
            res.status(500).send(err.message);
        } else {
           
                res.json(departamentos);
            
        }
    });
});

// getUsuarioDepartamento
// devuelve un registro de la tabla usuarios_departamentos con su id pasada
router.get('/departamento/buscar/:usuarioDepartamentoId', function(req, res) {
    usuariosDb.getUsuarioDepartamento(req.params.usuarioDepartamentoId, function(err, departamento) {
        if (err) {
            res.status(500).send(err.message);
        } else {

            if (departamento == null) {
                res.status(404).send("Usuario no encontrado");
            } else {
                res.json(departamento);
            
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

// PostUsuarioDepartamento
// permite dar de alta un registro de la tabla usuarios_departamentos
router.post('/departamento', function(req, res) {
    usuariosDb.postUsuarioDepartamento(req.body.departamento, function(err, departamento) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(departamento);
        }
    });
});



// PutUsuario
// modifica el usuario con el id pasado
router.put('/:usuarioId', function(req, res) {
    usuariosDb.putUsuario(req.params.usuarioId, req.body.usuario, function(err, usuario) {
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
});



// putUsuarioDepartamento
// modifica un registro de la tabla usuarios_departamentos con el id pasado
router.put('/departamento/:usuarioDepartamentoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    usuariosDb.getUsuarioDepartamento(req.params.usuarioDepartamentoId, function(err, usuarioDepartamento) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (usuarioDepartamento == null) {
                res.status(404).send("Departamento no encontrado");
            } else {
                usuariosDb.getUsuarioDepartamentoTrabajo(usuarioDepartamento.departamentoId, usuarioDepartamento.usuarioId,function(err, user) {
                    if (err) res.status(500).send(err.message);
                    if(user) {// si el usuario tiene ese departamento de trabajo lo actualizamos
                        var usuario = {
                            departamentoTrabajo: req.body.departamento.departamentoId
                        }
                        usuariosDb.putUsuarioDepartamentoTrabajo(usuarioDepartamento.usuarioId, usuario, function(err, usuario) {
                            if (err) {
                                res.status(500).send(err.message);
                                return;
                            }
                            usuariosDb.putUsuarioDepartamento(req.params.usuarioDepartamentoId, req.body.departamento, function(err, departamento) {
                                if (err) {
                                    res.status(500).send(err.message);
                                } else {
                                    res.json(departamento);
                                }
                            });
    
                        });
                    } else {// el departamento borrado no es el de trabajo, entonces simplemente lo actualizamos
                       // ya sabemos que existe y lo intentamos modificar.
                       usuariosDb.putUsuarioDepartamento(req.params.usuarioDepartamentoId, req.body.departamento, function(err, departamento) {
                            if (err) {
                                res.status(500).send(err.message);
                            } else {
                                res.json(departamento);
                            }
                        });
                    }
            
                });
                
            }
        }
    });
});


// PutUsuarioDepartamentoTrabajo
// modifica el departamento de gtrabajo de un usuario con el id pasado
router.put('/departamento/trabajo/:usuarioId', function(req, res) {
    usuariosDb.putUsuarioDepartamentoTrabajo(req.params.usuarioId, req.body.usuario, function(err, usuario) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(usuario);
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

// DeleteUsuarioDepartamento
// elimina un registro de la tabla usuario_departamentos
router.delete('/departamento/:usuarioDepartamentoId', function(req, res) {
    //comprobamos si el depertamento de trabajo es el que se está borrando
    usuariosDb.getUsuarioDepartamento(req.params.usuarioDepartamentoId, function(err, departamento) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            usuariosDb.getUsuarioDepartamentoTrabajo(departamento.departamentoId, departamento.usuarioId,function(err, usuario) {
                if (err) res.status(500).send(err.message);
                if(usuario) {// si el usuario tiene ese departamento de trabajo lo establecemos a 0 (TODOS)
                    var usuario = {
                        departamentoTrabajo: 0
                    }
                    usuariosDb.putUsuarioDepartamentoTrabajo(departamento.usuarioId, usuario, function(err, usuario) {
                        if (err) {
                            res.status(500).send(err.message);
                            return;
                        }
                        usuariosDb.deleteUsuarioDepartamento(req.params.usuarioDepartamentoId, function(err, usuario) {//borramos el departamento asociado
                            if (err) {
                                res.status(500).send(err.message);
                            } else {
                                res.json(null);
                            }
                        });

                    });
                } else {// el departamento borrado no es el de trabajo, entonces simplemente lo actualizamos
                    usuariosDb.deleteUsuarioDepartamento(req.params.usuarioDepartamentoId, function(err, usuario) {
                        if (err) {
                            res.status(500).send(err.message);
                        } else {
                            res.json(null);
                        }
                    });
                }
        
            });
        
        }
    });
});


// Exports
module.exports = router;