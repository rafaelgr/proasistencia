
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

    if (!correo || !correo.asunto || !correo.cuerpo) {
        return callback(new Error('El correo es incorrecto'));
    }

    var cfg = recuperaConfig();
    var transporter = nodemailer.createTransport(cfg.smtpConfig);

    var cuerpo = '';
    var mailOptions = {};

    // ------------------------------------------------
    // CORREO AL PROVEEDOR
    // ------------------------------------------------
    if (!respuesta) {

        var enlaceUrl = process.env.ARQ_CLIEN
            + "#!/loginExterno?propuestaId=" + correo.propuestaId
            + "&subcontrataId=" + correo.subcontrataId
            + "&expedienteId=" + correo.expedienteId
            + "&proveedorId=" + correo.proveedorId;

        var enlaceHtml = `
            <a href="${enlaceUrl}">
                enlace
            </a>
        `;

        cuerpo = correo.cuerpo;

        // -----------------------------
        // ENLACE
        // -----------------------------
        if (cuerpo.indexOf('{1}') !== -1) {

            // Reemplazar placeholder
            cuerpo = cuerpo.replace('{1}', enlaceHtml);

        }

        // -----------------------------
        // CONTACTOS
        // -----------------------------
        if (correo.contactos && correo.contactos.length > 0) {

            let contactos = '';

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

            cuerpo = cuerpo.replace('{2}', contactos);

        } else {
            cuerpo = cuerpo.replace(
                /<p>\s*CONTACTOS DE LA FINCA\.?\s*<\/p>\s*<p>\s*\{2\}\s*<\/p>/gi,
                ''
            );
            cuerpo = cuerpo.replace('{2}', ' ');
        }

        // -----------------------------
        // DATOS ADICIONALES
        // -----------------------------
        if (correo.datosAdicionales && correo.datosAdicionales !== '') {
            cuerpo += `
                <pre>${correo.datosAdicionales}</pre>
            `;
        }

        // -----------------------------
        // PLANTILLA HTML
        // -----------------------------
        cuerpo = plantillaCorreoPropuesta({
            titulo: correo.asunto,
            cuerpo: cuerpo
        });

        mailOptions = {
            from: cfg.emailEmisor,
            to: correo.destinatario,
            cc: cfg.emailEmisor,
            sender: cfg.emailEmisor,
            subject: correo.asunto,
            html: cuerpo
        };

        if (buffer) {
            mailOptions.attachments = [{
                filename: "oferta.pdf",
                content: buffer
            }];
        }

        if (cfg.fakeEmail && cfg.fakeEmail !== "") {
            mailOptions.to = cfg.fakeEmail;
            mailOptions.cc = cfg.fakeEmail;
        }

    }

    // ------------------------------------------------
    // RESPUESTA INTERNA
    // ------------------------------------------------
    else {

        var enlaceUrl = process.env.ARQ_CLIEN
            + "#!/top/propuestaForm?propuestaId=" + correo.propuestaId
            + "&subcontrataId=" + correo.subcontrataId
            + "&expedienteId=" + correo.expedienteId
            + "&proveedorId=" + correo.proveedorId;

        cuerpo = `
            <p>
                El proveedor 
                <strong>${correo.proveedorNombre}</strong>
                ha enviado su oferta de la propuesta
                <strong>${correo.propuestaId}</strong>.
            </p>

            <p>
                Puede verla en el siguiente
                <a href="${enlaceUrl}">enlace</a>
            </p>
        `;

        cuerpo = plantillaCorreoPropuesta({
            titulo: "Oferta recibida",
            cuerpo: cuerpo
        });

        mailOptions = {
            from: cfg.emailEmisor,
            to: [cfg.emailEmisor, cfg.email2],
            sender: cfg.emailEmisor,
            subject: correo.asunto,
            html: cuerpo
        };

        if (cfg.fakeEmail && cfg.fakeEmail !== "") {
            mailOptions.to = cfg.fakeEmail;
        }
    }

    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            return callback(err);
        }

        callback(null, 'Correo enviado');
    });
};

function plantillaCorreoPropuesta({ titulo, cuerpo, datosAdicionales }) {
    return `
        <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:20px;">
            <div style="max-width:700px;margin:0 auto;background:#fff;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
                
                <div style="background:#2f4050;color:#fff;padding:18px 24px;">
                    <h2 style="margin:0;font-size:20px;">${titulo}</h2>
                </div>

                <div style="padding:24px;color:#333;font-size:14px;line-height:1.6;">
                    ${cuerpo}

                    ${datosAdicionales ? `
                        <div style="margin-top:24px;">
                            <strong>Datos adicionales:</strong>
                            <pre style="background:#f4f4f4;padding:12px;border-radius:4px;white-space:pre-wrap;">${datosAdicionales}</pre>
                        </div>
                    ` : ''}
                </div>

                <div style="background:#eee;color:#777;padding:12px 24px;font-size:12px;text-align:center;">
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