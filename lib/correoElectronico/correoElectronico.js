var nodemailer = require("nodemailer");
var cfg = require("../../configEmail.json");


var correoAPI = {


    sendCorreo: (correo, parametros, done) => {
        var transporter;
        var mailoptions;
        var attach;
        // 1- verificamos que el correo contiene asunto y texto
        if (!correo || !correo.asunto || !correo.cuerpo) {
            var err = new Error('El correo es incorrecto');
            return done(err);
        }
        //contolamos si la empresa tiene configurados los parametros de envio de correo.
        //si no los tiene cogemos los paramétros por defecto
        if(parametros.hostCorreo == null || parametros.portCorreo == null || parametros.secureCorreo == null
            || parametros.usuCorreo == null || parametros.passCorreo == null || 
            parametros.hostCorreo == "" || parametros.usuCorreo == "") {
            
                transporter = nodemailer.createTransport(cfg.smtpConfig);
            
        }else {
            var smtpConfig = {
                host: parametros.hostCorreo,
                port: parametros.portCorreo,
                secure: parametros.secureCorreo,
                auth: {
                    user: parametros.usuCorreo,
                    pass: parametros.passCorreo
                }
            };
            transporter = nodemailer.createTransport(smtpConfig);
        }

        // 2- Montamos el transporte del correo basado en la
            // configuración.
            
            mailOptions = {
                from: correo.emisor,
                sender: correo.emisor,
                to: correo.destinatario,
                subject: correo.asunto,
                html: correo.cuerpo,
            //bcc: correo.emisor
            };
            if (cfg.fakeEmail && cfg.fakeEmail != "") { mailOptions.to = cfg.fakeEmail; }
            if (correo.ficheros) {
                var attachments = [];
                correo.ficheros.forEach((file) => {
                    attach = {
                        filename: file.replace(/^.*[\\\/]/, ''),
                        path: file
                    };
                    attachments.push(attach);
                });
            mailOptions.attachments = attachments;
            }

        
        
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