var express = require('express');
var router = express.Router();
var contactosExpedienteDb = require("./contactos_expedientes_db_mysql");

// GetContactosExpedientes
// Devuelve una lista de objetos con todos los locales de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos locales
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        contactosExpedienteDb.getContactosExpedientesBuscar(nombre, function(err, localesAfectados) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(localesAfectados);
            }
        });

    } else {
        contactosExpedienteDb.getContacto(function(err, localesAfectados) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(localesAfectados);
            }
        });
    }
});

// GetContactoExpediente
// devuelve el contactoExpediente con el id pasado
router.get('/:contactoExpedienteId', function(req, res) {
    contactosExpedienteDb.getContacto(req.params.contactoExpedienteId, function(err, contactoExpediente) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (contactoExpediente == null) {
                res.status(404).send("Local no encontrado");
            } else {
                res.json(contactoExpediente);
            }
        }
    });
});

// GetContactosExpedientesServicio
// devuelve los locales afectados de un servicio determinado
router.get('/contactos/:expedienteId', function(req, res) {
    contactosExpedienteDb.getContactosExpediente(req.params.expedienteId, function(err, localesAfectados) {
        if (err) {
            res.status(500).send(err.message);
        } else {
                res.json(localesAfectados);
        }
    });
});






// PostContactoExpediente
// permite dar de alta un contactoExpediente
router.post('/', function(req, res) {
    contactosExpedienteDb.postContactoExpediente(req.body.contactoExpediente, function(err, contactoExpediente) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(contactoExpediente);
        }
    });
});






// PutContactoExpediente
// modifica el contactoExpediente con el id pasado
router.put('/:contactoExpedienteId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    contactosExpedienteDb.getContacto(req.params.contactoExpedienteId, function(err, contactoExpediente) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (contactoExpediente == null) {
                res.status(404).send("Local no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                contactosExpedienteDb.putContactoExpediente(req.params.contactoExpedienteId, req.body.contactoExpediente, function(err, contactoExpediente) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(contactoExpediente);
                    }
                });
            }
        }
    });
});

// DeleteContactoExpediente
// elimina un contactoExpediente de la base de datos
router.delete('/:contactoExpedienteId', function(req, res) {
    var contactoExpediente = req.body.contactoExpediente;
    contactosExpedienteDb.deleteContactoExpediente(req.params.contactoExpedienteId, contactoExpediente, function(err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});


// Exports
module.exports = router;