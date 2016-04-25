//=======================================
// Proasistencia (index.js)
// API to communicate to PROASISTENCIA
//========================================
// Author: Rafael Garcia (rafa@myariadna.com)
// 2015 [License CC-BY-NC-4.0]


// required modules
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var serveIndex = require('serve-index');

// api support
var usuarios_router = require('./lib/usuarios/usuarios_controller');
var version_router = require('./lib/version/version_controller');
var empresas_router = require('./lib/empresas/empresas_controller');
var sqlany_router = require('./lib/sqlany/sqlany_controller');

// read app parameters (host and port for the API)
var config = require('./config.json');


// starting express
var app = express();
// to parse body content
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// using cors for cross class
app.use(cors());

// servidor html estático
app.use(express.static(__dirname+"/public"));
app.use('/ficheros', serveIndex(__dirname + '/public/ficheros',{'icons': true, 'view': 'details'}));



// mounting routes
var router = express.Router();

// -- common to all routes
router.use(function(req, res, next) {
    // go on (by now)
    next();
});


// -- general GET (to know if the server is up and runnig)
router.get('/', function(req, res) {
    res.json('PROASISTENCIA API / SERVER -- runnig');
});

// -- registering routes
app.use('/api', router);
app.use('/api/usuarios', usuarios_router);
app.use('/api/version', version_router);
app.use('/api/empresas', empresas_router);
app.use('/api/sqlany', sqlany_router);

// -- start server
app.listen(config.apiPort);

// -- console message
console.log('PROASISTENCIA API / SERVER on port: ' + config.apiPort);
