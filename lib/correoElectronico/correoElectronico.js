var nodemailer = require("nodemailer");
var cfg = require("../../configEmail.json");

var correoAPI = {
    sendCorreo: (correo, done) => {
        // 1- verificamos que el correo contiene asunto y texto
        if (!correo || !correo.asunto || !correo.cuerpo) {
            var err = new Error('El correo es incorrecto');
            return done(err);
        }
        // 2- Montamos el transporte del correo basado en la
        // configuración.
        var transporter = nodemailer.createTransport(cfg.smtpConfig);
        var mailOptions = {
            from: correo.emisor,
            sender: correo.emisor,
            to: "rafael.garcia@ariadnasoftware.com",
            subject: correo.asunto,
            html: correo.cuerpo
        };
        // 3- Enviar el correo propiamente dicho
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                return done(err);
            }
            done(null, 'OK');
        });
    }
}
module.exports = correoAPI;