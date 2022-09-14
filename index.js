//=======================================
// Proasistencia (index.js)
// API to communicate to PROASISTENCIA
//========================================
// Author: Rafael Garcia (rafa@myariadna.com)
// Vicent (vicent@myariadna.com)
// 2015 [License CC-BY-NC-4.0]


// required modules
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var serveIndex = require('serve-index');
var moment = require('moment');
const daemonApi = require('./lib/daemons/daemons');


// api support
var usuarios_router = require('./lib/usuarios/usuarios_controller');
var departamentos_router = require('./lib/departamentos/departamentos_controller');
var version_router = require('./lib/version/version_controller');
var empresas_router = require('./lib/empresas/empresas_controller');
var clientes_router = require('./lib/clientes/clientes_controller');
var proveedores_router = require('./lib/proveedores/proveedores_controller');
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
var prefacturasAuto_router = require('./lib/prefacturasAuto/prefacturasAuto_controller');
//var prefacproveAuto_router = require('./lib/prefacproveAuto/prefacproveAuto_controller');
var contratos_cliente_mantenimiento_router = require('./lib/contratos-cliente-mantenimiento/contratos_clientes_mantenimiento_controller');
var clientes_comisionistas_router = require('./lib/clientes-comisionistas/clientes_comisionistas_controller');
var contrato_mantenimiento_comisionistas_router = require('./lib/contrato-mantenimiento-comisionistas/contrato_mantenimiento_comisionistas_controller');
var grupo_articulos_router = require('./lib/grupos-articulos/grupo_articulo_controller');
var tarifas_cliente_router = require('./lib/tarifas_cliente/tarifa_cliente_controller');
var tarifas_proveedor_router = require('./lib/tarifas_proveedor/tarifa_proveedor_controller');
var contabilidad_router = require('./lib/contabilidad/contabilidad_controller');
var unidades_router = require('./lib/unidades/unidades_controller');
var tipos_via_router = require('./lib/tipos_via/tipos_via_controller');
var tipos_proveedor_router = require('./lib/tipos_proveedor/tipos_proveedor_controller');
var tipos_profesional_router = require('./lib/tipos_profesional/tipos_profesional_controller')
var motivos_baja_router = require('./lib/motivos_baja/motivos_baja_controller');
var facturas_router = require('./lib/facturas/facturas_controller');
var facturasProveedores_router = require('./lib/facturas_proveedores/facturasProveedores_controller');
var config_router = require('./lib/configuracion_env/config_env_controller');
var documentos_pago_router = require('./lib/documentos_pago/documentos_pago_controller');



var informes_router = require('./lib/informes/informes_controller');
var cuentas_router = require('./lib/cuentas/cuentas_controller');
var liquidaciones_router = require('./lib/liquidaciones/liquidaciones_controller');
var ofertas_router = require('./lib/ofertas/ofertas_controller');
var contratos_router = require('./lib/contratos/contratos_controller');
var tipos_proyectos_router = require('./lib/tipos_proyectos/tipos_proyectos_controller');
var textos_predeterminados_router = require('./lib/textos_predeterminados/textos_predeterminados_controller');
var correoElectronico = require('./lib/correoElectronico/correoElectronico.controller');
var plantillas_correo = require('./lib/plantillas_correo/plantillas_correo_controller');
var upload = require('./lib/upload/upload');
var cobros = require('./lib/cobros/cobros_controller');
var bi_router = require('./lib/bi/bi_controller');

//ACTUACIONES
var actuaciones_router = require('./lib/actuaciones/actuaciones_controller');
var estados_actuacion = require('./lib/estados_actuacion/estados_actuacion_controller');
var rechazos_presupuesto = require('./lib/rechazos_presupuesto/rechazos_presupuesto_controller');

//REPARACIONES
var reparaciones_router = require('./lib/reparaciones/reparaciones_controller');


//ANTICIPOS PROVEEDOR
var anticipos_proveedores = require('./lib/anticipos_proveedores/anticiposProveedores_controller');

//ANTICIPOS CLIERNTES
var anticipos_clientes = require('./lib/anticipos_clientes/anticiposClientes_controller');

//SERVICIOS
var servicios_router = require('./lib/servicios/servicios_controller');
var estados_parte_router = require('./lib/estados_parte/estados_parte_controller');
var estados_parte_profesional_router = require('./lib/estados_parte_profesional/estados_parte_profesional_controller');
var estados_presupuesto = require('./lib/estados_presupuesto/estados_presupuesto_controller');
var locales_afectados_router = require('./lib/locales-afectados/locales_afectados_controller');
var partes_router = require('./lib/partes/partes_controller');
var report_router = require('./lib/report-controller/reportdb')
var tipos_garantia_router = require('./lib/tipos_garantia/tipos_garantia_controller');

//MENSAJES

var mensajes_router = require('./lib/mensajes/mensajes_controller');

//DEMONIOS
//var cuentaAtras_router = require('./lib/demonios/cuenta_atras/cuentaAtras');



var pack = require('./package.json');
// read app parameters (host and port for the API)
//var config = require('./config.json');

//  leer la configurción de .env
var config = require('dotenv');
config.config();


// starting express
var app = express();

// to parse body content
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '100mb'
}));

app.use(bodyParser.json(
    {
        limit: '100mb'
    }
));

// using cors for cross class
app.use(cors());

// servidor html estático
app.use(express.static(__dirname + "/public"));
app.use('/ficheros', serveIndex(__dirname + '/public/ficheros', { 'icons': true, 'view': 'details' }));



// mounting routes
var router = express.Router();

// -- common to all routes
router.use(function (req, res, next) {
    // go on (by now)
    next();
});

//función de tratamiento de errores
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


// -- general GET (to know if the server is up and runnig)
router.get('/', function (req, res) {
    res.json('PROASISTENCIA API / SERVER -- runnig');
});

// -- registering routes
app.use('/bi', bi_router);
app.use('/api', router);
app.use('/api/informes', informes_router);
app.use('/api/usuarios', usuarios_router);
app.use('/api/departamentos', departamentos_router);
app.use('/api/version', version_router);
app.use('/api/empresas', empresas_router);
app.use('/api/clientes', clientes_router);
app.use('/api/proveedores', proveedores_router);
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
app.use('/api/prefacturasAuto', prefacturasAuto_router);
//app.use('/api/prefacproveAuto', prefacproveAuto_router);
app.use('/api/contratos_cliente_mantenimiento', contratos_cliente_mantenimiento_router);
app.use('/api/clientes_comisionistas', clientes_comisionistas_router);
app.use('/api/contrato_mantenimiento_comisionistas', contrato_mantenimiento_comisionistas_router);
app.use('/api/grupo_articulo', grupo_articulos_router);
app.use('/api/tarifas_cliente', tarifas_cliente_router);
app.use('/api/tarifas_proveedor', tarifas_proveedor_router);
app.use('/api/contabilidad', contabilidad_router);
app.use('/api/unidades', unidades_router);
app.use('/api/tipos_via', tipos_via_router);
app.use('/api/tipos_Proveedor', tipos_proveedor_router);
app.use('/api/motivos_baja', motivos_baja_router);
app.use('/api/cuentas', cuentas_router);
app.use('/api/facturas', facturas_router);
app.use('/api/facturasProveedores', facturasProveedores_router);
app.use('/api/liquidaciones', liquidaciones_router);
app.use('/api/ofertas', ofertas_router);
app.use('/api/contratos', contratos_router);
app.use('/api/tipos_proyectos', tipos_proyectos_router);
app.use('/api/tipos_profesional', tipos_profesional_router);
app.use('/api/textos_predeterminados', textos_predeterminados_router);
app.use('/api/streport', report_router);
app.use('/api/correoElectronico', correoElectronico);
app.use('/api/plantillas_correo_facturas', plantillas_correo);
app.use('/api/upload', upload);
app.use('/api/cobros', cobros);
app.use('/api/locales_afectados', locales_afectados_router);
app.use('/api/configuracion', config_router)
app.use('/api/documentos_pago', documentos_pago_router)

//ACTUACIONES
app.use('/api/actuaciones', actuaciones_router);
app.use('/api/estados_actuacion', estados_actuacion);

app.use('/api/rechazos_presupuesto', rechazos_presupuesto);

//REPARACIONES
app.use('/api/reparaciones', reparaciones_router);

//ANTICIPOS PROVEEDOR
app.use('/api/anticiposProveedores/', anticipos_proveedores);

//ANTICIPOS CLIENTES
app.use('/api/anticiposClientes/', anticipos_clientes);


//servicios
app.use('/api/servicios', servicios_router);
app.use('/api/estados_parte', estados_parte_router);
app.use('/api/estados_parte_profesional', estados_parte_profesional_router);
app.use('/api/partes', partes_router);
app.use('/api/estados_presupuesto', estados_presupuesto);
app.use('/api/tipos_garantia', tipos_garantia_router);

//MENSAJES
app.use('/api/mensajes', mensajes_router);

//CUENTA ATRAS DAEMON
//app.use('/api/cuenta_atras', cuentaAtras_router);





// -- start server
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(process.env.API_PORT);
server.setTimeout(800000000);

// -- io calls
var ioAPI = require('./lib/ioapi/ioapi');
ioAPI.init(io);

//starting daemon
setInterval(daemonApi.run,  process.env.COMERCIALIZA_DELAY || 900000);


// -- console message
console.log("-------------------------------------------");
console.log(" PROASISTENCIA RUNNING ", moment(new Date()).format('DD/MM/YYYYY HH:mm:ss'));
console.log("-------------------------------------------");
console.log(' VERSION: ' + pack.version);
console.log(' PORT: ' + process.env.API_PORT);
console.log("-------------------------------------------");

