var express = require('express');
var router = express.Router();


//  leer la configurción de .env
var config = require('dotenv');
config.config();

router.get('/', function (req, res) {

    var conf = creaEnv();
    return res.json(conf);
});

var creaEnv = function() {

    var conf = {
        // host: process.env.BASE_MYSQL_HOST,
        // user: process.env.BASE_MYSQL_USER,
        // password: process.env.BASE_MYSQL_PASSWORD,
        // database: process.env.BASE_MYSQL_DATABASE,
        // port: process.env.BASE_MYSQL_PORT,

        // api_port:process.env.API_PORT,
        // sti_port:process.env.STI_PORT,
        // api_host:process.env.API_HOST,
        // dsn:process.env.dsn,
        // conta_dir:process.env.CONTA_DIR,
        // factura_dir:process.env.FACTURA_DIR,
        // reports_dir:process.env.REPORTS_DIR,
        sti_key:process.env.STI_KEY,
        // email_host:process.env.EMAIL_HOST,
        // email_port:process.env.EMAIL_PORT,
        // email_secure:process.env.EMAIL_SECURE,
        // email_user:process.env.EMAIL_USER,
    }
    return conf;
}


// Exports
module.exports = router;
