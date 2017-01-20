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
var moment = require('moment');

// api support
var usuarios_router = require('./lib/usuarios/usuarios_controller');
var version_router = require('./lib/version/version_controller');
var empresas_router = require('./lib/empresas/empresas_controller');
var clientes_router = require('./lib/clientes/clientes_controller');
var comerciales_router = require('./lib/comerciales/comerciales_controller');
var sqlany_router = require('./lib/sqlany/sqlany_controller');
var tipos_comerciales_router = require('./lib/tipos_comerciales/tipos_comerciales_controller');
var tipos_mantenimientos_router = require('./lib/tipos_mantenimientos/tipos_mantenimientos_controller');
var tipos_clientes_router = require('./lib/tipos_clientes/tipos_clientes_controller');
var contratos_comerciales_router = require('./lib/contratos-comerciales/contratos_comerciales_controller');
var contratos_mantenedores_router = require('./lib/contratos-mantenedores/contratos_mantenedores_controller');
var tipos_forma_pago_router = require('./lib/tipos_forma_pago/tipos_forma_pago_controller');
var formas_pago_router = require('./lib/formas_pago/formas_pago_controller');
var tipos_iva_router = require('./lib/tipos_iva/tipos_iva_controller');
var articulos_router = require('./lib/articulos/articulos_controller');
var parametros_router = require('./lib/parametros/parametros_controller');
var prefacturas_router = require('./lib/prefacturas/prefacturas_controller');
var contratos_cliente_mantenimiento_router = require('./lib/contratos-cliente-mantenimiento/contratos_clientes_mantenimiento_controller');
var clientes_comisionistas_router = require('./lib/clientes-comisionistas/clientes_comisionistas_controller');
var contrato_mantenimiento_comisionistas_router = require('./lib/contrato-mantenimiento-comisionistas/contrato_mantenimiento_comisionistas_controller');
var grupo_articulos_router = require('./lib/grupos-articulos/grupo_articulo_controller');
var contabilidad_router = require('./lib/contabilidad/contabilidad_controller');
var unidades_router = require('./lib/unidades/unidades_controller');
var tipos_via_router = require('./lib/tipos_via/tipos_via_controller');
var motivos_baja_router = require('./lib/motivos_baja/motivos_baja_controller');
var facturas_router = require('./lib/facturas/facturas_controller');

var informes_router = require('./lib/informes/informes_controller');
var cuentas_router = require('./lib/cuentas/cuentas_controller');
var liquidaciones_router = require('./lib/liquidaciones/liquidaciones_controller');
var ofertas_router = require('./lib/ofertas/ofertas_controller');
var contratos_router = require('./lib/contratos/contratos_controller');
var tipos_proyectos_router = require('./lib/tipos_proyectos/tipos_proyectos_controller');
var textos_predeterminados_router = require('./lib/textos_predeterminados/textos_predeterminados_controller');

var pack = require('./package.json');
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
app.use('/api/informes', informes_router);
app.use('/api/usuarios', usuarios_router);
app.use('/api/version', version_router);
app.use('/api/empresas', empresas_router);
app.use('/api/clientes', clientes_router);
app.use('/api/comerciales', comerciales_router);
app.use('/api/sqlany', sqlany_router);
app.use('/api/tipos_comerciales', tipos_comerciales_router);
app.use('/api/tipos_mantenimientos', tipos_mantenimientos_router);
app.use('/api/tipos_clientes', tipos_clientes_router);
app.use('/api/contratos_comerciales', contratos_comerciales_router);
app.use('/api/contratos_mantenedores', contratos_mantenedores_router);
app.use('/api/tipos_forma_pago', tipos_forma_pago_router);
app.use('/api/formas_pago', formas_pago_router);
app.use('/api/tipos_iva', tipos_iva_router);
app.use('/api/articulos', articulos_router);
app.use('/api/parametros', parametros_router);
app.use('/api/prefacturas', prefacturas_router);
app.use('/api/contratos_cliente_mantenimiento', contratos_cliente_mantenimiento_router);
app.use('/api/clientes_comisionistas', clientes_comisionistas_router);
app.use('/api/contrato_mantenimiento_comisionistas', contrato_mantenimiento_comisionistas_router);
app.use('/api/grupo_articulo', grupo_articulos_router);
app.use('/api/contabilidad', contabilidad_router);
app.use('/api/unidades', unidades_router);
app.use('/api/tipos_via', tipos_via_router);
app.use('/api/motivos_baja', motivos_baja_router);
app.use('/api/cuentas', cuentas_router);
app.use('/api/facturas', facturas_router);
app.use('/api/liquidaciones', liquidaciones_router);
app.use('/api/ofertas', ofertas_router);
app.use('/api/contratos', contratos_router);
app.use('/api/tipos_proyectos', tipos_proyectos_router);
app.use('/api/textos_predeterminados', textos_predeterminados_router);

// -- start server
app.listen(config.apiPort);



// -- console message
console.log ("-------------------------------------------");
console.log (" PROASISTENCIA RUNNING ", moment(new Date()).format('DD/MM/YYYYY HH:mm:ss'));
console.log ("-------------------------------------------");
console.log(' VERSION: ' + pack.version);
console.log(' PORT: ' + config.apiPort);
console.log ("-------------------------------------------");
