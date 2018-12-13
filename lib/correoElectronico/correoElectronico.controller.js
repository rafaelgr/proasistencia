var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
//var cfg = require("../../configEmail.json");

//  leer la configurción de .env
var config = require('dotenv');
config.config();



router.post('/', function (req, res) {
    var correo = req.body;
    if (!correo) return res.status(400).send('Debe incluir un objeto de correo en el cuerpo del mensaje');
    postCorreo(correo, function (err, respuesta) {
        if (err) {
            console.log("ERROR CORREO: " + err.message);
            return res.status(500).send(err.message);
        }
        res.json(respuesta);
    });
});

var postCorreo = function (correo, callback) {
    // 1- verificamos que el correo contiene asunto y texto
    if (!correo || !correo.asunto || !correo.texto) {
        var err = new Error('El correo es incorrecto');
        return callback(err);
    }
    //recuparamos la configuracion
    var cfg = recuperaConfig();
    // 2- Montamos el transporte del correo basado en la
    // configuración.
    var transporter = nodemailer.createTransport(cfg.smtpConfig);
    var mailOptions = {
        from: correo.emisor,
        to: correo.destinatario,
        subject: correo.asunto,
        text: correo.cuerpo
    };
    // 3- Enviar el correo propiamente dicho
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            return callback(err);
        }
        callback(null, 'Correo enviado');
    });
}


var recuperaConfig = function(){
    var smtpConfig = {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    };
   return smtpConfig; 
}


module.exports = router;