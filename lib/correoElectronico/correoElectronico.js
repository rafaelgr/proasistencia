const { reject } = require("async");
var nodemailer = require("nodemailer");
//var cfg = require("../../configEmail.json");




var correoAPI = {
    sendCorreo: (correo, test, parametros, proveedores, done) => {
        //recuparamos la configuracion
        var cfg = recuperaConfig();

        var transporter;
        var mailOptions;
        var attach;
        // 1- verificamos que el correo contiene asunto y texto
        if (!correo || !correo.asunto || !correo.cuerpo) {
            var err = new Error('El correo es incorrecto');
            return done(err, null);
        }
       
            
        transporter = nodemailer.createTransport(cfg.smtpConfig);
            
        // 2- Montamos el transporte del correo basado en la
            // configuración.
            
            mailOptions = {
                from: correo.emisor,
                sender: correo.emisor,
                to: correo.destinatario,
                subject: correo.asunto,
                html: correo.cuerpo,
            };
            if(proveedores) mailOptions.cc = correo.emisor;
            if(test == 'true') {
                mailOptions.to = correo.emisor;
            }
            if (cfg.fakeEmail && cfg.fakeEmail != "") { 
                mailOptions.to = cfg.fakeEmail;
                mailOptions.cc = cfg.fakeEmail;
            }
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
                return done(err,null);
            }
            done(null, info);
        });
    },

    sendCorreoNew: (correo) => {
        return new Promise(async (resolve, reject) => {
            try {
                //recuparamos la configuracion
                var cfg = recuperaConfig();

                var transporter;
                var mailOptions;
                var attach;
                // 1- verificamos que el correo contiene asunto y texto
                if (!correo || !correo.asunto || !correo.cuerpo) {
                    var err = new Error('El correo es incorrecto');
                    reject(err);
                }
               
                    
                transporter = nodemailer.createTransport(cfg.smtpConfig);
                    
                // 2- Montamos el transporte del correo basado en la
                    // configuración.
                    
                    mailOptions = {
                        from: correo.emisor,
                        sender: correo.emisor,
                        to: correo.destinatario,
                        subject: correo.asunto,
                        html: correo.cuerpo,
                    };
                    if (cfg.fakeEmail && cfg.fakeEmail != "") { 
                        mailOptions.to = cfg.fakeEmail;
                    }
                    
                // 3- Enviar el correo propiamente dicho
                transporter.sendMail(mailOptions)
                .then (result => {
                    resolve(info);
                })
                .catch( err => {
                    reject(err); 
                });

            }catch(err) {
                reject(err); 
            }
        });
        
    }
}

var recuperaConfig = function(){
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
                ciphers:'SSLv3'
            }
        },
        fakeEmail:  process.env.EMAIL_FAKE
    };
   return config; 
}

module.exports = correoAPI;