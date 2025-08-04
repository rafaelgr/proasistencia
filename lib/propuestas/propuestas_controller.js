var express = require('express');
var router = express.Router();
var propuestasDb = require("./propuestas_db_mysql");
var nodemailer = require("nodemailer");

router.get('/:propuestaId', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuesta(req.params.propuestaId);
        if (propuestas == null) return res.status(404).send("Propuesta no encontrada");
        res.json(propuestas);

    } catch (err) {
        return next(res.status(500).send(err.message));
    }
});

router.get('/subcontrata/:subcontrataId', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuestasSubcontrata(req.params.subcontrataId);
        if (propuestas == null) return res.status(404).send("Propuestas no encontradas");
        res.json(propuestas);

    } catch (err) {
        return next(res.status(500).send(err.message));
    }
});

router.get('/lineas/:propuestaId', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuestaLineas(req.params.propuestaId);
        if (propuestas == null) return res.status(404).send("Propuestas no encontradas");
        res.json(propuestas);

    } catch (err) {
        return next(res.status(500).send(err.message));
    }
});

router.get('/expediente/:expedienteId/:ganadora', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuestasExpediente(req.params.expedienteId, req.params.ganadora);
        if (propuestas == null) return res.status(404).send("Propuestas no encontradas");
        res.json(propuestas);

    } catch (err) {
        return next(res.status(500).send(err.message));
    }
});

router.post('/:subContrataId', async (req, res, next) => {
    try {
        var propuesta = req.body.propuesta;
        var subContrataId = req.params.subContrataId;
        if (!propuesta) return res.status(400).send('No se ha enviado nada.');
        let nuevaPropuesta = await propuestasDb.postPropuestaLineas(propuesta, subContrataId);
        return res.json(nuevaPropuesta);

    } catch (err) {
        return next(res.status(500).send(err.message));
    }

});

router.put('/', async (req, res, next) => {
    try {
        var propuesta = req.body.propuesta;
        if (!propuesta) return res.status(400).send('No se ha enviado nada.');
        let result = await propuestasDb.putPropuestaLineas(propuesta);
        return res.json(result);
    } catch (err) {
        return next(res.status(500).send(err.message));
    }

});


router.put('/correo', async (req, res, next) => {
    try {
        var propuesta = req.body.propuesta;
        var correo = req.body.correo;
        var respuesta = true;
        if (!propuesta) return res.status(400).send('No se ha enviado nada.');
        let result = await propuestasDb.putPropuestaLineas(propuesta);
        if (result) {
            postCorreo(correo, respuesta, function (err, respuesta) {
                if (err) {
                    console.log("ERROR CORREO: " + err.message);
                    return res.status(500).send(err.message);
                }
                res.json(respuesta);
            });

        }
        return res.json(result);
    } catch (err) {
        return next(res.status(500).send(err.message));
    }

});


router.delete('/:propuestaId', async (req, res, next) => {
    try {
        var propuestaId = req.params.propuestaId;
        if (!propuestaId) return res.status(400).send('Falta el identidicador de la propuesta.');
        let result = await propuestasDb.deletePropuestaLineas(propuestaId);
        return res.json(result);
    } catch (err) {
        return next(res.status(500).send(err.message));
    }

});


router.delete('/lineas/:propuestaLineaId/:propuestaId', async (req, res, next) => {
    try {
        var propuestaLineaId = req.params.propuestaLineaId;
        var propuestaId = req.params.propuestaId;
        if (!propuestaLineaId) return res.status(400).send('Falta el identidicador de la linea.');
        let result = await propuestasDb.deletePropuestaLinea(propuestaLineaId, propuestaId);
        return res.json(result);
    } catch (err) {
        return next(res.status(500).send(err.message));
    }

});

//envio correo 

router.post('/envia/correo', function (req, res) {
    var correo = req.body.data;
    var respuesta = false
    if (!correo) return res.status(400).send('Debe incluir un objeto de correo en el cuerpo del mensaje');
    postCorreo(correo, respuesta, function (err, respuesta) {
        if (err) {
            console.log("ERROR CORREO: " + err.message);
            return res.status(500).send(err.message);
        }
        res.json(respuesta);
    });
});

var postCorreo = function (correo, respuesta, callback) {
    // 1- verificamos que el correo contiene asunto y texto
    if (!correo || !correo.asunto || !correo.cuerpo) {
        var err = new Error('El correo es incorrecto');
        return callback(err);
    }
    if (!respuesta) {
        //añadimos el enlace
        var enlace = "<a href=" + process.env.ARQ_CLIEN + "#!/loginExterno?propuestaId=" + correo.propuestaId + "&subcontrataId=" + correo.subcontrataId + "&expedienteId=" + correo.expedienteId + "&proveedorId=" + correo.proveedorId + "> enlace</a>"
        let cuerpo = correo.cuerpo.replace('{1}', enlace)
        //recuparamos la configuracion
        var cfg = recuperaConfig();
        // 2- Montamos el transporte del correo basado en la
        // configuración.
        var transporter = nodemailer.createTransport(cfg.smtpConfig);
        var mailOptions = {
            from: cfg.emailEmisor,
            to: correo.destinatario,
            sender: cfg.emailEmisor,
            subject: correo.asunto,
            html: cuerpo
        };
        if (cfg.fakeEmail && cfg.fakeEmail != "") {
            mailOptions.to = cfg.fakeEmail;
        }
    } else {
        //añadimos el enlace
        var enlace = "<a href=" + process.env.ARQ_CLIEN + "#!/top/propuestaForm?propuestaId=" + correo.propuestaId + "&subcontrataId=" + correo.subcontrataId + "&expedienteId=" + correo.expedienteId + "&proveedorId=" + correo.proveedorId + "> enlace</a>"
        let cuerpo = "<P>El proveedor " + correo.proveedorNombre + " He enviado su oferta de la propuesta " + correo.propuestaId + " la puede ver en el siguiente  " + enlace + "</p>"
        //recuparamos la configuracion
        var cfg = recuperaConfig();
        // 2- Montamos el transporte del correo basado en la
        // configuración.
        var transporter = nodemailer.createTransport(cfg.smtpConfig);
        var mailOptions = {
            from: cfg.emailEmisor,
            to:  [ cfg.emailEmisor, cfg.email2 ],
            sender: cfg.emailEmisor,
            subject: correo.asunto,
            html: cuerpo
        };
        if (cfg.fakeEmail && cfg.fakeEmail != "") {
            mailOptions.to = cfg.fakeEmail;
        }
    }

    // 3- Enviar el correo propiamente dicho
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            return callback(err);
        }
        callback(null, 'Correo enviado');
    });
}


var recuperaConfig = function () {
    var config = {
        smtpConfig: {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        },
        emailEmisor: process.env.EMAIL_ARQ,
        email2 :process.env.EMAIL_ARQ2,
        fakeEmail: process.env.EMAIL_FAKE
    };
    return config;
}


// Exports
module.exports = router;