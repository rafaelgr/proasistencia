
try {

} catch (e) {
    console.log(e)
}
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

router.get('/subcontrata/:subcontrataId/:esGanadora/:propuestaId', async (req, res, next) => {
    try {
        let propuestas = await propuestasDb.getPropuestasSubcontrata(req.params.subcontrataId, req.params.esGanadora, req.params.propuestaId);
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
            postCorreo(correo, respuesta, null, function (err, respuesta) {
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

router.post('/envia/correo', async function (req, res) {
    var correo = req.body.data;
    var respuesta = false
    if (!correo) return res.status(400).send('Debe incluir un objeto de correo en el cuerpo del mensaje');
    let buffer = null;
    if (correo.esEncargo) {
        buffer = await propuestasDb.generarPdfYEnviar(correo);
    } else {
        buffer = await propuestasDb.generarPdfDocumentacionYEnviar(correo);
    }
    postCorreo(correo, respuesta, buffer, function (err, respuesta) {
        if (err) {
            console.log("ERROR CORREO: " + err.message);
            return res.status(500).send(err.message);
        }
        res.json(respuesta);
    });
});

var postCorreo = function (correo, respuesta, buffer, callback) {

    // 1 - Validación básica
    if (!correo || !correo.asunto || !correo.cuerpo) {
        var err = new Error('El correo es incorrecto');
        return callback(err);
    }

    // Configuración SMTP
    var cfg = recuperaConfig();
    var transporter = nodemailer.createTransport(cfg.smtpConfig);

    let cuerpo = '';
    let mailOptions = {};

    // ----------------------------------------------------
    // CORREO AL PROVEEDOR
    // ----------------------------------------------------
    if (!respuesta) {

        // URL acceso externo
        var enlaceUrl = process.env.ARQ_CLIEN
            + "#!/loginExterno?propuestaId=" + correo.propuestaId
            + "&subcontrataId=" + correo.subcontrataId
            + "&expedienteId=" + correo.expedienteId
            + "&proveedorId=" + correo.proveedorId;

        // Contactos
        let contactos = '';

        if (correo.contactos && correo.contactos.length > 0) {

            correo.contactos.forEach(c => {

                const datos = [
                    c.contacto,
                    c.telefono1,
                    c.telefono2,
                    c.email,
                    c.observaciones
                ].filter(v => v && v.toString().trim() !== '');

                contactos += datos.join(' - ') + '<br>';
            });
        }

        // Construcción del cuerpo bonito
        cuerpo = plantillaCorreoPropuesta({
            titulo: correo.asunto,
            cuerpo: correo.cuerpo
                .replace('{1}', '')
                .replace('{2}', ''),
            enlace: enlaceUrl,
            contactos: contactos,
            datosAdicionales: correo.datosAdicionales || ''
        });

        mailOptions = {
            from: cfg.emailEmisor,
            to: correo.destinatario,
            cc: cfg.emailEmisor,
            sender: cfg.emailEmisor,
            subject: correo.asunto,
            html: cuerpo
        };

        // Adjuntar PDF si existe
        if (buffer) {
            mailOptions.attachments = [
                {
                    filename: "oferta.pdf",
                    content: buffer
                }
            ];
        }

        // Modo fake email
        if (cfg.fakeEmail && cfg.fakeEmail !== "") {
            mailOptions.to = cfg.fakeEmail;
            mailOptions.cc = cfg.fakeEmail;
        }
    }

    // ----------------------------------------------------
    // RESPUESTA DEL PROVEEDOR (correo interno)
    // ----------------------------------------------------
    else {

        // URL interna
        var enlaceUrl = process.env.ARQ_CLIEN
            + "#!/top/propuestaForm?propuestaId=" + correo.propuestaId
            + "&subcontrataId=" + correo.subcontrataId
            + "&expedienteId=" + correo.expedienteId
            + "&proveedorId=" + correo.proveedorId;

        cuerpo = plantillaCorreoPropuesta({
            titulo: "Oferta recibida",
            cuerpo:
                "<p>El proveedor <strong>" +
                correo.proveedorNombre +
                "</strong> ha enviado su oferta para la propuesta <strong>" +
                correo.propuestaId +
                "</strong>.</p>",
            enlace: enlaceUrl,
            contactos: "",
            datosAdicionales: ""
        });

        mailOptions = {
            from: cfg.emailEmisor,
            to: [cfg.emailEmisor, cfg.email2],
            sender: cfg.emailEmisor,
            subject: correo.asunto,
            html: cuerpo
        };

        // Modo fake email
        if (cfg.fakeEmail && cfg.fakeEmail !== "") {
            mailOptions.to = cfg.fakeEmail;
        }
    }

    // ----------------------------------------------------
    // ENVÍO
    // ----------------------------------------------------
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            return callback(err);
        }

        callback(null, 'Correo enviado');
    });
};
function plantillaCorreoPropuesta({ titulo, cuerpo, enlace, contactos, datosAdicionales }) {
    return `
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
            <div style="max-width:700px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #ddd;">
                
                <div style="background:#2f4050; color:#ffffff; padding:18px 24px;">
                    <h2 style="margin:0; font-size:20px;">${titulo}</h2>
                </div>

                <div style="padding:24px; color:#333333; font-size:14px; line-height:1.6;">
                    ${cuerpo}

                    <p style="margin-top:24px;">
                        <a href="${enlace}" 
                           style="background:#3276b1; color:#ffffff; padding:10px 18px; text-decoration:none; border-radius:4px; display:inline-block;">
                            Acceder a la propuesta
                        </a>
                    </p>

                    ${contactos ? `
                        <div style="margin-top:24px; padding:15px; background:#f9f9f9; border-left:4px solid #3276b1;">
                            <strong>Contactos:</strong><br>
                            ${contactos}
                        </div>
                    ` : ""}

                    ${datosAdicionales ? `
                        <div style="margin-top:24px;">
                            <strong>Datos adicionales:</strong>
                            <pre style="background:#f4f4f4; padding:12px; border-radius:4px; white-space:pre-wrap;">${datosAdicionales}</pre>
                        </div>
                    ` : ""}
                </div>

                <div style="background:#eeeeee; color:#777777; padding:12px 24px; font-size:12px;">
                    Este correo ha sido generado automáticamente.
                </div>
            </div>
        </div>
    `;
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
        email2: process.env.EMAIL_ARQ2,
        fakeEmail: process.env.EMAIL_FAKE
    };
    return config;
}


// Exports
module.exports = router;