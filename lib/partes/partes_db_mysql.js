// actuaciones_db_mysql
// Manejo de la tabla partes en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var mysql2 = require("mysql2/promise"); // librería para el acceso a bases de datos MySQL2
var moment = require('moment');
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var sql = "";
var fs = require('fs');
const fsp = require('fs').promises
const { createCipher } = require("crypto");
var AWS = require('aws-sdk');
var correoAPI = require('../correoElectronico/correoElectronico');
var Stimulsoft = require('stimulsoft-reports-js');
var parametrosDb = require("../parametros/parametros_db_mysql");


const obtenerConfiguracion = function() {
    return configuracion = {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET
    }
}


// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: process.env.BASE_MYSQL_HOST,
		user: process.env.BASE_MYSQL_USER,
		password: process.env.BASE_MYSQL_PASSWORD,
		database: process.env.BASE_MYSQL_DATABASE,
		port: process.env.BASE_MYSQL_PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback){
	connection.end(function(err){
		if (err) callback(err);
	});
}


// getPartes
// lee todos los registros de la tabla partes y
// los devuelve como una lista de objetos
module.exports.getPartes = function(callback){
	var connection = getConnection();
	var partes = null;
	sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, estp.nombre AS estadoProfNombre,";
    sql += " emp.nombre as empresa, ser.horaEntrada FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
    
	//sql += " LEFT JOIN estados_partes AS ea ON ea.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ser.empresaId";
	
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN estados_partes_profesional AS estp on estp.estadoParteProfesionalId = ac.estadoParteProfesionalId"
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		partes = result;
		callback(null, partes);
		
	});	
}

// getPartesNoAsignados

module.exports.getPartesPendientes = function(callback){
	var connection = getConnection();
	var registros = [];
	var sql = "";
	//seleccionamos primero las ids de los partes no confirmados
	sql = " SELECT DISTINCT ac.parteId";
    sql += " FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN mensajes AS m ON m.parteId = ac.parteId";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " WHERE ac.confirmado = 0 AND NOT m.parteId IS NULL AND m.estado <> 'PENDIENTE'";
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		ids = result;
		//buscamos el ultimo mensaje del parte
		async.eachSeries(ids,
			(id, done) => {
				fngetMensajeParte(id.parteId, function (err, result) {
					if(err) return callback(err);
					registros.push(result);
					done()		
				});
			},
			(err) => {
				if (err) return callback(err);
				callback(null, registros);
		});
			
	});	
}

var fngetMensajeParte = function(id, callback) {
	var connection = getConnection();
	var sql = " SELECT DISTINCT ac.parteId, ";
	sql += " ac.servicioId,"
	sql += " ac.confirmado,";
	sql += " ac.proveedorId,";
	sql += " ac.numParte,";
	sql += "  m.fecha,";
	sql += "  m.presupuesto,";
	sql += "  m.urgente,";
	sql += " s.direccionTrabajo,";
	sql += " e.email,"
	sql += " pro.nombre AS proveedorNombre";
    sql += " FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN mensajes AS m ON m.parteId = ac.parteId";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " WHERE ac.confirmado = 0 AND NOT m.parteId IS NULL AND m.estado <> 'PENDIENTE'";
	sql += " AND ac.parteId = ?";
	sql += " ORDER BY m.fecha DESC LIMIT 1";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err)	return callback(err, null);
		parte = result;
		callback(null, parte[0]);
	});	
}


// getPartes
// lee todos los registros de la tabla partes y
// los devuelve como una lista de objetos
module.exports.getPartesProveedor = function(proveedorId, abiertos, fecha, hFecha,direccionTrabajo, callback){
	var connection = getConnection();
	var partes = null;
	var sql = getSqlPartes(proveedorId, abiertos, fecha, hFecha,direccionTrabajo);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		if(result.length == 0){
			callback(null, null);
			return;
		}
		callback(null, result);
		
	});	
}

var getSqlPartes = function (proveedorId, abiertos, fecha, hFecha,direccionTrabajo) {
	//PARTES SIN OFERTA
	var sql = "(SELECT ac.*,"  
	sql += " pro.nombre AS proveedorNombre,"; 
	sql += " ser.nombreCliente AS cliNombre,";
	sql += " CONCAT(ser.direccionTrabajo, ' ', ser.poblacionTrabajo) AS direccionTrabajo,"; 
	sql += " ser.poblacionTrabajo,"; 
	sql += " ser.clienteId,"
	sql += " cli.telefono1,"; 
	sql += " cli.telefono2,"; 
	sql += " cli.tarifaId,"; 
	sql += " cli.tipoIvaId AS tipoIvaClienteId,"; 
	sql += " tp.porcentaje as porcentajeIvaCliente,"
	sql +="  estp.nombre AS estadoProfNombre,";
    sql += " emp.nombre as empresa,"; 
	sql += " ser.horaEntrada,"; 
	sql += " fp.nombre As formaPagoCliente,"; 
	sql += " fp2.nombre AS formaPagoProfesional,";
	sql += " emp.usuCorreo AS email"
	sql += " FROM partes AS ac";
	sql += " LEFT JOIN ofertas AS o ON o.ofertaId = ac.ofertaId"
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = ac.formaPagoClienteId";
	sql += " LEFT JOIN formas_pago AS fp2 ON fp2.formaPagoId = ac.formaPagoProfesionalId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN clientes AS cli on cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ac.empresaParteId";
	sql += " LEFT JOIN tipos_iva as tp ON tp.tipoIvaId = cli.tipoIvaId";
	sql += " LEFT JOIN estados_partes_profesional AS estp on estp.estadoParteProfesionalId = ac.estadoParteProfesionalId";
	sql += "  WHERE o.ofertaId IS NULL"
	if(proveedorId) sql += " AND ac.proveedorId = " + proveedorId + " AND NOT ac.confirmado IN (2)"
	if(abiertos == 'false') sql += " AND ac.estadoParteProfesionalId NOT IN (2, 6, 7)"


	if(fecha != 'null' && hFecha != 'null') sql += " AND ac.fecha_solicitud BETWEEN '" + fecha + " 00:00:00' AND '" + hFecha + " 00:00:00'";
	if(fecha != 'null' && hFecha == 'null') sql += " AND ac.fecha_solicitud >= '" + fecha + " 00:00:00'";


	if(direccionTrabajo != 'null') sql += " AND ser.direccionTrabajo LIKE '%" + direccionTrabajo + "%'";

	sql += " AND ac.fecha_solicitud >= '2022-02-01')"
	//sql += " ORDER BY ac.fecha_solicitud DESC";

	sql += " UNION";

	//PARTES CON OFERTA desde la app
	sql += " (SELECT ac.*,"  
	sql += " pro.nombre AS proveedorNombre,"; 
	sql += " ser.nombreCliente AS cliNombre,";
	sql += " CONCAT(ser.direccionTrabajo, ' ', ser.poblacionTrabajo) AS direccionTrabajo,"; 
	sql += " ser.poblacionTrabajo,"; 
	sql += " ser.clienteId,"
	sql += " cli.telefono1,"; 
	sql += " cli.telefono2,"; 
	sql += " cli.tarifaId,"; 
	sql += " cli.tipoIvaId AS tipoIvaClienteId,"; 
	sql += " tp.porcentaje as porcentajeIvaCliente,"
	sql +="  estp.nombre AS estadoProfNombre,";
    sql += " emp.nombre as empresa,"; 
	sql += " ser.horaEntrada,"; 
	sql += " fp.nombre As formaPagoCliente,"; 
	sql += " fp2.nombre AS formaPagoProfesional,";
	sql += " emp.usuCorreo AS email"
	sql += " FROM partes AS ac";
	sql += " LEFT JOIN ofertas AS o ON o.ofertaId = ac.ofertaId"
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = ac.formaPagoClienteId";
	sql += " LEFT JOIN formas_pago AS fp2 ON fp2.formaPagoId = ac.formaPagoProfesionalId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN clientes AS cli on cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ac.empresaParteId";
	sql += " LEFT JOIN tipos_iva as tp ON tp.tipoIvaId = cli.tipoIvaId";
	sql += " LEFT JOIN estados_partes_profesional AS estp on estp.estadoParteProfesionalId = ac.estadoParteProfesionalId";
	sql += "  WHERE  NOT o.ofertaId IS NULL AND o.creadaApp = 1"
	if(proveedorId) sql += " AND ac.proveedorId = " + proveedorId + " AND NOT ac.confirmado IN (2)"
	if(abiertos == 'false') sql += " AND ac.estadoParteProfesionalId NOT IN (2, 6, 7)"


	if(fecha != 'null' && hFecha != 'null') sql += " AND ac.fecha_solicitud BETWEEN '" + fecha + " 00:00:00' AND '" + hFecha + " 00:00:00'";
	if(fecha != 'null' && hFecha == 'null') sql += " AND ac.fecha_solicitud >= '" + fecha + " 00:00:00'";


	if(direccionTrabajo != 'null') sql += " AND ser.direccionTrabajo LIKE '%" + direccionTrabajo + "%'";

	sql += " AND ac.fecha_solicitud >= '2022-02-01')"
	//sql += " ORDER BY ac.fecha_solicitud DESC"

	sql += " UNION";

	//PARTES CON OFERTA desde administración
	sql += " (SELECT ac.*,"  
	sql += " pro.nombre AS proveedorNombre,"; 
	sql += " ser.nombreCliente AS cliNombre,";
	sql += " CONCAT(ser.direccionTrabajo, ' ', ser.poblacionTrabajo) AS direccionTrabajo,"; 
	sql += " ser.poblacionTrabajo,"; 
	sql += " ser.clienteId,"
	sql += " cli.telefono1,"; 
	sql += " cli.telefono2,"; 
	sql += " cli.tarifaId,"; 
	sql += " cli.tipoIvaId AS tipoIvaClienteId,"; 
	sql += " tp.porcentaje as porcentajeIvaCliente,"
	sql +="  estp.nombre AS estadoProfNombre,";
    sql += " emp.nombre as empresa,"; 
	sql += " ser.horaEntrada,"; 
	sql += " fp.nombre As formaPagoCliente,"; 
	sql += " fp2.nombre AS formaPagoProfesional,";
	sql += " emp.usuCorreo AS email"
	sql += " FROM partes AS ac";
	sql += " LEFT JOIN ofertas AS o ON o.ofertaId = ac.ofertaId"
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = ac.formaPagoClienteId";
	sql += " LEFT JOIN formas_pago AS fp2 ON fp2.formaPagoId = ac.formaPagoProfesionalId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN clientes AS cli on cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ac.empresaParteId";
	sql += " LEFT JOIN tipos_iva as tp ON tp.tipoIvaId = cli.tipoIvaId";
	sql += " LEFT JOIN estados_partes_profesional AS estp on estp.estadoParteProfesionalId = ac.estadoParteProfesionalId";
	sql += "  WHERE  NOT o.ofertaId IS NULL AND o.creadaApp = 0 AND ac.estadoPresupuesto = 3"
	if(proveedorId) sql += " AND ac.proveedorId = " + proveedorId + " AND NOT ac.confirmado IN (2)"
	if(abiertos == 'false') sql += " AND ac.estadoParteProfesionalId NOT IN (2, 6, 7)"


	if(fecha != 'null' && hFecha != 'null') sql += " AND ac.fecha_solicitud BETWEEN '" + fecha + " 00:00:00' AND '" + hFecha + " 00:00:00'";
	if(fecha != 'null' && hFecha == 'null') sql += " AND ac.fecha_solicitud >= '" + fecha + " 00:00:00'";


	if(direccionTrabajo != 'null') sql += " AND ser.direccionTrabajo LIKE '%" + direccionTrabajo + "%'";

	sql += " AND ac.fecha_solicitud >= '2022-02-01')"
	sql += " ORDER BY fecha_solicitud DESC";

	return sql;

}

// getPartes
// lee todos los registros de la tabla partes y
// los devuelve como una lista de objetos
module.exports.getParteProveedor = function(parteId, callback){
	var connection = getConnection();
	var partes = null;
	sql = "SELECT ac.*,"  
	sql += " pro.nombre AS proveedorNombre,"; 
	sql += " ser.nombreCliente AS cliNombre,";
	sql += " CONCAT(ser.direccionTrabajo, ' ', ser.poblacionTrabajo) AS direccionTrabajo,"; 
	sql += " ser.poblacionTrabajo,"; 
	sql += " ser.clienteId,"
	sql += " cli.telefono1,"; 
	sql += " cli.telefono2,"; 
	sql += " cli.tarifaId,"; 
	sql += " cli.tipoIvaId AS tipoIvaClienteId,"; 
	sql += " tp.porcentaje as porcentajeIvaCliente,"
	sql +="  estp.nombre AS estadoProfNombre,";
    sql += " emp.nombre as empresa,"; 
	sql += " ser.horaEntrada,"; 
	sql += " fp.nombre As formaPagoCliente,"; 
	sql += " fp2.nombre AS formaPagoProfesional,";
	sql += " emp.usuCorreo AS email"
	sql += " FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = ac.formaPagoClienteId";
	sql += " LEFT JOIN formas_pago AS fp2 ON fp2.formaPagoId = ac.formaPagoProfesionalId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN clientes AS cli on cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ac.empresaParteId";
	sql += " LEFT JOIN tipos_iva as tp ON tp.tipoIvaId = cli.tipoIvaId";
	sql += " LEFT JOIN estados_partes_profesional AS estp on estp.estadoParteProfesionalId = ac.estadoParteProfesionalId";
	
	sql += " WHERE ac.parteId = " + parteId;
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		if(result.length == 0){
			callback(null, null);
			return;
		}
		callback(null, result[0]);
		
	});	
}






// getParte
// busca  la parte con id pasado
module.exports.getParte = function(id, callback){
	var connection = getConnection();
    var partes = null;
	sql = "SELECT ac.*, ser.numServicio, ser.horaEntrada,"
	sql += "  IF(fa.numeroFacturaProveedor IS NULL, fa.numeroFacturaProveedor2, fa.numeroFacturaProveedor) AS numFactPro, fa.fecha As fecFactPro,";
	sql += " ser.fechaEntrada, ser.operadorAgente, ser.usuarioId as usuServicioId,";
	sql += " ser.direccionTrabajo, ser.poblacionTrabajo, ser.empresaId,"; 
	sql += " ser.poblacionTrabajo, ser.direccionTrabajo, cli.telefono1, cli.telefono2,";
	sql += " pro.nombre AS nombreproveedor, com.nombre as comercialNombre,";
	sql += " cli.nombre AS cliNombre, cli.proId as proId,";
	sql += " tp.nombre AS tipoProNom, fp2.nombre AS formaPagoProfesional, fp.nombre AS formaPagoCliente,";
	sql += " emp.nombre AS empresa, us.nombre AS usuServicioNombre, com2.nombre AS colaboradorNombre,"
	sql += " emp.usuCorreo AS email"
    sql += " FROM partes AS ac";
	sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN servicios as ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN comerciales as com ON com.comercialId = ser.agenteId";
	sql += " LEFT JOIN usuarios as us ON us.usuarioId = ser.usuarioId";
	sql += " LEFT JOIN clientes as cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales as com2 ON com2.comercialId = cli.colaboradorId";
	sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = ser.tipoProfesionalId";
	sql += " LEFT JOIN empresas AS emp ON emp.empresaId = ser.empresaId";
	sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = ac.formaPagoClienteId";
	sql += " LEFT JOIN formas_pago AS fp2 ON fp2.formaPagoId = ac.formaPagoProfesionalId";
	sql += " LEFT JOIN facprove AS fa ON fa.facproveId = ac.facproveId";
	sql += " LEFT JOIN facturas AS f ON f.facturaId = ac.facturaId";

    //sql += " LEFT JOIN estados_presupuesto AS ep ON ep.estadoPresupuestoId = ac.estadoPresupuestoId";
    //sql += " LEFT JOIN estados_partes AS ea ON ea.estadoParteId = ac.estadoParteId";
	sql += " WHERE ac.parteId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		if (result.length == 0){
			callback(null, null);
			return;
		}
		callback(null, result[0]);
	});
}

// getParte
// busca  la parte con id pasado
module.exports.getParteAsync = async(id) => {
	let connection = null;
    var sql = "";
	return new Promise(async (resolve, reject) => {
		try {
			connection = await mysql2.createConnection(obtenerConfiguracion());
			sql = "SELECT ac.*, ser.numServicio, ser.horaEntrada,"
			sql += "  IF(fa.numeroFacturaProveedor IS NULL, fa.numeroFacturaProveedor2, fa.numeroFacturaProveedor) AS numFactPro, fa.fecha As fecFactPro,";
			sql += " ser.fechaEntrada, ser.operadorAgente, ser.usuarioId as usuServicioId,";
			sql += " ser.direccionTrabajo, ser.poblacionTrabajo, ser.empresaId,"; 
			sql += " ser.poblacionTrabajo, ser.direccionTrabajo, cli.telefono1, cli.telefono2,";
			sql += " pro.nombre AS nombreproveedor, com.nombre as comercialNombre,";
			sql += " cli.nombre AS cliNombre, cli.proId as proId,";
			sql += " tp.nombre AS tipoProNom, fp2.nombre AS formaPagoProfesional, fp.nombre AS formaPagoCliente,";
			sql += " emp.nombre AS empresa, us.nombre AS usuServicioNombre, com2.nombre AS colaboradorNombre,"
			sql += " emp.usuCorreo AS email"
			sql += " FROM partes AS ac";
			sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
			sql += " LEFT JOIN servicios as ser ON ser.servicioId = ac.servicioId";
			sql += " LEFT JOIN comerciales as com ON com.comercialId = ser.agenteId";
			sql += " LEFT JOIN usuarios as us ON us.usuarioId = ser.usuarioId";
			sql += " LEFT JOIN clientes as cli ON cli.clienteId = ser.clienteId";
			sql += " LEFT JOIN comerciales as com2 ON com2.comercialId = cli.colaboradorId";
			sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = ser.tipoProfesionalId";
			sql += " LEFT JOIN empresas AS emp ON emp.empresaId = ser.empresaId";
			sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = ac.formaPagoClienteId";
			sql += " LEFT JOIN formas_pago AS fp2 ON fp2.formaPagoId = ac.formaPagoProfesionalId";
			sql += " LEFT JOIN facprove AS fa ON fa.facproveId = ac.facproveId";
			sql += " LEFT JOIN facturas AS f ON f.facturaId = ac.facturaId";
			sql += " WHERE ac.parteId = ?";
			sql = mysql2.format(sql, id);
			let [result] = await connection.query(sql);
			await connection.end();
			if(result.length == 0) {
				resolve(null);
			} else {
				resolve(result[0]);
			}
		} catch(err) {
			if(connection) {
				if (!connection.connection._closing) {
					await connection.end();
				} 
			}
			reject(err)
		}
	});
}



// getParte
// busca  el parte con id pasado
module.exports.getParteServicio = function(id, callback){
	var connection = getConnection();
    var partes = null;
    sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
	sql += "  IF(fa.numeroFacturaProveedor IS NULL, fa.numeroFacturaProveedor2, fa.numeroFacturaProveedor) AS numFactPro, fa.fecha As fecFactPro,";
    sql += " tp.nombre AS tipoProfesionalNombre, emp.nombre as empresa, ser.horaEntrada FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
    //sql += " LEFT JOIN estados_presupuesto AS ep ON ep.estadoPresupuestoId = ac.estadoPresupuestoId";
	//sql += " LEFT JOIN estados_partes AS ea ON ea.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ser.empresaId";
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ac.tipoProfesionalId";
	sql += " LEFT JOIN facprove AS fa ON fa.facproveId = ac.facproveId";
	sql += " LEFT JOIN facturas AS f ON f.facturaId = ac.facturaId";

	sql += " WHERE ser.servicioId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		if (result.length == 0){
			callback(null, null);
			return;
		}
		callback(null, result);
	});
}

// getParte
// busca  el parte con id pasado
module.exports.getParteServicioProfesional = function(servicioId, proveedorId, callback){
	var connection = getConnection();
    var partes = null;
    sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
    sql += " tp.nombre AS tipoProfesionalNombre, emp.nombre as empresa, ser.horaEntrada FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
    //sql += " LEFT JOIN estados_presupuesto AS ep ON ep.estadoPresupuestoId = ac.estadoPresupuestoId";
	//sql += " LEFT JOIN estados_partes AS ea ON ea.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ser.empresaId";
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ac.tipoProfesionalId";
	sql += " WHERE ser.servicioId = ? AND pro.proveedorId = ?";
	sql = mysql.format(sql, [servicioId, proveedorId]);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		if (result.length == 0){
			callback(null, null);
			return;
		}
		callback(null, result);
	});
}


// getPartesEstado
// busca  los partes con la id del esatdo pasada
module.exports.getPartesEstado = function(id, callback){
	var connection = getConnection();
    var partes = null;
	sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
	sql += "  IF(fa.numeroFacturaProveedor IS NULL, fa.numeroFacturaProveedor2, fa.numeroFacturaProveedor) AS numFactPro, fa.fecha As fecFactPro,";
	sql += " estp.nombre AS nombreEstadoProfesional, tp.nombre AS tipoProfesionalNombre, cli.nombre AS nombreCliente, cli.proId, cli.clienteId as clienteId, ser.agenteId, co.nombre AS comercialNombre, ser.direccionTrabajo,";
    sql += " emp.nombre as empresa, ser.empresaId AS empresaId, ser.horaEntrada FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ser.empresaId";
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN estados_partes_profesional as estp ON estp.estadoParteProfesionalId = ac.estadoParteProfesionalId";
	
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ac.tipoProfesionalId";
	sql += " LEFT JOIN facprove AS fa ON fa.facproveId = ac.facproveId";
	sql += " LEFT JOIN facturas AS f ON f.facturaId = ac.facturaId";
	if (id != 100) {
		sql += " WHERE ac.estadoParteId = ?";
		sql = mysql.format(sql, id);
	}
	sql += " ORDER BY ac.numParte, ser.fechaEntrada, ac.fecha_prevista, ac.fecha_reparacion"
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		if (result.length == 0){
			callback(null, null);
			return;
		}
		callback(null, result);
	});
}

// getPartesEstados
// busca  los partes con un array pasado
module.exports.getPartesEstados = function(estados, callback){
	var connection = getConnection();
    var partes = null;
	sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
	sql += "  IF(fa.numeroFacturaProveedor IS NULL, fa.numeroFacturaProveedor2, fa.numeroFacturaProveedor) AS numFactPro, fa.fecha As fecFactPro,";
	sql += " estp.nombre AS nombreEstadoProfesional, tp.nombre AS tipoProfesionalNombre, cli.nombre AS nombreCliente, cli.proId, cli.clienteId as clienteId, ser.agenteId, co.nombre AS comercialNombre, ser.direccionTrabajo,";
    sql += " emp.nombre as empresa, ser.empresaId AS empresaId, ser.horaEntrada FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ser.empresaId";
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN estados_partes_profesional as estp ON estp.estadoParteProfesionalId = ac.estadoParteProfesionalId";
	
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ac.tipoProfesionalId";
	sql += " LEFT JOIN facprove AS fa ON fa.facproveId = ac.facproveId";
	sql += " LEFT JOIN facturas AS f ON f.facturaId = ac.facturaId";
	if(estados[0] == 100) {
		sql += "";
	}
	else if(estados[0] == 101) {
		sql += " WHERE (NOT ac.fecha_prevista IS NULL AND  ac.estadoParteId <> 5 AND ac.estadoParteId <> 6)";
		sql += " OR (NOT ac.fecha_prevista IS NULL AND  ac.estadoParteProfesionalId <> 2 AND ac.estadoParteId <> 5 AND ac.estadoParteId <> 6)"
		sql += " HAVING CURDATE() > ac.fecha_prevista"
	}else if(estados[0] == 102) {
		sql += " WHERE ac.estadoParteProfesionalId <> 2"
	} else {
		sql += " WHERE ac.estadoParteId IN (?)";
		sql = mysql.format(sql, [estados]);
	}
	sql += " ORDER BY ac.numParte, ser.fechaEntrada, ac.fecha_prevista, ac.fecha_reparacion"
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		if (result.length == 0){
			callback(null, null);
			return;
		}
		callback(null, result);
	});
}

// getPartesEstadoComercial
// busca  los partes con la id del esatdo pasada
module.exports.getPartesEstadoComercial = function(estadoParteId, comercialId, callback){
	var connection = getConnection();
    var partes = null;
	sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
	sql += "  IF(fa.numeroFacturaProveedor IS NULL, fa.numeroFacturaProveedor2, fa.numeroFacturaProveedor) AS numFactPro, fa.fecha As fecFactPro,";
	sql += " tp.nombre AS tipoProfesionalNombre, cli.nombre AS nombreCliente, cli.proId, cli.clienteId as clienteId, ser.agenteId, co.nombre AS comercialNombre, ser.direccionTrabajo,";
    sql += " emp.nombre as empresa, ser.empresaId AS empresaId, ser.horaEntrada FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ser.empresaId";
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ac.tipoProfesionalId";
	sql += " LEFT JOIN facprove AS fa ON fa.facproveId = ac.facproveId";
	sql += " LEFT JOIN facturas AS f ON f.facturaId = ac.facturaId";
	sql += " WHERE cli.colaboradorId = ?"
	sql = mysql.format(sql, comercialId);
	if (estadoParteId != 100) {
		sql += "  AND ac.estadoParteId = ?";
		sql = mysql.format(sql, estadoParteId);
	}
	sql += " ORDER BY ac.numParte, ser.fechaEntrada, ac.fecha_prevista, ac.fecha_reparacion"
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		if (result.length == 0){
			callback(null, null);
			return;
		}
		callback(null, result);
	});
}



module.exports.getSiguienteNumero = function (servicioId,  numServicio, done) {
	var nuevonum;
	var con = getConnection();
	var sql = "SELECT COALESCE(MAX(num) + 1, 1) as mnum FROM partes";
	sql += " WHERE servicioId = ?";
	sql = mysql.format(sql, servicioId);
			con.query(sql, function (err, reg) {
					con.end();
					if (err) return done(err);
				  nuevonum = formateaNumero(reg);
				  var numResult = numServicio + '.' + nuevonum
					done(null, numResult);
			});
}

module.exports.getRefPresupuesto = function (servicioId,  refPresupuesto, proveedores, done) {
	refPresupuesto = refPresupuesto.replace('@', '/');
	var con = getConnection();
	var sql = "SELECT * FROM partes";
	sql += " WHERE refPresupuesto  = ? AND servicioId = ? AND proveedorId IN (?) AND estadoPresupuesto <> 3";
	sql = mysql.format(sql, [refPresupuesto, servicioId, proveedores]);
			con.query(sql, function (err, ref) {
					con.end();
					if (err) return done(err);
					done(null, ref);
			});
}

module.exports.getRefPresupuestoLineas = function (servicioId,  refPresupuesto, done) {
	refPresupuesto = refPresupuesto.replace('@', '/');
	var con = getConnection();
	var sql = "SELECT * FROM partes AS p";
	sql += " INNER JOIN partes_lineas AS pl ON pl.parteId = p.parteId"
	sql += " WHERE refPresupuesto  = ? AND servicioId = ?";
	sql = mysql.format(sql, [refPresupuesto, servicioId]);
			con.query(sql, function (err, lineas) {
					con.end();
					if (err) return done(err);
					done(null, lineas);
			});
}

module.exports.getPartesCerradosFacturar = function (deFecha, aFecha, clienteId, agenteId, empresaId, done) {
	var con = getConnection();
	deFecha = moment(deFecha, 'DD.MM.YYYY').format('YYYY-MM-DD HH:mm');
	aFecha = moment(aFecha, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm');
	clienteId = parseInt(clienteId);
	agenteId = parseInt(agenteId);
	empresaId = parseInt(empresaId);
	sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
	sql += " tp.nombre AS tipoProfesionalNombre, cli.nombre AS nombreCliente, cli.proId, cli.clienteId as clienteId, co.nombre AS comercialNombre, ser.direccionTrabajo,";
	sql += " emp.nombre as empresa, ac.empresaParteId AS empresaId, ser.horaEntrada FROM partes AS ac";
	sql += " INNER JOIN partes_lineas AS pt ON pt.parteId = ac.parteId";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ac.empresaParteId";
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS com ON com.comercialId = ser.agenteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ac.tipoProfesionalId";
	sql += " WHERE";
	sql += " (ac.estadoParteId = 5 AND ac.fecha_cierre_cliente >= '" + deFecha + "' AND ac.fecha_cierre_cliente <= '"+ aFecha+"' AND ac.prefacturaAutoId IS NULL AND antesPre = 0)";
	sql += " OR";
	sql += " (ac.estadoParteId = 5 AND ac.fecha_cierre_cliente >= '" + deFecha + "' AND ac.fecha_cierre_cliente <= '"+ aFecha+"' AND ac.facturaId IS NULL AND ac.prefacturaAutoId IS NULL AND antesPre = 1)";
 	if(clienteId) {
		 sql += " AND cli.clienteId = "+clienteId
	 }
	 if(agenteId) {
		sql += " AND com.comercialId = "+ agenteId
	}
	if(empresaId) {
		sql += " AND emp.empresaId = "+ empresaId
	}
	sql += " GROUP BY ac.parteId"
	 sql+= " ORDER BY cli.nombre ASC"
	 con.query(sql, function (err, ref) {
		con.end();
		if (err) return done(err);
		done(null, ref);
	});
}


module.exports.getPartesProfesionalesCerradosFacturar = function (deFecha, aFecha, proveedorId, agenteId, empresaId, done) {
	var con = getConnection();
	deFecha = moment(deFecha, 'DD.MM.YYYY').format('YYYY-MM-DD HH:mm');
	aFecha = moment(aFecha, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm');
	proveedorId = parseInt(proveedorId);
	agenteId = parseInt(agenteId);
	empresaId = parseInt(empresaId);
	sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
	sql += " tp.nombre AS tipoProfesionalNombre, cli.nombre AS nombreCliente, cli.proId, cli.clienteId as clienteId, co.nombre AS comercialNombre, ser.direccionTrabajo,";
	sql += " emp.nombre as empresa, ac.empresaParteId AS empresaId, ser.horaEntrada FROM partes AS ac";
	sql += " INNER JOIN partes_lineas AS pt ON pt.parteId = ac.parteId";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ac.empresaParteId";
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS com ON com.comercialId = ser.agenteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ac.tipoProfesionalId";
	sql += " WHERE ac.estadoParteProfesionalId = 2 AND ac.fecha_cierre_profesional >= '" + deFecha + "' AND ac.fecha_cierre_profesional <= '"+ aFecha+"' AND ac.facproveId IS NULL";
 	if(proveedorId) {
		 sql += " AND pro.proveedorId = "+ proveedorId
	 }
	 if(agenteId) {
		sql += " AND com.comercialId = "+ agenteId
	}
	if(empresaId) {
		sql += " AND emp.empresaId = "+ empresaId
	}
	sql += " GROUP BY ac.parteId"
	 sql+= " ORDER BY cli.nombre ASC"
	 con.query(sql, function (err, ref) {
		con.end();
		if (err) return done(err);
		done(null, ref);
	});
}

module.exports.getLineasParte = function (parteId, done) {
	var con = getConnection();
	var sql = "SELECT pt.*, par.facproveId, par.facturaId, par.prefacturaAutoId FROM partes_lineas AS pt";
	sql += " LEFT JOIN partes AS par ON par.parteId = pt.parteId"
	sql += " WHERE par.parteId = ?";
	sql = mysql.format(sql, parteId);
	con.query(sql, function (err, result) {
		con.end();
		if (err) return done(err);
		done(null, result);
	});
}

module.exports.getLineasParteMovil = function (parteId, done) {
	var con = getConnection();
	var sql = "SELECT pt.*, par.facproveId, par.facturaId, par.prefacturaAutoId, a.nombre AS nombreArticulo, a.administracion";
	sql += " FROM partes_lineas AS pt";
	sql += " LEFT JOIN partes AS par ON par.parteId = pt.parteId";
	sql += " LEFT JOIN articulos as a on a.codigoReparacion = pt.codigoArticulo";
	sql += " WHERE par.parteId = ? AND NOT a.codigoReparacion Is NULL";
	sql = mysql.format(sql, parteId);
	con.query(sql, function (err, result) {
		con.end();
		if (err) return done(err);
		done(null, result);
	});
}
module.exports.getLineaParte = function (parteId, lineaParteId, done) {
	var con = getConnection();
	var sql = "SELECT * FROM partes_lineas";
	sql += " WHERE parteId = ? AND parteLineaId = ?";
	sql = mysql.format(sql, [parteId, lineaParteId])
	con.query(sql, function (err, result) {
		con.end();
		if (err) return done(err);
		done(null, result);
	});
}




// postParte
// crear en la base de datos el parte pasado
module.exports.postParte = function (parte, callback){
	var connection = getConnection();
	var array = [];
	fnGetNumeroParte(parte.servicioId, parte.numServicio, function (err, result) {
		if(err) return callback(err);
		parte.numParte = parte.numServicio + "." + result;
		parte.num = parseInt(result);
		delete parte.numServicio;
		parte.parteId = 0; // fuerza el uso de autoincremento
		//array = parte.numParte.split(".");
		//parte.num = parseInt(array[1])// contador del numero de parte
		sql = "INSERT INTO partes SET ?";
		sql = mysql.format(sql, parte);
		connection.query(sql, function(err, result2){
			closeConnectionCallback(connection, callback);
			if (err) return callback(err);
			parte.parteId = result2.insertId;
			callback(null, parte);
		});
	});
}


module.exports.postPartes = function (partes, numServicio, callback){
	var datos = [];
	async.eachSeries(partes,
		(parte, done) => {
			fnGetNumeroParte(parte.servicioId, numServicio, function (err, result) {
				var obj = {}
				obj.proveedorId = parte.proveedorId;
				var connection = getConnection();
				parte.numParte = numServicio + "." + result;
				parte.num = parseInt(result);
				sql = "INSERT INTO partes SET ?";
				sql = mysql.format(sql, parte);
				connection.query(sql, function(err, result){
					closeConnectionCallback(connection, done);
					if (err) return done(err);
					obj.parteId = result.insertId;
					datos.push(obj);
					done(null, null);
				});
			});
		},
		(err) => {
			if (err) return callback(err);
			callback(null, datos);
	});
}

// postLineaParte
// crear en la base de datos la linea de parte pasada
module.exports.postLineaParte = function (LineaParte, parteId, servicioId, callback){
	var connection = getConnection();
	LineaParte.parteLineaId = 0; // fuerza el uso de autoincremento
	LineaParte.parteId = parteId;
	sql = "INSERT INTO partes_lineas SET ?";
	sql = mysql.format(sql, LineaParte);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return;
		}
		//actualizamos el total al cliente y el total al proveedor del parte
		actualizaTotales(parteId, servicioId, function(err, result2) {
			if (err){
				callback(err);
				return;
			}
			result2.lineaParteId = result.insertId;
			callback(null, result2);
		});
	});
}

// postLineaParte
// crear en la base de datos la linea de parte pasada
module.exports.postLineasParte = function (LineasParte, servicioId, callback){
	async.eachSeries(LineasParte,
		(LineaParte, done) => {
			var connection = getConnection();
			var sql = "INSERT INTO partes_lineas SET ?";
			sql = mysql.format(sql, LineaParte);
			connection.query(sql, function(err, result){
				closeConnectionCallback(connection, done);
				if (err){
					done(err);
					return;
				}
				//actualizamos el total al cliente y el total al proveedor del parte
				actualizaTotales(LineaParte.parteId, servicioId, function(err, result2) {
					if (err){
						done(err);
						return;
					}
					done(null, result2);
				});
			});
		},
		(err) => {
			if (err) return callback(err);
			callback(null,'OK');
		});
}


// putParte
// Modifica el parte según los datos del objeto pasao
module.exports.putParte = function(id, parte, callback){
    if (id != parte.parteId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	if ('nombreFirmante' in parte) {
		if(!parte.noFirma) {
			if(
				(!parte.nombreFirmante || parte.nombreFirmante == '' || parte.nombreFirmante.trim() === "") ||
				(!parte.apellidosFirmante || parte.apellidosFirmante == '' || parte.apellidosFirmante.trim() === "") ||
				(!parte.dniFirmante || parte.dniFirmante == '' || parte.dniFirmante.trim() === "") ||
				(!parte.cargoFirmante || parte.cargoFirmante == '' || parte.cargoFirmante.trim() === "") ||
				(!parte.nombreFirmante || parte.nombreFirmante == '' || parte.nombreFirmante.trim() === "") 
			)
			{
				var err = new Error("El envio de los datos no se ha realizado correctamente, vuelva a aceptar. Si el problema persiste salgase del formulario y rellenelo de nuevo.");
				callback(err);
				return;
			}
		}
	  } else {
		console.log('El objeto NO tiene la propiedad "nombre".');
	  }
	var opcion = parte.opcion;
	delete parte.opcion;
	var connection = getConnection();
	sql = "UPDATE partes SET ? WHERE parteId = ?";
	sql = mysql.format(sql, [parte, parte.parteId]);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return;
		}
		callback(null, parte);
	});
}


// putParte
// Modifica el parte según los datos del objeto pasado
module.exports.putParteSinAsignar = function(servicioId, parte, callback){
	var connection = getConnection();
	sql = "UPDATE partes SET ? WHERE servicioId = ?";
	sql += " AND estadoParteProfesionalId IS NULL AND proveedorId IS NULL"
	sql = mysql.format(sql, [parte, servicioId]);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return;
		}
		callback(null, parte);
	});
}

module.exports.putPartes = function (partes, callback){
	var datos = [];
	async.eachSeries(partes,
		(parte, done) => {
				var connection = getConnection();
				sql = "UPDATE partes SET ? WHERE parteId = ?";
				sql = mysql.format(sql, [parte, parte.parteId]);
				connection.query(sql, function(err, result){
					closeConnectionCallback(connection, done);
					if (err)
					return done(err);
					done(null, null);
				});
		},
		(err) => {
			if (err) return callback(err);
			callback(null, null);
		});
}


// putPartesServicio
// Modifica los partes de un servicio
module.exports.putPartesServicio = async (servicioId, parte, ofertaId) => {
	let connection = null;
	var sql = "";
	var ids = [];
	return new Promise(async (resolve, reject) => {
		try {
			connection = await mysql2.createConnection(obtenerConfiguracion());
			await connection.beginTransaction();
			//seleccionamos primero las ids de los partes que vamos a actualizar
			sql = "SELECT  parteId FROM partes WHERE servicioId = ?  AND ofertaId = ?";
			sql = mysql2.format(sql, [servicioId, ofertaId]);
			let [result] = await connection.query(sql);
			if(result.length > 0) {
				result.forEach(e => {
					ids.push(e.parteId);
				});
			}
			//actulizamos los partes desvinculandolos de la oferta
			sql = "UPDATE partes SET ? WHERE servicioId = ?  AND ofertaId = ?";
			sql = mysql2.format(sql, [parte, servicioId, ofertaId]);
			let [result2] = await connection.query(sql);
			//borramos la documentación correspondiente de la tabla documentacion relacionada con la oferta
			/* sql = "DELETE FROM documentacion WHERE parteId IN (?)";
			sql = mysql2.format(sql, ids);
			let [result3] = await connection.query(sql); */
			await connection.commit();
			await connection.end();;
			resolve(result);
		} catch(err) {
			if (connection) {
				if (!connection.connection._closing) {
					await connection.rollback();
					await connection.end()
				}
			}
			reject (err)
		}
	});
}



// putPartesFactura
// Modifica los partes de un servicio
module.exports.putPartesFactura = function(forpaCliParte, callback){
	var connection = getConnection();
	sql = "UPDATE partes SET ?";
	if(forpaCliParte.facturaId) {
		sql += " WHERE facturaId = ?"
		sql = mysql.format(sql, [forpaCliParte, forpaCliParte.facturaId]);
	}
	if(forpaCliParte.facproveId) {
		sql += " WHERE facproveId = ?"
		sql = mysql.format(sql, [forpaCliParte, forpaCliParte.facproveId]);
	}
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return;
		}
		callback(null, result);
	});
}


// putPartesFactura
// Modifica los partes de un servicio
module.exports.putPartesPrefactura = function(forpaCliParte, callback){
	var connection = getConnection();
	sql = "UPDATE partes SET ?";
	if(forpaCliParte.prefacturaAutoId) {
		sql += " WHERE prefacturaAutoId = ?"
		sql = mysql.format(sql, [forpaCliParte, forpaCliParte.prefacturaAutoId]);
	}
	/* if(forpaCliParte.facproveId) {
		sql += " WHERE facproveId = ?"
		sql = mysql.format(sql, [forpaCliParte, forpaCliParte.facproveId]);
	} */
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return;
		}
		callback(null, result);
	});
}



// putLineaParte
// Modifica el parte según los datos del objeto pasao
module.exports.putLineaParte = function(id, lineaParte, servicioId, callback){
    if (id != lineaParte.parteLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE partes_lineas SET ? WHERE parteLineaId = ?";
	sql = mysql.format(sql, [lineaParte, lineaParte.parteLineaId]);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return;
		}
		//actualizamos el total al cliente y el total al proveedor del parte
		actualizaTotales(lineaParte.parteId, servicioId, function(err, result2) {
			if (err){
				callback(err);
				return;
			}
			callback(null, result2);
		});
	});
}

// deleteParte
// Elimina el parte con el id pasado
module.exports.deleteParte = function(id, callback){
	var connection = getConnection();
	sql = "DELETE from partes WHERE parteId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return;
		}
		callback(null);
	});
}

// deleteLineaParte
// Elimina una linea de parte con el id pasado
module.exports.deleteLineaParte = function(id, parteId, servicioId, callback){
	var connection = getConnection();
	sql = "DELETE from partes_lineas WHERE parteLineaId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return;
		}
		//actualizamos el total al cliente y el total al proveedor del parte
		actualizaTotales(parteId, servicioId, function(err, result2) {
			if (err){
				callback(err);
				return;
			}
			callback(null, result2);
		});
	});
}

// deleteLineaParte
// Elimina una linea de parte con el id pasado
module.exports.deleteLineasPartesOfertas = function(servicioId, ref, callback){
	var connection = getConnection();
	sql = "DELETE partes_lineas FROM partes_lineas";
	sql += " INNER JOIN partes  ON partes.parteId = partes_lineas.parteId ";
	sql += " WHERE partes.servicioId = ? AND partes.refPresupuesto = ?";
	sql = mysql.format(sql, [servicioId, ref]);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err) return callback(err);
		//actualizamos el total al cliente y el total al proveedor del parte
		actualizaTotalesACero(servicioId, ref, function(err, result2) {
			if (err) return callback(err);
			callback(null, result2);
		});
	});
}

//creacion de report json
module.exports.postCrearListadoExistencias = function (dFecha, hFecha, clienteId, empresaId, callback) {
    var connection = getConnection()
    var obj = 
        {
            libCli: ""
        }
    
	var sql = "SELECT";
	sql += " tmp.tipo,";
	sql += " tmp.clienteId,";
	sql += " tmp.cliCodigo,";
	sql += " tmp.clienteNombre,";	
	sql += " tmp.direccionTrabajo,"
	if(empresaId > 0) {
		sql += " tmp.empresaNombre AS empresaNombre,";
	} else {
		sql += " ' ' AS empresaNombre,";
	}
	sql += " SUM(tmp.venta) AS venta,";
	sql += " SUM(tmp.coste) AS coste,";
	sql += " tmp.inicioIntervalo,";
	sql += " tmp.finIntervalo,"
	sql += " tmp.parteId,";
	sql += " tmp.numParte"
	sql += " FROM"
	sql += " (SELECT"; 
	sql += " 'E' AS tipo,"
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql +=" cli.direccion2 AS direccionTrabajo,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";
	sql += " p.parteId AS parteId,";
	sql += " p.numParte AS numParte,";
	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente) AS venta, SUM(p.importe_profesional)  AS coste";
	sql += " FROM partes  AS p"; 
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId"; 
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " WHERE p.fecha_cierre_profesional < '" + dFecha + " 00:00:00'";
	sql += " AND (p.fecha_cierre_cliente IS NULL || p.fecha_cierre_cliente > '" + hFecha + " 23:59:59')"; 
    if (empresaId > 0) {
        sql += " AND s.empresaId IN (" + empresaId + ")";
	}
	sql += "  GROUP BY s.clienteId, p.parteId";

	sql += " UNION";

	sql += " SELECT";
	sql += " 'I' AS tipo,"
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql += " cli.direccion2 AS direccionTrabajo,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";
	sql += " p.parteId AS parteId,";
	sql += " p.numParte AS numParte,";
	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente)  AS venta , SUM(p.importe_profesional)  AS coste"
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId"; 
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " WHERE p.fecha_cierre_profesional >=  '" + dFecha + " 00:00:00' AND p.fecha_cierre_profesional <=  '" + hFecha + " 23:59:59'";
	sql += " AND (p.fecha_cierre_cliente IS NULL OR p.fecha_cierre_cliente >  '" + hFecha + " 23:59:59')";
    if (empresaId > 0) {
        sql += " AND s.empresaId IN (" + empresaId + ")";
	}
	sql += " GROUP BY s.clienteId, p.parteId) AS tmp"; 
	sql += " GROUP BY tmp.tipo, tmp.clienteId, tmp.parteId";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
		obj.libCli = procesaResultadoExistencias(result);
		

       /* var resultado = JSON.stringify(obj);
        fs.writeFile(process.env.REPORTS_DIR + "\\listado_existencias.json", resultado, function(err) {
            if(err) return callback(err);
            //return callback(null, true);
        });   */
        callback(null, obj);
    });
 
}

var procesaResultadoExistencias = (result) => {
	//if(result.length == 0) return;
	var obj = [];
	var existencias = [];
	var intervalo = [];
	//primero separamos los tipos en arrays diferentes
	result.forEach(e => {
		if(e.tipo == 'E') existencias.push(e);
		else if(e.tipo == 'I') intervalo.push(e);
	});
	//ahora buscamos coincidencias de clientes entre los diferentes grupos
	//primero el grupo de existencias con el resto
	if(existencias.length > 0) {
		existencias.forEach(ex => {
			ex.existenciasVentas = ex.venta;
			ex.existenciasCostes = ex.coste;
			delete ex.venta;
			delete ex.coste;
			if(intervalo.length > 0) {
				ex.intervaloVentas = 0;
				ex.intervaloCostes = 0;
				for(var j= 0; j < intervalo.length; j++) {
					if(intervalo[j].encontrado) {

					} else {
						intervalo[j].encontrado = false;
						if(ex.parteId == intervalo[j].parteId) {
							ex.intervaloVentas = intervalo[j].venta;
							ex.intervaloCostes = intervalo[j].coste;
							intervalo[j].encontrado = true;
							break;
						} 
					}
				}
			} else {
				ex.intervaloVentas = 0;
				ex.intervaloCostes = 0;
			}
			for(var i=0; i < intervalo.length; i++) {
				if(intervalo[i].encontrado == true){
					intervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
					i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
				}
			}
	
			
		});
	}
	
	//los que quedan en el array de intervalo no tienen ninguna coincidencuia con los otros
	if(intervalo.length > 0) {	
		intervalo.forEach(i => {
			i.existenciasVentas = 0;
			i.existenciasCostes = 0;
			i.intervaloCostes = i.coste;
			i.intervaloVentas = i.venta
			delete i.venta;
			delete i.coste
		});
	}
	//juntamos todos los grupos
	if(existencias.length > 0) {
		existencias.forEach(ex => {
			obj.push(ex);
		})
	}
	if(intervalo.length > 0) {
		intervalo.forEach(p => {
			obj.push(p);
		})
	}
	
    return obj;
}

//creacion de report json
module.exports.postCrearReporteActividad = function (dFecha, hFecha, callback) {
    var connection = getConnection()
    var obj = 
        {
            libCli: ""
        }
    
	var sql = "SELECT";
	sql += " tmp.tipo,";
	sql += " tmp.comercialId,";
	sql += " tmp.coCodigo,";
	sql += " tmp.coNombre,";	
	sql += " SUM(tmp.venta) AS venta,";
	sql += " SUM(tmp.coste) AS coste,";
	sql += " tmp.inicioIntervalo,";
	sql += " tmp.finIntervalo"
	sql += " FROM"

	sql += " (SELECT"; 
	sql += " 'E' AS tipo,"
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";

	sql += " co.proId AS coCodigo,";
	sql += " co.nombre AS coNombre,";
	sql += " co.comercialId,";

	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente) AS venta, SUM(p.importe_profesional)  AS coste";
	sql += " FROM partes  AS p"; 
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId"; 
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId"
	sql += " WHERE p.fecha_cierre_profesional < '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_cliente >= '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_cliente <= '" + hFecha + " 23:59:59'";
	sql += "  GROUP BY co.comercialId";

	sql += " UNION";

	sql += " SELECT"; 
	sql += " 'P' AS tipo,";
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";

	sql += " co.proId AS coCodigo,";
	sql += " co.nombre AS coNombre,";
	sql += " co.comercialId,";

	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente) AS venta, SUM(p.importe_profesional)  AS coste";
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId"
	sql += " WHERE p.fecha_cierre_cliente < '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_profesional IS NULL";
	sql += " GROUP BY co.comercialId";

	sql += " UNION";

	sql += " SELECT"; 
	sql += " 'PI' AS tipo,";
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";

	sql += " co.proId AS coCodigo,";
	sql += " co.nombre AS coNombre,";
	sql += " co.comercialId,";

	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente) AS venta, SUM(p.importe_profesional)  AS coste";
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId"
	sql += " WHERE p.fecha_cierre_cliente >= '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_cliente <= '" + hFecha + " 23:59:59'";
	sql += " AND (p.fecha_cierre_profesional IS NULL || p.fecha_cierre_profesional > '" + hFecha + " 23:59:59')";
	sql += " GROUP BY co.comercialId";


	sql += " UNION";

	sql += " SELECT";
	sql += " 'I' AS tipo,"
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";

	sql += " co.proId AS coCodigo,";
	sql += " co.nombre AS coNombre,";
	sql += " co.comercialId,";

	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente)  AS venta , SUM(p.importe_profesional)  AS coste"
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId"; 
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId"
	sql += " WHERE p.fecha_cierre_profesional >= '" + dFecha + " 00:00:00' AND p.fecha_cierre_profesional <= '" + hFecha + " 23:59:59'"; 
	sql += " AND p.fecha_cierre_cliente >= '" + dFecha + " 00:00:00' AND p.fecha_cierre_cliente <= '" + hFecha + " 23:59:59'"; 
	sql += " GROUP BY co.comercialId";

	sql += " UNION";

	sql += " SELECT";
	sql += " 'EA' AS tipo,"
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";

	sql += " co.proId AS coCodigo,";
	sql += " co.nombre AS coNombre,";
	sql += " co.comercialId,";

	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente)  AS venta , SUM(p.importe_profesional)  AS coste"
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId"; 
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId"
	sql += " WHERE p.fecha_cierre_profesional < '" + dFecha + " 00:00:00'"; 
	sql += " AND (p.fecha_cierre_cliente IS NULL || p.fecha_cierre_cliente > '" + hFecha + " 23:59:59')"; 
	sql += " GROUP BY co.comercialId";

	sql += " UNION";

	sql += " SELECT";
	sql += " 'EI' AS tipo,"
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";

	sql += " co.proId AS coCodigo,";
	sql += " co.nombre AS coNombre,";
	sql += " co.comercialId,";

	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente)  AS venta , SUM(p.importe_profesional)  AS coste"
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId"; 
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId"
	sql += " WHERE p.fecha_cierre_profesional >= '" + dFecha + " 00:00:00' AND p.fecha_cierre_profesional <= '" + hFecha + " 23:59:59'"; 
	sql += " AND (p.fecha_cierre_cliente > '" + hFecha + " 23:59:59')"; 
	sql += " GROUP BY co.comercialId";

	sql += " UNION"

	sql += " SELECT";
	sql += " 'PA' AS tipo,"
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";

	sql += " co.proId AS coCodigo,";
	sql += " co.nombre AS coNombre,";
	sql += " co.comercialId,";

	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente)  AS venta , SUM(p.importe_profesional)  AS coste"
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId"; 
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId"
	sql += " WHERE p.fecha_cierre_profesional >= '" + dFecha + " 00:00:00' AND p.fecha_cierre_profesional <= '" + hFecha + " 23:59:59'"; 
	sql += " AND p.fecha_cierre_cliente < '" + dFecha + " 00:00:00'"; 
	sql += " GROUP BY co.comercialId";

	
	sql +=") AS tmp"; 
	sql += " GROUP BY tmp.tipo, tmp.comercialId";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
		obj.libCli = procesaResultadoActividad(result);
		

      /*  var resultado = JSON.stringify(obj);
        fs.writeFile(process.env.REPORTS_DIR + "\\reporte_actividad.json", resultado, function(err) {
            if(err) return callback(err);
            //return callback(null, true);
        });  */
        callback(null, obj);
    });
 
}

//creacion de report json
module.exports.postCrearReporteActividadBis = function (dFecha, hFecha, callback) {
    var connection = getConnection()
    var obj = 
        {
            libCli: ""
        }
    
	var sql = "SELECT";
sql += " c.comercialId,"
sql += " c.nombre AS coNombre,"
sql += " c.proId AS coCodigo,"
sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
sql += " COALESCE(e.existenciasCostes, 0) AS existenciasCostes,";
sql += " COALESCE(e.existenciasVentas, 0) AS existenciasVentas,";
sql += " COALESCE(i.intervaloVentas, 0) AS intervaloVentas,";
sql += " COALESCE(i.intervaloCostes, 0) AS intervaloCostes,";
sql += " COALESCE(p.pendientePagoVentas, 0) AS pendientePagoVentas,";
sql += " COALESCE(p.pendientePagoCostes, 0) AS pendientePagoCostes,";
sql += " COALESCE(ppi.pendientePagoVentasIntervalo, 0) AS pendientePagoVentasIntervalo,";
sql += " COALESCE(ppi.pendientePagoCostesIntervalo, 0) AS pendientePagoCostesIntervalo,";
sql += " COALESCE(ea.existenciAnteriorVentas,  0) AS existenciAnteriorVentas,";
sql += " COALESCE(ea.existenciAnteriorCostes, 0) AS existenciAnteriorCostes,";
sql += " COALESCE(pa.pagadoVentas, 0) AS pagadoVentas,";
sql += " COALESCE(ei.existenciaIntervaloVentas, 0) AS existenciaIntervaloVentas,";
sql += " COALESCE(ei.existenciaIntervaloCostes, 0) AS existenciaIntervaloCostes,";
sql += " COALESCE(pa.pagadoCostes, 0) AS pagadoCostes";
sql += " FROM";
sql += " comerciales AS c";
sql += " LEFT JOIN";
sql += " (SELECT ";
sql += " s.clienteId,";
sql += " cli.nombre AS clienteNombre,";
sql += " cli.proId AS cliCodigo,";
sql += " e.nombre AS empresaNombre,";
sql += " co.proId AS coCodigo,";
sql += " co.nombre AS coNombre,";
sql += " co.comercialId,";
sql +=" SUM(p.importe_cliente) AS existenciasVentas, SUM(p.importe_profesional)  AS existenciasCostes";
sql +=" FROM partes  AS p ";
sql +=" LEFT JOIN servicios AS s ON s.servicioId = p.servicioId ";
sql +=" LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
sql +=" LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
sql +=" LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId";
sql +=" WHERE p.fecha_cierre_profesional <  '" + dFecha + " 00:00:00'";
sql +=" AND p.fecha_cierre_cliente >=  '" + dFecha + " 00:00:00'";
sql +=" AND p.fecha_cierre_cliente <=  '" + hFecha + " 23:59:59'";
sql +=" GROUP BY co.comercialId) AS e";

sql += " ON e.comercialId = c.comercialId";
sql += " LEFT JOIN";

sql += " (SELECT ";
sql += " s.clienteId,";
sql += " cli.nombre AS clienteNombre,";
sql += " cli.proId AS cliCodigo,";
sql += " e.nombre AS empresaNombre,";
sql += " co.proId AS coCodigo,";
sql += " co.nombre AS coNombre,";
sql += " co.comercialId,";
sql += " SUM(p.importe_cliente) AS pendientePagoVentas, SUM(p.importe_profesional)  AS pendientePagoCostes";
sql += " FROM partes  AS p ";
sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId ";
sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId";
sql += " WHERE ";
sql += " p.fecha_cierre_cliente <  '" + dFecha + " 00:00:00'";
sql += " AND (p.fecha_cierre_profesional > '" + hFecha + " 23:59:59' OR  p.fecha_cierre_profesional IS NULL)"
sql += " GROUP BY co.comercialId) AS p";
sql += " ";
sql += " ON p.comercialId = c.comercialId";
sql += " ";
sql += " LEFT JOIN";
sql += " ";
sql += " (SELECT ";
sql += " s.clienteId,";
sql += " cli.nombre AS clienteNombre,";
sql += " cli.proId AS cliCodigo,";
sql += " e.nombre AS empresaNombre,";
sql += " co.proId AS coCodigo,";
sql += " co.nombre AS coNombre,";
sql += " co.comercialId,";
sql += " SUM(p.importe_cliente) AS pendientePagoVentasIntervalo, SUM(p.importe_profesional)  AS pendientePagoCostesIntervalo";
sql += " FROM partes  AS p ";
sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId ";
sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId";
sql += " WHERE ";
sql += " p.fecha_cierre_cliente >=  '" + dFecha + " 00:00:00'";
sql += " AND p.fecha_cierre_cliente <=  '" + hFecha + " 23:59:59'";
sql += " AND (p.fecha_cierre_profesional > '" + hFecha + " 23:59:59' OR  p.fecha_cierre_profesional IS NULL)"
sql += " GROUP BY co.comercialId) AS ppi";
sql += " ";
sql += " ON ppi.comercialId = c.comercialId";
sql += " ";
sql += " LEFT JOIN";
sql += " ";
sql += " (SELECT ";
sql += " s.clienteId,";
sql += " cli.nombre AS clienteNombre,";
sql += " cli.proId AS cliCodigo,";
sql += " e.nombre AS empresaNombre,";
sql += " co.proId AS coCodigo,";
sql += " co.nombre AS coNombre,";
sql += " co.comercialId,";
sql += " SUM(p.importe_cliente) AS intervaloVentas, SUM(p.importe_profesional)  AS intervaloCostes";
sql += " FROM partes  AS p ";
sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId ";
sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId";
sql += " WHERE p.fecha_cierre_profesional >=  '" + dFecha + " 00:00:00'";
sql += " AND p.fecha_cierre_profesional <=  '" + hFecha + " 23:59:59'";
sql += " AND p.fecha_cierre_cliente >=  '" + dFecha + " 00:00:00'";
sql += " AND p.fecha_cierre_cliente <=  '" + hFecha + " 23:59:59'";
sql += " GROUP BY co.comercialId) AS i";
sql += " ";
sql += " ON i.comercialId = c.comercialId";
sql += " ";
sql += " LEFT JOIN";
sql += " ";
sql += " (SELECT ";
sql += " s.clienteId,";
sql += " cli.nombre AS clienteNombre,";
sql += " cli.proId AS cliCodigo,";
sql += " e.nombre AS empresaNombre,";
sql += " co.proId AS coCodigo,";
sql += " co.nombre AS coNombre,";
sql += " co.comercialId,";
sql += " SUM(p.importe_cliente) AS existenciAnteriorVentas, SUM(p.importe_profesional)  AS existenciAnteriorCostes";
sql += " FROM partes  AS p ";
sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId ";
sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId";
sql += " WHERE p.fecha_cierre_profesional <  '" + dFecha + " 00:00:00'";
sql += " AND (p.fecha_cierre_cliente IS NULL OR p.fecha_cierre_cliente >  '" + hFecha + " 23:59:59')";
sql += " GROUP BY co.comercialId) AS ea";
sql += " ";
sql += " ON ea.comercialId = c.comercialId";
sql += " ";
sql += " LEFT JOIN";
sql += " ";
sql += " (SELECT ";
sql += " s.clienteId,";
sql += " cli.nombre AS clienteNombre,";
sql += " cli.proId AS cliCodigo,";
sql += " e.nombre AS empresaNombre,";
sql += " co.proId AS coCodigo,";
sql += " co.nombre AS coNombre,";
sql += " co.comercialId,";
sql += " SUM(p.importe_cliente) AS existenciaIntervaloVentas, SUM(p.importe_profesional)  AS existenciaIntervaloCostes";
sql += " FROM partes  AS p ";
sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId ";
sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId";
sql += " WHERE p.fecha_cierre_profesional >=  '" + dFecha + " 00:00:00' AND p.fecha_cierre_profesional <=  '" + hFecha + " 23:59:59'";
sql += " AND (p.fecha_cierre_cliente IS NULL OR p.fecha_cierre_cliente >  '" + hFecha + " 23:59:59')";
sql += " GROUP BY co.comercialId) AS ei";
sql += " ";
sql += " ON ei.comercialId = c.comercialId";
sql += " ";
sql += " LEFT JOIN";
sql += " ";
sql += " (SELECT ";
sql += " s.clienteId,";
sql += " cli.nombre AS clienteNombre,";
sql += " cli.proId AS cliCodigo,";
sql += " e.nombre AS empresaNombre,";
sql += " co.proId AS coCodigo,";
sql += " co.nombre AS coNombre,";
sql += " co.comercialId,";
sql += " SUM(p.importe_cliente) AS pagadoVentas, SUM(p.importe_profesional)  AS pagadoCostes";
sql += " FROM partes  AS p ";
sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId ";
sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId";
sql += " WHERE p.fecha_cierre_profesional >=  '" + dFecha + " 00:00:00' AND p.fecha_cierre_profesional <=  '" + hFecha + " 23:59:59'";
sql += " AND (p.fecha_cierre_cliente <  '" + dFecha + " 00:00:00')";
sql += " GROUP BY co.comercialId) AS pa";
sql += " ";
sql += " ON pa.comercialId = c.comercialId";
sql += " ";
sql += " WHERE NOT e.comercialId IS NULL OR";
sql += " NOT p.comercialId IS NULL OR";
sql += " NOT ppi.comercialId IS NULL OR";
sql += " NOT i.comercialId IS NULL OR";
sql += " NOT ei.comercialId IS NULL OR";
sql += " NOT ea.comercialId IS NULL OR";
sql += " NOT pa.comercialId IS null";
	
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
		recuperaTotalServicios(dFecha, hFecha, function(err, result2) {
        	if (err) return callback(err, null);
			obj.libCli = procesaResultadoActividadBis(result, result2);
			/*var resultado = JSON.stringify(obj);
				fs.writeFile(process.env.REPORTS_DIR + "\\reporte_actividad.json", resultado, function(err) {
            		if(err) return callback(err);
            			//return callback(null, true);
        		}); */
        
			callback(null, obj);
		});
    });
 
}

var procesaResultadoActividadBis = (result, totServicios) => {
	//if(result.length == 0) return;
	var obj = [];
	var obj2 = [];
	obj = result;
	obj2 = totServicios;
	
	

	//asignamos el total de servicios a cada proveedor
	if(obj.length > 0) {
		if(obj2.length > 0) {
			obj.forEach(o => {
				for(var i = 0; i < obj2.length; i++) {
					if(obj2[i].comercialId == o.comercialId) {
						o.totalServicios = obj2[i].totalServicios;
						break;
					}
				}
			});
		}
		
		//una vez montado el objeto calculamos los totales y el beneficio industrial
		obj.forEach(o => {
			o.totalPendienteVentas = o.pendientePagoVentas+o.pendientePagoVentasIntervalo;
			o.totalPendienteCostes = o.pendientePagoCostes+o.pendientePagoCostesIntervalo;
			o.totalVentas = o.existenciasVentas+o.intervaloVentas+o.pendientePagoVentasIntervalo;
			o.totalCostes = o.existenciasCostes+o.intervaloCostes+o.pendientePagoCostesIntervalo;
			
			o.bi = o.totalVentas-o.totalCostes;
		});
	}
	
    return obj;
}

var recuperaTotalServicios = function (dFecha, hFecha, callback) {
	var connection = getConnection()
	sql = " SELECT ";
	sql += " c.comercialId,";
	sql += " COALESCE(ee.numServicios1, 0) +";
	sql += " COALESCE(ff.numServicios2, 0) +";
	sql += " COALESCE(gg.numServicios3, 0) +";
	sql += " COALESCE(hh.numServicios4, 0) +";
	sql += " COALESCE(ii.numServicios5, 0) +";
	sql += " COALESCE(jj.numServicios6, 0) +";
	sql += " COALESCE(kk.numServicios7, 0) AS totalServicios";
	sql += " FROM comerciales AS c ";

	sql += " LEFT JOIN ";

	sql += " (";
	sql += " SELECT ";
	sql += " comercialId,";
	sql += " COUNT(*) AS numServicios1";
	sql += " FROM ";
	sql += " (";
	sql += " SELECT DISTINCT ";
	sql += " co.comercialId, ";
	sql += " s.servicioId,";
	sql += " p.parteId ";
	sql += " FROM partes  AS p ";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId  ";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId ";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId ";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId ";
	sql += " WHERE p.fecha_cierre_profesional <  '" + dFecha + "' AND p.fecha_cierre_cliente >=  '" + dFecha + "' ";
	sql += " AND p.fecha_cierre_cliente <=  '" + hFecha + "' ";
	sql += " GROUP BY  1 ,2)";
	sql += "  AS e GROUP BY comercialId ";
	sql += "  ) AS ee ON ee.comercialId = c.comercialId";

	sql += "  LEFT JOIN ";

	sql += " (";
	sql += " SELECT";
	sql += " comercialId,";
	sql += " COUNT(*) AS numServicios2";
	sql += " FROM ";
	sql += " (";
	sql += " SELECT DISTINCT";
	sql += " co.comercialId, ";
	sql += " s.servicioId,";
	sql += " p.parteId ";
	sql += " FROM partes  AS p ";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId  ";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId ";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId ";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId ";
	sql += " WHERE ";
	sql += " p.fecha_cierre_cliente <  '" + dFecha + "' AND ";
	sql += " (p.fecha_cierre_profesional > '" + hFecha + "' OR  p.fecha_cierre_profesional IS NULL)";
	sql += " GROUP BY  1 ,2)";
	sql += " AS f GROUP BY comercialId ";
	sql += " ) AS ff ON ff.comercialId = c.comercialId";

	sql += " LEFT JOIN  ";

	sql += " (";
	sql += " SELECT";
	sql += " comercialId,";
	sql += " COUNT(*) AS numServicios3";
	sql += " FROM ";
	sql += " (";
	sql += " SELECT DISTINCT";
	sql += " co.comercialId, ";
	sql += " s.servicioId,";
	sql += " p.parteId ";
	sql += " FROM partes  AS p ";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId  ";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId ";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId ";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId ";
	sql += " WHERE ";
	sql += " p.fecha_cierre_cliente >=  '" + dFecha + "' AND ";
	sql += " p.fecha_cierre_cliente <=  '" + hFecha + "' AND ";
	sql += " (p.fecha_cierre_profesional > '" + hFecha + "'  OR  p.fecha_cierre_profesional IS NULL)";
	sql += " GROUP BY  1 ,2)";
	sql += " AS g GROUP BY comercialId ";
	sql += " ) AS gg ON gg.comercialId = c.comercialId";

	sql += " LEFT JOIN  ";

	sql += " (";
	sql += " SELECT ";
	sql += " comercialId,";
	sql += " COUNT(*) AS numServicios4";
	sql += " FROM ";
	sql += " (";
	sql += " SELECT DISTINCT";
	sql += " co.comercialId, ";
	sql += " s.servicioId,";
	sql += " p.parteId ";
	sql += " FROM partes  AS p ";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId  ";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId ";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId ";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId ";
	sql += " WHERE ";
	sql += " p.fecha_cierre_profesional >=  '" + dFecha + "' AND ";
	sql += " p.fecha_cierre_profesional <=  '" + hFecha + "' AND ";
	sql += " p.fecha_cierre_cliente >=  '" + dFecha + "' AND ";
	sql += " p.fecha_cierre_cliente <=  '" + hFecha + "' ";
	sql += " GROUP BY  1 ,2)";
	sql += " AS h GROUP BY comercialId ";
	sql += " ) AS hh ON hh.comercialId = c.comercialId";

	sql += " LEFT JOIN  ";

	sql += " (";
	sql += " SELECT ";
	sql += " comercialId,";
	sql += " COUNT(*) AS numServicios5";
	sql += " FROM ";
	sql += " (";
	sql += " SELECT DISTINCT";
	sql += " co.comercialId, ";
	sql += " s.servicioId,";
	sql += " p.parteId ";
	sql += " FROM partes  AS p ";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId  ";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId ";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId ";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId ";
	sql += " WHERE ";
	sql += " p.fecha_cierre_profesional <  '" + dFecha + "' AND ";
	sql += " (p.fecha_cierre_cliente IS NULL OR p.fecha_cierre_cliente > '" + hFecha + "')";
	sql += " GROUP BY  1 ,2)";
	sql += " AS i GROUP BY comercialId ";
	sql += " ) AS ii ON ii.comercialId = c.comercialId";
		  
	sql += " LEFT JOIN";
		  
	sql += " (";
	sql += " SELECT ";
	sql += " comercialId,";
	sql += " COUNT(*) AS numServicios6";
	sql += " FROM ";
	sql += " (";
	sql += " SELECT DISTINCT";
	sql += " co.comercialId, ";
	sql += " s.servicioId,";
	sql += " p.parteId ";
	sql += " FROM partes  AS p ";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId  ";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId ";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId ";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId ";
	sql += " WHERE ";
	sql += " p.fecha_cierre_profesional >=  '" + dFecha + "' AND ";
	sql += " p.fecha_cierre_profesional <=  '" + hFecha + "' AND ";
	sql += " (p.fecha_cierre_cliente IS NULL OR p.fecha_cierre_cliente >  '" + hFecha + "')";
	sql += " GROUP BY  1 ,2)";
	sql += " AS j GROUP BY comercialId ";
	sql += " ) AS jj ON jj.comercialId = c.comercialId";

	sql += " LEFT JOIN  ";

	sql += " (";
	sql += " SELECT ";
	sql += " comercialId,";
	sql += " COUNT(*) AS numServicios7";
	sql += " FROM ";
	sql += " (";
	sql += " SELECT DISTINCT";
	sql += " co.comercialId, ";
	sql += " s.servicioId,";
	sql += " p.parteId ";
	sql += " FROM partes  AS p ";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId  ";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId ";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId ";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = s.agenteId ";
	sql += " WHERE ";
	sql += " p.fecha_cierre_profesional >=  '" + dFecha + "' AND ";
	sql += " p.fecha_cierre_profesional <=  '" + hFecha + "' AND ";
	sql += " (p.fecha_cierre_cliente <  '" + dFecha + "')";
	sql += " GROUP BY  1 ,2)";
	sql += " AS k GROUP BY comercialId ";
	sql += " ) AS kk ON kk.comercialId = c.comercialId";

	sql += " WHERE ";
	sql += " NOT ee.numServicios1 IS NULL OR";
	sql += " NOT ff.numServicios2 IS NULL OR";
	sql += " NOT gg.numServicios3 IS NULL OR";
	sql += " NOT hh.numServicios4 IS NULL OR";
	sql += " NOT ii.numServicios5 IS NULL OR";
	sql += " NOT jj.numServicios6 IS NULL OR";
	sql += " NOT kk.numServicios7 IS NULL ";
	
	connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err, null);
        callback(null, result);
    });
 
}

//creacion de report json
module.exports.postCrearListadoPagosProfesionales = function (dFecha, hFecha, empresaId, callback) {
    var connection = getConnection()
    var obj = 
        {
        	libPro: ""
        }
    
	var sql = "SELECT";

	sql += " pro.proveedorId,"; 
	sql += " pro.nombre AS proveedorNombre,"; 
	sql += " pro.codigoProfesional AS codigo,";
	sql += " ac.empresaNombre AS empresaNombre1,";
	sql += " aa.empresaNombre AS empresaNombre2,";
	sql += " pp.empresaNombre AS empresaNombre3,";
	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(COALESCE(ac.base, 0)) AS actuacionesCerradas,"; 
	sql += " SUM(COALESCE(ac.iva, 0)) AS actuacionesCerradasIva,";
	sql += " SUM(COALESCE(ac.contado, 0)) AS actuacionesCerradasContado,";
	
	sql += " SUM(COALESCE(aa.base, 0)) AS actuacionesAbiertas,"; 
	sql += " SUM(COALESCE(aa.iva, 0)) AS actuacionesAbiertasIva,";
	sql += " SUM(COALESCE(aa.contado, 0)) AS actuacionesAbiertasContado,";

	sql += " SUM(COALESCE(pp.base,0)) AS PendientePago,"; 
	sql += " SUM(COALESCE(pp.iva, 0)) AS PendientePagoIva,";
	sql += " SUM(COALESCE(pp.contado, 0)) AS pendientePagoContado";

	sql += " FROM proveedores AS pro";
	
	sql += " LEFT JOIN";
	
	sql += " (SELECT";
	sql += " p.proveedorId,";
	sql += " e.nombre AS empresaNombre,";
	sql += " SUM(p.importe_profesional)  AS base,";
	sql += " SUM(p.importe_profesional_iva)-SUM(p.importe_profesional) AS iva,";
	sql += " SUM(p.aCuentaProfesional) AS contado";
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = p.proveedorId";
	sql += " WHERE p.fecha_cierre_profesional >= '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_profesional <= '" + hFecha + " 23:59:59'";
	sql += " AND p.fecha_cierre_cliente >=  '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_cliente <=  '" + hFecha + " 23:59:59'";
	if(empresaId > 0) {
		sql += " AND e.empresaId = " + empresaId
	}
	sql += " GROUP BY pro.proveedorId) AS ac";
	sql += " ON ac.proveedorId = pro.proveedorId";
	
	sql += " LEFT JOIN";
	
	sql += " (SELECT";
	sql += " p.proveedorId,";
	sql += " e.nombre AS empresaNombre,";
	sql += " SUM(p.importe_profesional)  AS base,";
	sql += " SUM(p.importe_profesional_iva)-SUM(p.importe_profesional) AS iva,";
	sql += " SUM(p.aCuentaProfesional) AS contado";
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = p.proveedorId";
	sql += " WHERE p.fecha_cierre_profesional >= '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_profesional <= '" + hFecha + " 23:59:59'";
	sql += " AND (p.fecha_cierre_cliente IS NULL OR p.fecha_cierre_cliente > '" + hFecha + " 23:59:59')";
	if(empresaId > 0) {
		sql += " AND e.empresaId = " + empresaId
	}
	sql += " GROUP BY pro.proveedorId) AS aa";
	
	sql += " ON aa.proveedorId = pro.proveedorId";
	
	sql += " LEFT JOIN";
	
	sql += " (SELECT";
	sql += " p.proveedorId,";
	sql += " e.nombre AS empresaNombre,";
	sql += " SUM(p.importe_profesional)  AS base,";
	sql += " SUM(p.importe_profesional_iva)-SUM(p.importe_profesional) AS iva,";
	sql += " SUM(p.aCuentaProfesional) AS contado";
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = p.proveedorId";
	sql += " WHERE p.fecha_cierre_profesional >= '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_profesional <= '" + hFecha + " 23:59:59'";
	sql += " AND p.fecha_cierre_cliente <'" + dFecha + " 00:00:00'";
	if(empresaId > 0) {
		sql += " AND e.empresaId = " + empresaId
	}
	sql += " GROUP BY pro.proveedorId) AS pp";
	
	sql += " ON pp.proveedorId = pro.proveedorId";
	
	sql += " WHERE";
	sql += " NOT ac.base IS NULL OR";
	sql += " NOT aa.base IS NULL OR"; 
	sql += " NOT pp.base IS NULL";
	sql += " GROUP BY pro.proveedorId";
	sql += " ORDER BY pro.codigoProfesional"
	 
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
		if (err) return callback(err, null);
		//seleccionamos ahora las facturas que existan con las mismas condiciones para extraer la fianza, los anticipos y la posible retencion
		var connection2 = getConnection()
		var sql2 = "SELECT DISTINCT";
		sql2 += " p.proveedorId,";
		sql2 += " f.facproveId,";
		sql2 += " COALESCE(f.fianza, 0) AS fianza,";
		sql2 += " COALESCE(f.importeAnticipo, 0) AS anticipo,";
		sql2 += " COALESCE(f.importeRetencion, 0) AS retencion";
		sql2 += " FROM partes  AS p";
		sql2 += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId";
		sql2 += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
		sql2 += " LEFT JOIN proveedores AS pro ON pro.proveedorId = p.proveedorId";
		sql2 += " LEFT JOIN facprove AS f ON f.facproveId = p.facproveId";
		sql2 += " WHERE";
		sql2 += " (p.fecha_cierre_profesional >= '" + dFecha + " 00:00:00'";
		sql2 += " AND p.fecha_cierre_profesional <= '" + hFecha + " 23:59:59'";
		sql2 += " AND p.fecha_cierre_cliente >= '" + dFecha + " 00:00:00'";
		sql2 += " AND p.fecha_cierre_cliente <= '" + hFecha + " 23:59:59') OR";
		sql2 += " ( p.fecha_cierre_profesional >= '" + dFecha + " 00:00:00'";
		sql2 += " AND p.fecha_cierre_profesional <= '" + hFecha + " 23:59:59'";
		sql2 += " AND (p.fecha_cierre_cliente IS NULL OR p.fecha_cierre_cliente > '" + hFecha + " 23:59:59')) OR";
		sql2 += " ( p.fecha_cierre_profesional >= '" + dFecha + " 00:00:00'";
		sql2 += " AND p.fecha_cierre_profesional <= '" + hFecha + " 23:59:59'";
		sql2 += " AND p.fecha_cierre_cliente < '" + dFecha + " 00:00:00')";
		if(empresaId > 0) {
			sql2 += " AND e.empresaId = " + empresaId;
		}
		sql2 += " ORDER BY p.proveedorId";
		connection2.query(sql2, function (err, result2) {
			closeConnectionCallback(connection2, callback);
			if (err) return callback(err, null);
			obj.libPro = procesaResultadoPagoProfesionales(result, result2);
			/* var resultado = JSON.stringify(obj);
			fs.writeFile(process.env.REPORTS_DIR + "\\pago_profesionales.json", resultado, function(err) {
				if(err) return callback(err);
				//return callback(null, true);
			});  */
			callback(null, obj);
		});
    });
 
}

//creacion de report json
module.exports.postCrearListadoActuacionesUsuario = function (dFecha, hFecha, usuarioId, callback) {
    var connection = getConnection()
    var obj = 
        {
        	libUsu: ""
        }
    var fechaActual = new Date();
	var sql = "SELECT";
	sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as inicioIntervalo,";
	sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as finIntervalo,";
	sql +=  " '" + moment(fechaActual).format('DD/MM/YYYY') + "' as fechaActual,";
	sql += " p.operadorId,";
	sql += " u.nombre AS usuNombre,"
	sql += " c.proId AS codigoCliente,";
	sql += " c.nombre as ClienteNombre,";
	sql += " pr.codigo AS codigoProveedor,";
	sql += " s.direccionTrabajo,";
	sql += " p.tipoProfesionalId,";
	sql += " tp.nombre AS profesionNombre,";
	sql += " s.numServicio, p.numParte,";
	sql += " p.fecha_cierre_cliente AS fechaCierreCli,";
	sql += " p.fecha_cierre_profesional AS fechaCierrePro,";
	sql += " SUM(pl.importeCliente) AS importeCliente,";
	sql += " SUM(pl.importeProveedor) AS importeProveedor";
	sql += " FROM partes AS P";
	sql += " LEFT JOIN partes_lineas AS pl ON pl.parteId = p.parteId";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId";
	sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = p.tipoProfesionalId";
	sql += " LEFT JOIN clientes AS c ON c.clienteId = s.clienteId";
	sql += " LEFT JOIN proveedores AS pr ON pr.proveedorId = p.proveedorId";
	sql += " LEFT JOIN usuarios AS u ON u.usuarioId = s.usuarioId";
	sql += " WHERE p.fecha_cierre_cliente BETWEEN  '" + dFecha + " 00:00:00' AND '" + hFecha + " 00:00:00' AND NOT p.facturaId IS NULL";
	if(usuarioId > 0) {
		sql += " AND p.operadorId = " + usuarioId
	}
	sql += " GROUP BY p.parteId";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
		if (err) return callback(err, null);
		//formateamos las fechas
		if(result && result.length > 0) {
			for(var i = 0; i < result.length; i++) {
				var r = result[i];
				r.fechaCierreCli = moment(r.fechaCierreCli).format('DD/MM/YYYY');
				if(r.fechaCierrePro ) {
					r.fechaCierrePro = moment(r.fechaCierrePro).format('DD/MM/YYYY');
				} else {
					r.fechaCierrePro = '';
				}
			}
		}
		obj.libUsu = result;
		/* var resultado = JSON.stringify(obj);
		fs.writeFile(process.env.REPORTS_DIR + "\\actuaciones_cerradas.json", resultado, function(err) {
			if(err) return callback(err);
			//return callback(null, true);
		});  */
		callback(null, obj);
    });
 
}

module.exports.getMarcaConta = function (parteId, done) {
	var con = getConnection();
	var sql = "SELECT p.facturaId, fc.contabilizada AS facCliConta, p.facproveId, fp.contabilizada AS facProConta";
	sql += " FROM partes AS p";
	sql += " LEFT JOIN facturas AS fc ON fc.facturaId = p.facturaId";
	sql += " LEFT JOIN facprove AS fp ON fp.facproveId = p.facproveId";
	sql += " WHERE p.parteId = ?";
	sql = mysql.format(sql, parteId);
	con.query(sql, function (err, result) {
		con.end();
		if (err) return done(err);
		done(null, result[0]);
	});
}

//ENVIO CORREO PARTE CERRADO
// crearCorreosAEnviar
module.exports.crearCorreosAEnviarCerrado = (datos, callback) => {
	//RECUPERAMOS EL CORREO DE LA EMPRESA

    // 1- creamos un correo con un asunto por defecto y sin texto
    var correo = {};
   
        var asunto = 'PARTE CERRADO'
        var texto = "El proveedor " + datos.proveedorNombre  + " ha cerrado el parte numero " + datos.numParte;
		var enlace = "<br>" + process.env.REP_CLIEN + "#!/top/serviciosForm?servicioId=" + datos.servicioId + "&parteId=" + datos.parteId
    
    
    correo = {
		emisor: datos.email,
		destinatario: process.env.EMAIL_REP,
		asunto: asunto,
		cuerpo: texto + enlace
	}

    correoAPI.sendCorreo(correo, null, false, false, (err) => {
		if (err) {
			return callback(err);
		} else {
			callback(null, null);
		}
	});

}

// crearCorreosAEnviar
module.exports.crearCorreosAEnviar = (datos, callback) => {
	//RECUPERAMOS EL CORREO DE LA EMPRESA

    // 1- creamos un correo con un asunto por defecto y sin texto
    var correo = {};
   
		//por defecto el correo es de parte rechazado
        var asunto = 'PARTE RECHAZADO'
		var opcion = " ha rechazado";

		//si se ha aceptado el parte
		if(datos.opcion == true) {
			asunto = 'PARTE ACEPTADO';
			opcion = ' ha aceptado'
		}

		//si no se ha aceptado a tiempo el parte
		if(datos.opcion == null) {
			opcion = ' no ha aceptado a tiempo'
		}
        var texto = "El proveedor " + datos.proveedorNombre  + " "  + opcion + " la solicitud del parte numero " + datos.numParte + " en la dirección " + datos.direccionTrabajo;
		var enlace = "<br>" + process.env.REP_CLIEN + "#!/top/serviciosForm?servicioId=" + datos.servicioId + "&parteId=" + datos.parteId;
    
    correo = {
		emisor: datos.email,
		destinatario: process.env.EMAIL_REP,
		asunto: asunto,
		cuerpo: texto + enlace
	}
	

    correoAPI.sendCorreo(correo, null, false, false, function(err){
		if (err) {
			return callback(err, null);
		} else {
			callback(null, null);
		}
	});

}

module.exports.getParteFotos = (parteId, callback) => {
	var connection = getConnection();
	var sql = "SELECT * FROM  parte_fotos";
	sql += " WHERE parteId = ?";
	sql += " ORDER BY parteFotoId";
		sql = mysql.format(sql, parteId);
		connection.query(sql, function(err, parteFotos){
			closeConnectionCallback(connection, callback);
			if (err) return callback(err);
			if(parteFotos.length == 0) return callback(null, null);
			callback(null, parteFotos);
		});
	

}



//CREAR PARTE FOTOS
module.exports.postParteFotos = (parteFotos, callback) => {
	var connection = getConnection();
	var sql = "INSERT INTO parte_fotos SET ?";
		sql = mysql.format(sql, parteFotos);
		connection.query(sql, function(err, result){
			closeConnectionCallback(connection, callback);
			if (err) return callback(err);
			parteFotos.parteFotoId = result.insertId;
			callback(null, parteFotos);
		});
}

//CREAR PDF PARTE
module.exports.getPdfParte = (servicioId, parteId, empresa, callback) => {
	crearObjJsonParte(servicioId, parteId, (err, obj) => {
		if (err) return callback(err, null);
			exportToPdf(obj, (err, data) => {
				if (err) return callback(err, null);
				uploadParte(data, empresa,(err, result) => {
					if (err) return callback(err, null);
					return callback(null, result);

				});
				
			});
	});
}

//CREAR JSON PARTE
module.exports.getJsonParte = (servicioId, parteId, callback) => {
	crearObjJsonParte(servicioId, parteId, (err, obj) => {
		if (err) return callback(err, null);
		return callback(null, obj)
	});
}

//DECODIFICAR FOTOS
module.exports.decodeData = (b64, callback) => {
	//pasamos el objeto de base64 a blob
	var src = ""
	try {
		
		
		let data = b64.datos;

		let buff = new Buffer.from(data, 'base64');
		//fs.writeFileSync('stack-abuse-logo-out.png', buff);

		
		fs.writeFileSync(process.env.PARTE_DIR + "\\" + b64.nombre , buff);

		parametrosDb.getParametros(function(err, parametros) {
			if (err) return callback(err);
			var p = parametros[0];
			//AWS
			AWS.config.region = p.bucket_region;
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			  IdentityPoolId:  p.identity_pool,
			});
			var fileKey =  b64.nombre;
			src = process.env.PARTE_DIR + "\\" + b64.nombre
			const fileContent = fs.readFileSync(src);
			
		var params = {
			Bucket: p.bucket,
			Key: fileKey,
			IdentityPoolId: p.identity_pool,
			Body: fileContent,
			ACL: "public-read"
		}
		// Use S3 ManagedUpload class as it supports multipart uploads
		var upload = new AWS.S3.ManagedUpload({
			params: params
		});
		var promise = upload.promise();
		promise
		.then (
			data => {
				if(data) {
					var re = /https/gi;
					var str = data.Location;
					data.Location = str.replace(re, "http");
					fs.unlinkSync(src);
					callback(err, data)
				}
				
			},
			err =>{
			 return callback(err);
			}
		);
		
		});
		
		} catch(err) {
			console.log(err);
			return callback(err);
		}
}


//DECODIFICAR FOTOS
module.exports.decodeFirma = (b64, callback) => {
	//pasamos el objeto de base64 a blob
	var src = "";
	try {
		
		
		let data = b64.datos;

		let buff = new Buffer(data, 'base64');
		//fs.writeFileSync('stack-abuse-logo-out.png', buff);

		
		fs.writeFileSync(process.env.PARTE_DIR + "\\" + b64.nombre , buff);

		parametrosDb.getParametros(function(err, parametros) {
			if (err) return callback(err);
			var p = parametros[0];
			//AWS
			AWS.config.region = p.bucket_region;
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			  IdentityPoolId:  p.identity_pool,
			});
			var fileKey =  b64.nombre;
			src = process.env.PARTE_DIR + "\\" + b64.nombre
			const fileContent = fs.readFileSync(src);
		var params = {
			Bucket: p.bucket,
			Key: fileKey,
			IdentityPoolId: p.identity_pool,
			Body: fileContent,
			ACL: "public-read"
		}
		// Use S3 ManagedUpload class as it supports multipart uploads
		var upload = new AWS.S3.ManagedUpload({
			params: params
		});
		var promise = upload.promise();
		promise
		.then (
			data => {
				if(data) {
					var re = /https/gi;
					var str = data.Location;
					data.Location = str.replace(re, "http");
					fs.unlinkSync(src);
					callback(err, data)
				}
				
			},
			err =>{
			 return callback(err);
			}
		);
		
		});
		
		} catch(err) {
			console.log(err);
			return callback(err);
		}
}

//CREAR OBJETO PARA PARTE APPMOVIL
var crearObjJsonParte = (servicioId, parteId, callback) => {
    var connection = getConnection();
	try{
		var obj = 
		{
			cabecera: "",
			locales: "",
			lineas: "",
		}
		//cabecera parte
		var sql = "SELECT ";
		sql +=" p.parteId,";
		sql +=" p.servicioId,";
		sql +=" p.numParte,";
		sql +=" g.nombre AS garantia_trabajos,";
		sql +=" COALESCE(DATE_FORMAT(p.fecha_reparacion,'%d/%m/%Y'), '') AS fecha_reparacion,";
		sql +=" IF(p.observacionesDelProfesional = '', 'NOVISIBLE', IFNULL(p.observacionesDelProfesional, 'NOVISIBLE')) AS observacionesDelProfesional,";
		sql +=" IF(p.trabajos_realizados = '', 'NOVISIBLE', IFNULL(p.trabajos_realizados, 'NOVISIBLE')) AS trabajos_realizados,";
		sql +=" IF(p.trabajosPendientes = '', 'NOVISIBLE', IFNULL(p.trabajosPendientes, 'NOVISIBLE')) AS trabajosPendientes,";
		sql +=" p.descripcion_averia,";
		sql +=" p.nombreFirmante,";
		sql +=" p.apellidosFirmante,";
		sql +=" p.dniFirmante,";
		sql +=" p.cargoFirmante,";
		sql +=" p.firma,";
		sql +=" p.noFirma,";
		sql += "p.presupuesto,";
		sql += "p.refPresupuesto,"
		sql +=" c.nombre AS nombreCliente,";
		sql +=" pr.nombre AS nombreProveedor,";
		sql +=" tp.nombre AS tipoVia,";
		sql +=" c.direccion2 AS direccionTrabajo,";
		sql +=" c.poblacion2 AS poblacionTrabajo,";
		sql +=" fp.nombre AS formaPagoProveedor,";
		sql +=" fp2.nombre AS formaPagoCliente,";
		sql +=" fp.formaPagoId AS formaPagoProveedorId,";
		sql +=" fp2.formaPagoId AS formaPagoClienteId,";
		sql +=" p.empresaParteId AS empresaId,";
		sql +=" e.logoUrl,";
		sql +=" e.telefono1,";
		sql +=" e.emailReparaciones AS email";
		sql +=" FROM partes AS p";
		sql +=" LEFT JOIN servicios AS s ON s.servicioId = p.servicioId";
		sql +=" LEFT JOIN clientes AS c ON c.clienteId = s.clienteId";
		sql +=" LEFT JOIN proveedores AS pr ON pr.proveedorId = p.proveedorId";
		sql +=" LEFT JOIN tipos_via AS tp ON tp.tipoViaId = c.tipoviaId2";
		sql +=" LEFT JOIN formas_pago AS fp ON fp.formaPagoId = p.formaPagoProfesionalId";
		sql +=" LEFT JOIN formas_pago AS fp2 ON fp2.formaPagoId = p.formaPagoClienteId";
		sql +=" LEFT JOIN empresas AS e ON e.empresaId = p.empresaParteId";
		sql +=" LEFT JOIN tipos_garantia AS g ON g.tipoGarantiaId = p.tipoGarantiaId";
		sql +=" WHERE p.parteId = ?";
		sql = mysql.format(sql, parteId);
		connection.query(sql, function (err, result) {
		connection.end();
		if (err)    return callback(err, null);
		if(result[0].fecha_reparacion) {
			result[0].fecha_reparacion = result[0].fecha_reparacion.toString();
		}
		obj.cabecera = result[0];
		//locales afectados parte
		connection = getConnection();
		sql = " SELECT la.* FROM locales_afectados AS la";
		sql += " INNER JOIN servicios AS ser ON ser.servicioId = la.servicioId";
		sql += " INNER JOIN partes_locales AS pl ON la.localAfectadoId = pl.localesAfectadosId";
		sql += " WHERE ser.servicioId = ? AND pl.parteId = ?";
		sql = mysql.format(sql, [servicioId, parteId]);
		connection.query(sql, function (err, result2) {
			connection.end();
			if (err)    return callback(err, null);
			obj.locales = result2;
			//trabajos del parte
			connection = getConnection();
			sql = "SELECT ";
			sql += " pt.parteLineaId, ";
			sql += " pt.parteId, ";
			sql += " pt.codigoArticulo, ";
			sql += " pt.unidades, ";
			sql += " pt.descripcion, ";
			sql += " pt.ivaCliente,";
			sql += " pt.ivaProveedor,";
			sql += " a.nombre AS nombreArticulo,";
			sql += " a.administracion,"
			sql += " pt.importeProveedor,";
			sql += " pt.importeCliente,";
			sql += " pt.precioProveedor,";
			sql += " pt.precioCliente,";
			sql += " pt.importeProveedorIva,";
			sql += " pt.importeClienteIva,";
			sql += " pt.totalClienteIva,"
			sql += " pt.totalProveedorIva,";
			sql += " COALESCE(pt.tiempoTrabajo, 0) AS tiempoTrabajo,";
			sql += " pt.horaEntrada,";
			sql += " pt.horaSalida,"
			sql += " u.abrev AS unidadTipo";
			sql += " FROM partes_lineas AS pt";
			sql += " LEFT JOIN partes AS par ON par.parteId = pt.parteId";
			sql += " LEFT JOIN articulos AS a ON a.codigoReparacion = pt.codigoArticulo";
			sql += " LEFT JOIN unidades AS u ON u.unidadId = a.unidadId";
			sql += " WHERE par.parteId = ? AND NOT a.codigoReparacion IS NULL";
			sql = mysql.format(sql, parteId);
			connection.query(sql, function (err, result3) {
				connection.end();
				if (err)    return callback(err, null);
				var horas = 0;
				obj.cabecera.administracion = false//por defecto el parte es de tarifas
				if(result3.length > 0) {
					result3.forEach(e => {
						if(e.tiempoTrabajo) {
							if(e.tiempoTrabajo > 0) {
								obj.cabecera.horasTrabajo = e.tiempoTrabajo;
							}
						}
						if(e.horaEntrada && e.horaSalida) {
							var hEntrada = new Date(e.horaEntrada);
							var hSalida = new Date(e.horaSalida);
							
							var hEntrada = new Date(e.horaEntrada);
								obj.cabecera.horaEntrada = moment(hEntrada).format("hh:mm a");
								obj.cabecera.horaSalida = moment(hSalida).format("hh:mm a");
						}

						if(e.administracion) {
							obj.cabecera.administracion = true //si alguna de las lineas es de administración
															   // el parte entero es de administración
						}
						//SI LA FORMA DE PAGO ES EFECTIVO LOS IMPORTES SON LOS DEL CLIENTE
						if(obj.cabecera.formaPagoClienteId == 6 || obj.cabecera.formaPagoClienteId == 18 || obj.cabecera.formaPagoClienteId == 21) {
							e.importe = e.importeCliente;
							e.precio = e.precioCliente;
							e.importeIva = e.importeClienteIva;
							e.totalIva = e.totalClienteIva;
							e.iva = e.ivaCliente
						} else {
							e.importe = 0;
							e.precio = 0;
							e.importeIva = 0;
							e.totalIva = 0;
							e.iva = 0;
						}
						
					});
				}
				obj.lineas = result3;
				return callback(null, obj);
				
			});
		});
	});
	}catch(e) {
		console.log(e);
	}
                    
}


var exportToPdf = (obj, callback) => {
	var resultado = JSON.stringify(obj);
	var mrt = "parte.mrt"
	if(obj.cabecera.empresaId == 3)  mrt = "parte_fondo.mrt";
			fs.writeFile(process.env.REPORTS_DIR + "\\parte.json", resultado, function(err) {
			if(err) return callback(err);
			//return callback(null, true);
			});
			Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
    		Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
			var nomfich = obj.cabecera.numParte;
			var parteId =  obj.cabecera.parteId;
			var report = new Stimulsoft.Report.StiReport();
			var file = "";
			file = process.env.REPORTS_DIR + "\\" + mrt;
			report.loadFile(file);

			var dataSet = new Stimulsoft.System.Data.DataSet("part");
			dataSet.readJson(obj);
			
			 // Remove all connections from the report template
			 report.dictionary.databases.clear();
		
			 //
			report.regData(dataSet.dataSetName, "", dataSet);
			report.dictionary.synchronize();
			/* var connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
			connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";"
			connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";"
			connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
			report.dictionary.databases.list[0].connectionString = connectionString;
			var pos = 0;
			for (var i = 0; i < report.dataSources.list.length; i++) {
				var str = report.dataSources.list[i].sqlCommand;
				if (str.indexOf("pf.facturaId") > -1) pos = i;
			}
			var sql = report.dataSources.list[pos].sqlCommand;
			report.dataSources.list[pos].sqlCommand = sql + " WHERE pf.facturaId = " + f.facturaId; */
		   
			report.renderAsync(function () {
					// Creating export settings
					var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
					// Creating export service
					var service = new Stimulsoft.Report.Export.StiPdfExportService();
					// Creating MemoryStream
					var stream = new Stimulsoft.System.IO.MemoryStream();
					service.exportTo(report, stream, settings);

					var data = stream.toArray();

					var buffer = new Buffer.from(data, "utf-8");

					try {
						fs.writeFileSync(process.env.PARTE_DIR + "\\" + nomfich + ".pdf", buffer);
						var pdf = process.env.PARTE_DIR + "\\" + nomfich + ".pdf";
						var nom = nomfich.toString();
						var data = {
							parteId: parteId,
							nomfich: nom,
							pdf: pdf
						}
						return callback(null, data);
					} catch(err) {
						return callback(err);
					}
			});
}

var uploadParte = (data, codigo, callback) => {
	parametrosDb.getParametros(function(err, parametros) {
		if (err) return callback(err);
		var p = parametros[0];
		//AWS
		AWS.config.region = p.bucket_region;
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		  IdentityPoolId:  p.identity_pool,
		});
		var fileKey =  data.nomfich + "_" + codigo + ".pdf";
		const fileContent = fs.readFileSync(data.pdf);
    var params = {
        Bucket: p.bucket,
        Key: fileKey,
        IdentityPoolId: p.identity_pool,
        Body: fileContent,
        ACL: "public-read"
    }
    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new AWS.S3.ManagedUpload({
        params: params
    });
    var promise = upload.promise();
    promise
    .then (
        data2 => {
			if(data2) {
				fs.unlinkSync(data.pdf);
				//actualizamos el parte con la localización del archivo subido
				var parte = {
                    parteId: data.parteId,
                    pdf: data2.Location
                }
				var connection = getConnection();
				var sql = "UPDATE partes SET ? WHERE parteId = ?";
				sql = mysql.format(sql, [parte, parte.parteId]);
				connection.query(sql, function(err, result){
					connection.end();
					if(err) return callback(err);
					callback(null, result);
				});
			}
			
        },
        err =>{
         return callback(err);
        }
    );
	
	});
	/* const uploadFile = (parte) => {
		// Read content from the file
		const fileContent = fs.readFileSync(parte);
	
		// Setting up S3 upload parameters
		const params = {
			Bucket: BUCKET_NAME,
			Key: 'cat.jpg', // File name you want to save as in S3
			Body: fileContent
		};
	
		// Uploading files to the bucket
		s3.upload(params, function(err, data) {
			if (err) {
				throw err;
			}
			console.log(`File uploaded successfully. ${data.Location}`);
		});
	}; */
		
}


//version asincrona
//CREAR OBJETO PARA PARTE APPMOVIL
var crearObjJsonParteAsync = async (servicioId, parteId, connection) => {
	//let connection = null;
	let sql = "";
	return new Promise(async (resolve, reject) => {
		//connection = await mysql2.createConnection(obtenerConfiguracion());
		try{
			var obj = 
			{
				cabecera: "",
				locales: "",
				lineas: "",
			}
			//cabecera parte
			sql = "SELECT ";
			sql +=" p.parteId,";
			sql +=" p.servicioId,";
			sql +=" p.numParte,";
			sql +=" g.nombre AS garantia_trabajos,";
			sql +=" COALESCE(DATE_FORMAT(p.fecha_reparacion,'%d/%m/%Y'), '') AS fecha_reparacion,";
			sql +=" IF(p.observacionesDelProfesional = '', 'NOVISIBLE', IFNULL(p.observacionesDelProfesional, 'NOVISIBLE')) AS observacionesDelProfesional,";
			sql +=" IF(p.trabajos_realizados = '', 'NOVISIBLE', IFNULL(p.trabajos_realizados, 'NOVISIBLE')) AS trabajos_realizados,";
			sql +=" IF(p.trabajosPendientes = '', 'NOVISIBLE', IFNULL(p.trabajosPendientes, 'NOVISIBLE')) AS trabajosPendientes,";
			sql +=" p.descripcion_averia,";
			sql +=" p.nombreFirmante,";
			sql +=" p.apellidosFirmante,";
			sql +=" p.dniFirmante,";
			sql +=" p.cargoFirmante,";
			sql +=" p.firma,";
			sql +=" p.noFirma,";
			sql += "p.presupuesto,";
			sql += "p.refPresupuesto,"
			sql +=" c.nombre AS nombreCliente,";
			sql +=" pr.nombre AS nombreProveedor,";
			sql +=" tp.nombre AS tipoVia,";
			sql +=" c.direccion2 AS direccionTrabajo,";
			sql +=" c.poblacion2 AS poblacionTrabajo,";
			sql +=" fp.nombre AS formaPagoProveedor,";
			sql +=" fp2.nombre AS formaPagoCliente,";
			sql +=" fp.formaPagoId AS formaPagoProveedorId,";
			sql +=" fp2.formaPagoId AS formaPagoClienteId,";
			sql +=" p.empresaParteId AS empresaId,";
			sql +=" e.logoUrl,";
			sql +=" e.telefono1,";
			sql +=" e.emailReparaciones AS email";
			sql +=" FROM partes AS p";
			sql +=" LEFT JOIN servicios AS s ON s.servicioId = p.servicioId";
			sql +=" LEFT JOIN clientes AS c ON c.clienteId = s.clienteId";
			sql +=" LEFT JOIN proveedores AS pr ON pr.proveedorId = p.proveedorId";
			sql +=" LEFT JOIN tipos_via AS tp ON tp.tipoViaId = c.tipoviaId2";
			sql +=" LEFT JOIN formas_pago AS fp ON fp.formaPagoId = p.formaPagoProfesionalId";
			sql +=" LEFT JOIN formas_pago AS fp2 ON fp2.formaPagoId = p.formaPagoClienteId";
			sql +=" LEFT JOIN empresas AS e ON e.empresaId = p.empresaParteId";
			sql +=" LEFT JOIN tipos_garantia AS g ON g.tipoGarantiaId = p.tipoGarantiaId";
			sql +=" WHERE p.parteId = ?";
			sql = mysql2.format(sql, parteId);
			let [result] = await connection.query(sql);
			if(result[0].fecha_reparacion) {
				result[0].fecha_reparacion = result[0].fecha_reparacion.toString();
			}
			obj.cabecera = result[0];
			//locales afectados parte
			sql = " SELECT la.* FROM locales_afectados AS la";
			sql += " INNER JOIN servicios AS ser ON ser.servicioId = la.servicioId";
			sql += " INNER JOIN partes_locales AS pl ON la.localAfectadoId = pl.localesAfectadosId";
			sql += " WHERE ser.servicioId = ? AND pl.parteId = ?";
			sql = mysql2.format(sql, [servicioId, parteId]);
			let [result2] = await connection.query(sql);
			obj.locales = result2;
				//trabajos del parte
				
				sql = "SELECT ";
				sql += " pt.parteLineaId, ";
				sql += " pt.parteId, ";
				sql += " pt.codigoArticulo, ";
				sql += " pt.unidades, ";
				sql += " pt.descripcion, ";
				sql += " pt.ivaCliente,";
				sql += " pt.ivaProveedor,";
				sql += " a.nombre AS nombreArticulo,";
				sql += " a.administracion,"
				sql += " pt.importeProveedor,";
				sql += " pt.importeCliente,";
				sql += " pt.precioProveedor,";
				sql += " pt.precioCliente,";
				sql += " pt.importeProveedorIva,";
				sql += " pt.importeClienteIva,";
				sql += " pt.totalClienteIva,"
				sql += " pt.totalProveedorIva,";
				sql += " COALESCE(pt.tiempoTrabajo, 0) AS tiempoTrabajo,";
				sql += " pt.horaEntrada,";
				sql += " pt.horaSalida,"
				sql += " u.abrev AS unidadTipo";
				sql += " FROM partes_lineas AS pt";
				sql += " LEFT JOIN partes AS par ON par.parteId = pt.parteId";
				sql += " LEFT JOIN articulos AS a ON a.codigoReparacion = pt.codigoArticulo";
				sql += " LEFT JOIN unidades AS u ON u.unidadId = a.unidadId";
				sql += " WHERE par.parteId = ? AND NOT a.codigoReparacion IS NULL";
				sql = mysql2.format(sql, parteId);
				let [result3] = await connection.query(sql);
				var horas = 0;
				obj.cabecera.administracion = false//por defecto el parte es de tarifas
				if(result3.length > 0) {
					result3.forEach(e => {
						if(e.tiempoTrabajo) {
							if(e.tiempoTrabajo > 0) {
								obj.cabecera.horasTrabajo = e.tiempoTrabajo;
							}
						}
						if(e.horaEntrada && e.horaSalida) {
							var hEntrada = new Date(e.horaEntrada);
							var hSalida = new Date(e.horaSalida);
							
							var hEntrada = new Date(e.horaEntrada);
								obj.cabecera.horaEntrada = moment(hEntrada).format("hh:mm a");
								obj.cabecera.horaSalida = moment(hSalida).format("hh:mm a");
						}

						if(e.administracion) {
							obj.cabecera.administracion = true //si alguna de las lineas es de administración
															   // el parte entero es de administración
						}
						//SI LA FORMA DE PAGO ES EFECTIVO LOS IMPORTES SON LOS DEL CLIENTE
						if(obj.cabecera.formaPagoClienteId == 6 || obj.cabecera.formaPagoClienteId == 18 || obj.cabecera.formaPagoClienteId == 21) {
							e.importe = e.importeCliente;
							e.precio = e.precioCliente;
							e.importeIva = e.importeClienteIva;
							e.totalIva = e.totalClienteIva;
							e.iva = e.ivaCliente
						} else {
							e.importe = 0;
							e.precio = 0;
							e.importeIva = 0;
							e.totalIva = 0;
							e.iva = 0;
						}
						
					});
				}
				obj.lineas = result3;
				resolve(obj);
		}catch(err) {
			resolve(null);
		}
	});                
}

var exportToPdfAsync = async (obj) => {
	return new Promise(async (resolve, reject) => {
		try {
			var resultado = JSON.stringify(obj);
			var mrt = "parte.mrt"
			if(obj.cabecera.empresaId == 3)  mrt = "parte_fondo.mrt";
				fsp.writeFile(process.env.REPORTS_DIR + "\\parte.json", resultado)
				.then(result => {
					Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
					Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
					var nomfich = obj.cabecera.numParte;
					var parteId =  obj.cabecera.parteId;
					var report = new Stimulsoft.Report.StiReport();
					var file = "";
					file = process.env.REPORTS_DIR + "\\" + mrt;
					report.loadFile(file);
		
					var dataSet = new Stimulsoft.System.Data.DataSet("part");
					dataSet.readJson(obj);
					
					 // Remove all connections from the report template
					 report.dictionary.databases.clear();
				
					 //
					report.regData(dataSet.dataSetName, "", dataSet);
					report.dictionary.synchronize();
					
				  
					report.renderAsync(function () {
							// Creating export settings
							var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
							// Creating export service
							var service = new Stimulsoft.Report.Export.StiPdfExportService();
							// Creating MemoryStream
							var stream = new Stimulsoft.System.IO.MemoryStream();
							service.exportTo(report, stream, settings);
		
							var data = stream.toArray();
		
							var buffer = new Buffer.from(data, "utf-8");
		
							try {
								fs.writeFileSync(process.env.PARTE_DIR + "\\" + nomfich + ".pdf", buffer);
								var pdf = process.env.PARTE_DIR + "\\" + nomfich + ".pdf";
								var nom = nomfich.toString();
								var data = {
									parteId: parteId,
									nomfich: nom,
									pdf: pdf
								}
								resolve(data);
							} catch(err) {
								return resolve(null);
							}
					});
	
					
				  }).catch(err => {
					resolve(null);
				  }); 
		} catch(err) {
			resolve(null);
		}
	});
}

var uploadParteAsync = async (data, codigo, connection) => {
	let sql = "";
	return new Promise(async (resolve, reject) => {
		try {
			sql = "SELECT * FROM parametros";
			let [parametros] = await connection.query(sql);
			var p = parametros[0];
			//AWS
			AWS.config.region = p.bucket_region;
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			  IdentityPoolId:  p.identity_pool,
			});
			var fileKey =  data.nomfich + "_" + codigo + ".pdf";
			const fileContent = fs.readFileSync(data.pdf);
			var params = {
				Bucket: p.bucket,
				Key: fileKey,
				IdentityPoolId: p.identity_pool,
				Body: fileContent,
				ACL: "public-read",
				ContentType: 'application/pdf'
			}
			// Use S3 ManagedUpload class as it supports multipart uploads
			var upload = new AWS.S3.ManagedUpload({
				params: params
			});
			var promise = upload.promise();
			promise
			.then (
				data2 => {
					if(data2) {
						try {
							fs.unlinkSync(data.pdf);
							//actualizamos el parte con la localización del archivo subido
							var parte = {
								parteId: data.parteId,
								pdf: data2.Location
							}
							resolve(parte);
						} catch(err) {
							resolve(null);
						}
						
					}
					
				},
				err =>{
				 resolve(null)
				}
			);
		} catch(err) {
			resolve(null);
		}
		
	});
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

var procesaResultadoPagoProfesionales = (datosPartes, datosFactura) => {
	var objPa = [];
	var objFa = [];
	objPa = datosPartes;
	objFa = datosFactura;

	objPa.forEach( o => {
		o.cta = 0;
		o.fianza = 0;
		o.retencion = 0;
			//pasamos cada registro de datos factura al proveedor correspondiente de datosparte
			objFa.forEach( p=> {
				if(o.proveedorId == p.proveedorId) {
					o.cta += p.anticipo;
					o.fianza += p.fianza;
					o.retencion += p.retencion;
				}
			});
		o.totalBase = parseFloat(o.actuacionesCerradas + o.actuacionesAbiertas + o.PendientePago);
		o.iva =  parseFloat(o.actuacionesCerradasIva + o.actuacionesAbiertasIva + o.PendientePagoIva);
		o.contado = parseFloat(o.actuacionesCerradasContado + o.actuacionesAbiertasContado + o.pendientePagoContado);
		o.aPagar = parseFloat(((o.totalBase-o.retencion)  - (o.cta + o.contado + o.fianza)) + o.iva);

	});
    return objPa;
}


var procesaResultadoActividad = (result) => {
	//if(result.length == 0) return;
	var obj = [];
	var existencias = [];
	var pendiente = [];
	var pendienteIntervalo = [];
	var intervalo = [];
	var existenciAnterior = [];
	var existenciaIntervalo = [];
	var pagado = [];
	//primero separamos los tipos en arrays diferentes
	try{
		result.forEach(e => {
			if(e.tipo == 'E') existencias.push(e);
			else if(e.tipo == 'P') pendiente.push(e);
			else if(e.tipo == 'PI') pendienteIntervalo.push(e);
			else if(e.tipo == 'I') intervalo.push(e);
			else if(e.tipo == 'EA') existenciAnterior.push(e);
			else if(e.tipo == 'EI') existenciaIntervalo.push(e);
			else if(e.tipo == 'PA') pagado.push(e);
		});
	} catch(e) {
		console.log(e);
	}
	
	//ahora buscamos coincidencias de clientes entre los diferentes grupos
	//primero el grupo de existencias con el resto
	try{
		if(existencias.length > 0) {
			existencias.forEach(ex => {
				ex.existenciasVentas = ex.venta;
				ex.existenciasCostes = ex.coste;
				delete ex.venta;
				delete ex.coste;
				if(pendiente.length > 0) {
					ex.pendientePagoVentas = 0;
					ex.pendientePagoCostes = 0;
					for(var j = 0; j < pendiente.length; j++) {
						if(pendiente[j].encontrado) {
							
						} else {
							endiente[j].encontrado = false;
							if(ex.comercialId == endiente[j].comercialId) {
								ex.pendientePagoVentas = endiente[j].venta;
								ex.pendientePagoCostes = endiente[j].coste;
								endiente[j].encontrado = true;
								break;
							} 
						}
					}
				}else {
					ex.pendientePagoVentas = 0;
					ex.pendientePagoCostes = 0;
				}
				if(pendienteIntervalo.length > 0) {
					ex.pendientePagoVentasIntervalo = 0;
					ex.pendientePagoCostesIntervalo = 0;
					for(var j =0; j < pendienteIntervalo.length; j++) {
						if(pendienteIntervalo[j].encontrado) {
	
						} else {
							pendienteIntervalo[j].encontrado = false;
							if(ex.comercialId == pendienteIntervalo[j].comercialId) {
								ex.pendientePagoVentasIntervalo = pendienteIntervalo[j].venta;
								ex.pendientePagoCostesIntervalo = pendienteIntervalo[j].coste;
								pendienteIntervalo[j].encontrado = true;
								break;
							}
						}
					}
				} else {
					ex.pendientePagoVentasIntervalo = 0;
					ex.pendientePagoCostesIntervalo = 0;
				}
				if(intervalo.length > 0) {
					ex.intervaloVentas = 0;
					ex.intervaloCostes = 0;
					for(var j= 0; j < intervalo.length; j++) {
						if(intervalo[j].encontrado) {
	
						} else {
							intervalo[j].encontrado = false;
							if(ex.comercialId == intervalo[j].comercialId) {
								ex.intervaloVentas = intervalo[j].venta;
								ex.intervaloCostes = intervalo[j].coste;
								intervalo[j].encontrado = true;
								break;
							} 
						}
					}
				} else {
					ex.intervaloVentas = 0;
					ex.intervaloCostes = 0;
				}
	
				if(existenciAnterior.length > 0) {
					ex.existenciAnteriorVentas = 0;
					ex.existenciAnteriorCostes = 0;
					for(var j= 0; j < existenciAnterior.length; j++) {
						if(existenciAnterior[j].encontrado) {
	
						} else {
							existenciAnterior[j].encontrado = false;
							if(ex.comercialId == existenciAnterior[j].comercialId) {
								ex.existenciAnteriorVentas = existenciAnterior[j].venta;
								ex.existenciAnteriorCostes = existenciAnterior[j].coste;
								existenciAnterior[j].encontrado = true;
								break;
							} 
						}
					}
				} else {
					ex.existenciAnteriorVentas = 0;
					ex.existenciAnteriorCostes = 0;
				}
	
				if(existenciaIntervalo.length > 0) {
					ex.existenciaIntervaloVentas = 0;
					ex.existenciaIntervaloCostes = 0;
					for(var j= 0; j < existenciaIntervalo.length; j++) {
						if(existenciaIntervalo[j].encontrado) {
	
						} else {
							existenciaIntervalo[j].encontrado = false;
							if(ex.comercialId == existenciaIntervalo[j].comercialId) {
								ex.existenciaIntervaloVentas = existenciaIntervalo[j].venta;
								ex.existenciaIntervaloCostes = existenciaIntervalo[j].coste;
								existenciaIntervalo[j].encontrado = true;
								break;
							} 
						}
					}
				} else {
					ex.existenciaIntervaloVentas = 0;
					ex.existenciaIntervaloCostes = 0;
				}
	
				if(pagado.length > 0) {
					ex.pagadoVentas = 0;
					ex.pagadoCostes = 0;
					for(var j= 0; j < pagado.length; j++) {
						if(pagado[j].encontrado) {
	
						} else {
							pagado[j].encontrado = false;
							if(ex.comercialId == pagado[j].comercialId) {
								ex.pagadoVentas = pagado[j].venta;
								ex.pagadoCostes = pagado[j].coste;
								pagado[j].encontrado = true;
								break;
							} 
						}
					}
				} else {
					ex.pagadoVentas = 0;
					ex.pagadoCostes = 0;
				}
	
	
	
	
				//eliminamos los que ya esten procesados
				for(var i=0; i < pendiente.length; i++) {
					if(pendiente[i].encontrado == true){
						pendiente.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
				for(var i=0; i < pendienteIntervalo.length; i++) {
					if(pendienteIntervalo[i].encontrado == true){
						pendienteIntervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
				for(var i=0; i < intervalo.length; i++) {
					if(intervalo[i].encontrado == true){
						intervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
				for(var i=0; i < existenciAnterior.length; i++) {
					if(existenciAnterior[i].encontrado == true){
						existenciAnterior.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
	
				for(var i=0; i < existenciaIntervalo.length; i++) {
					if(existenciaIntervalo[i].encontrado == true){
						existenciaIntervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
	
				
				for(var i=0; i < pagado.length; i++) {
					if(pagado[i].encontrado == true){
						pagado.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
	
	
				
				
			});
		}
	} catch(e) {
		console.log(e);
	}
	
	
	if(pendiente.length > 0) {
		//procesamos ahora el array de pendiente con el de pendienteIntervalo e intervalo 
		try {
			pendiente.forEach(p => {
				p.pendientePagoVentas = p.venta;
				p.pendientePagoCostes = p.coste;
				p.existenciasVentas = 0;
				p.existenciasCostes = 0;
				delete p.venta;
				delete p.coste;
				if(pendienteIntervalo.length > 0) {
					p.pendientePagoVentas = 0
					p.pendientePagoCostes = 0;
					for(var j= 0; j < pendienteIntervalo.length; j++) {
						if(pendienteIntervalo[j].encontrado) {

						} else {
							pendienteIntervalo[j].encontrado = false;
							if(p.comercialId == pendienteIntervalo[j].comercialId) {
								p.pendientePagoVentas = pendienteIntervalo[j].venta;
								p.pendientePagoCostes = pendienteIntervalo[j].coste;
								pendienteIntervalo[j].encontrado = true;
								break;
							}
						}
						
					}
				} else {
					p.pendientePagoVentas = 0
					p.pendientePagoCostes = 0;
				}
				if(intervalo.length > 0) {
					p.intervaloVentas = 0;
					p.intervaloCostes = 0;
					for(var j = 0; j < intervalo.length; j++) {
						if(intervalo[j].encontrado) {
								
						} else {
							intervalo[j].encontrado = false;
							if(p.comercialId == intervalo[j].comercialId) {
								p.intervaloVentas = intervalo[j].venta;
								p.intervaloCostes = intervalo[j].coste;
								i.encontrado = true;
								break;
							} 
						}
					}
				} else {
					p.intervaloVentas = 0;
					p.intervaloCostes = 0;
				}

				if(existenciAnterior.length > 0) {
					p.existenciAnteriorVentas = 0;
					p.existenciAnteriorCostes = 0;
					for(var j= 0; j < existenciAnterior.length; j++) {
						if(existenciAnterior[j].encontrado) {
	
						} else {
							existenciAnterior[j].encontrado = false;
							if(p.comercialId == existenciAnterior[j].comercialId) {
								p.existenciAnteriorVentas = existenciAnterior[j].venta;
								p.existenciAnteriorCostes = existenciAnterior[j].coste;
								existenciAnterior[j].encontrado = true;
								break;
							} 
						}
					}
				} else {
					p.existenciAnteriorVentas = 0;
					p.existenciAnteriorCostes = 0;
				}
	
				if(existenciaIntervalo.length > 0) {
					p.existenciaIntervaloVentas = 0;
					p.existenciaIntervaloCostes = 0;
					for(var j= 0; j < existenciaIntervalo.length; j++) {
						if(existenciaIntervalo[j].encontrado) {
	
						} else {
							existenciaIntervalo[j].encontrado = false;
							if(p.comercialId == existenciaIntervalo[j].comercialId) {
								p.existenciaIntervaloVentas = existenciaIntervalo[j].venta;
								p.existenciaIntervaloCostes = existenciaIntervalo[j].coste;
								existenciaIntervalo[j].encontrado = true;
								break;
							} 
						}
					}
				} else {
					p.existenciaIntervaloVentas = 0;
					p.existenciaIntervaloCostes = 0;
				}
	
				if(pagado.length > 0) {
					p.pagadoVentas = 0;
					p.pagadoCostes = 0;
					for(var j= 0; j < pagado.length; j++) {
						if(pagado[j].encontrado) {
	
						} else {
							pagado[j].encontrado = false;
							if(p.comercialId == pagado[j].comercialId) {
								p.pagadoVentas = pagado[j].venta;
								p.pagadoCostes = pagado[j].coste;
								pagado[j].encontrado = true;
								break;
							} 
						}
					}
				} else {
					p.pagadoVentas = 0;
					p.pagadoCostes = 0;
				}
	
				//eliminamos las cioncidencias de array
				for(var i=0; i < pendienteIntervalo.length; i++) {
					if(pendienteIntervalo[i].encontrado == true){
						pendienteIntervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
				for(var i=0; i < intervalo.length; i++) {
					if(intervalo[i].encontrado == true){
						intervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}	

				for(var i=0; i < existenciAnterior.length; i++) {
					if(existenciAnterior[i].encontrado == true){
						existenciAnterior.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
	
				for(var i=0; i < existenciaIntervalo.length; i++) {
					if(existenciaIntervalo[i].encontrado == true){
						existenciaIntervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
	
				
				for(var i=0; i < pagado.length; i++) {
					if(pagado[i].encontrado == true){
						pagado.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
	
			});
		}catch(e) {
			console.log(e);
		}
	}

	//procesamos ahora el array de pendienteIntervalo con el intervalo 
	try {
		if(pendienteIntervalo.length > 0) {
			//procesamos ahora el array de pendiente con el de intervalo
				pendienteIntervalo.forEach(pi => {
					pi.pendientePagoVentasIntervalo = pi.venta;
					pi.pendientePagoCostesIntervalo = pi.coste;
					pi.existenciasVentas = 0;
					pi.existenciasCostes = 0;
					pi.pendientePagoVentas = 0;
					pi.pendientePagoCostes = 0;
					delete pi.venta;
					delete pi.coste;
					if(intervalo.length > 0) {
						pi.intervaloVentas = 0;
						pi.intervaloCostes = 0;
						for(var j = 0; j < intervalo.length; j++) {
							if(intervalo[j].encontrado) {
	
							} else {
								intervalo[j].encontrado = false;
								if(pi.comercialId == intervalo[j].comercialId) {
									pi.intervaloVentas = intervalo[j].venta;
									pi.intervaloCostes = intervalo[j].coste;
									intervalo[j].encontrado = true;
								}
							}
						}
					}else {
						pi.intervaloVentas = 0;
						pi.intervaloCostes = 0;
					}
					if(existenciAnterior.length > 0) {
						pi.existenciAnteriorVentas = 0;
						pi.existenciAnteriorCostes = 0;
						for(var j= 0; j < existenciAnterior.length; j++) {
							if(existenciAnterior[j].encontrado) {
		
							} else {
								existenciAnterior[j].encontrado = false;
								if(pi.comercialId == existenciAnterior[j].comercialId) {
									pi.existenciAnteriorVentas = existenciAnterior[j].venta;
									pi.existenciAnteriorCostes = existenciAnterior[j].coste;
									existenciAnterior[j].encontrado = true;
									break;
								} 
							}
						}
					} else {
						pi.existenciAnteriorVentas = 0;
						pi.existenciAnteriorCostes = 0;
					}
		
					if(existenciaIntervalo.length > 0) {
						pi.existenciaIntervaloVentas = 0;
						pi.existenciaIntervaloCostes = 0;
						for(var j= 0; j < existenciaIntervalo.length; j++) {
							if(existenciaIntervalo[j].encontrado) {
		
							} else {
								existenciaIntervalo[j].encontrado = false;
								if(pi.comercialId == existenciaIntervalo[j].comercialId) {
									pi.existenciaIntervaloVentas = existenciaIntervalo[j].venta;
									pi.existenciaIntervaloCostes = existenciaIntervalo[j].coste;
									existenciaIntervalo[j].encontrado = true;
									break;
								} 
							}
						}
					} else {
						pi.existenciaIntervaloVentas = 0;
						pi.existenciaIntervaloCostes = 0;
					}
		
					if(pagado.length > 0) {
						pi.pagadoVentas = 0;
						pi.pagadoCostes = 0;
						for(var j= 0; j < pagado.length; j++) {
							if(pagado[j].encontrado) {
		
							} else {
								pagado[j].encontrado = false;
								if(pi.comercialId == pagado[j].comercialId) {
									pi.pagadoVentas = pagado[j].venta;
									pi.pagadoCostes = pagado[j].coste;
									pagado[j].encontrado = true;
									break;
								} 
							}
						}
					} else {
						pi.pagadoVentas = 0;
						pi.pagadoCostes = 0;
					}
					//eliminamos las coinciencias encontradas en el array
					for(var i=0; i < intervalo.length; i++) {
						if(intervalo[i].encontrado == true){
							intervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
							i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
						}
					}	
					for(var i=0; i < existenciAnterior.length; i++) {
						if(existenciAnterior[i].encontrado == true){
							existenciAnterior.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
							i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
						}
					}
		
					for(var i=0; i < existenciaIntervalo.length; i++) {
						if(existenciaIntervalo[i].encontrado == true){
							existenciaIntervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
							i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
						}
					}
		
					
					for(var i=0; i < pagado.length; i++) {
						if(pagado[i].encontrado == true){
							pagado.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
							i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
						}
					}
		
		
				});
		}
	} catch(e) {
		console.log(e)
	}
	

	

	try {
			//procesamos el grupo de intervalo
	if(intervalo.length > 0) {	
		intervalo.forEach(i => {
			i.existenciasVentas = 0;
			i.existenciasCostes = 0;
			i.pendientePagoVentas = 0;
			i.pendientePagoCostes = 0;
			i.pendientePagoVentasIntervalo = 0;
			i.pendientePagoCostesIntervalo = 0;
			i.intervaloCostes = i.coste;
			i.intervaloVentas = i.venta
			delete i.venta;
			delete i.coste
			if(existenciAnterior.length > 0) {
				i.existenciAnteriorVentas = 0;
				i.existenciAnteriorCostes = 0;
				for(var j= 0; j < existenciAnterior.length; j++) {
					if(existenciAnterior[j].encontrado) {

					} else {
						existenciAnterior[j].encontrado = false;
						if(i.comercialId == existenciAnterior[j].comercialId) {
							i.existenciAnteriorVentas = existenciAnterior[j].venta;
							i.existenciAnteriorCostes = existenciAnterior[j].coste;
							existenciAnterior[j].encontrado = true;
							break;
						} 
					}
				}
			} else {
				i.existenciAnteriorVentas = 0;
				i.existenciAnteriorCostes = 0;
			}

			if(existenciaIntervalo.length > 0) {
				i.existenciaIntervaloVentas = 0;
				i.existenciaIntervaloCostes = 0;
				for(var j= 0; j < existenciaIntervalo.length; j++) {
					if(existenciaIntervalo[j].encontrado) {

					} else {
						existenciaIntervalo[j].encontrado = false;
						if(i.comercialId == existenciaIntervalo[j].comercialId) {
							i.existenciaIntervaloVentas = existenciaIntervalo[j].venta;
							i.existenciaIntervaloCostes = existenciaIntervalo[j].coste;
							existenciaIntervalo[j].encontrado = true;
							break;
						} 
					}
				}
			} else {
				i.existenciaIntervaloVentas = 0;
				i.existenciaIntervaloCostes = 0;
			}

			if(pagado.length > 0) {
				i.pagadoVentas = 0;
				i.pagadoCostes = 0;
				for(var j= 0; j < pagado.length; j++) {
					if(pagado[j].encontrado) {

					} else {
						pagado[j].encontrado = false;
						if(i.comercialId == pagado[j].comercialId) {
							i.pagadoVentas = pagado[j].venta;
							i.pagadoCostes = pagado[j].coste;
							pagado[j].encontrado = true;
							break;
						} 
					}
				}
			} else {
				i.pagadoVentas = 0;
				i.pagadoCostes = 0;
			}
			for(var i=0; i < existenciAnterior.length; i++) {
				if(existenciAnterior[i].encontrado == true){
					existenciAnterior.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
					i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
				}
			}

			for(var i=0; i < existenciaIntervalo.length; i++) {
				if(existenciaIntervalo[i].encontrado == true){
					existenciaIntervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
					i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
				}
			}

			
			for(var i=0; i < pagado.length; i++) {
				if(pagado[i].encontrado == true){
					pagado.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
					i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
				}
			}
		});
	}
	}catch(e){
		console.log(e);
	}
	

	try {
		if(existenciAnterior.length > 0) {	
			existenciAnterior.forEach(i => {
				i.existenciasVentas = 0;
				i.existenciasCostes = 0;
				i.pendientePagoVentas = 0;
				i.pendientePagoCostes = 0;
				i.pendientePagoVentasIntervalo = 0;
				i.pendientePagoCostesIntervalo = 0;
				i.intervaloCostes = 0;
				i.intervaloVentas = 0;
				i.existenciAnteriorCostes = i.coste;
				i.existenciAnteriorVentas = i.venta
				delete i.venta;
				delete i.coste
				
	
				if(existenciaIntervalo.length > 0) {
					i.existenciaIntervaloVentas = 0;
					i.existenciaIntervaloCostes = 0;
					for(var j= 0; j < existenciaIntervalo.length; j++) {
						if(existenciaIntervalo[j].encontrado) {
	
						} else {
							existenciaIntervalo[j].encontrado = false;
							if(i.comercialId == existenciaIntervalo[j].comercialId) {
								i.existenciaIntervaloVentas = existenciaIntervalo[j].venta;
								i.existenciaIntervaloCostes = existenciaIntervalo[j].coste;
								existenciaIntervalo[j].encontrado = true;
								break;
							} 
						}
					}
				} else {
					i.existenciaIntervaloVentas = 0;
					i.existenciaIntervaloCostes = 0;
				}
	
				if(pagado.length > 0) {
					i.pagadoVentas = 0;
					i.pagadoCostes = 0;
					for(var j= 0; j < pagado.length; j++) {
						if(pagado[j].encontrado) {
	
						} else {
							pagado[j].encontrado = false;
							if(i.comercialId == pagado[j].comercialId) {
								i.pagadoVentas = pagado[j].venta;
								i.pagadoCostes = pagado[j].coste;
								pagado[j].encontrado = true;
								break;
							} 
						}
					}
				} else {
					i.pagadoVentas = 0;
					i.pagadoCostes = 0;
				}
	
				for(var i=0; i < existenciaIntervalo.length; i++) {
					if(existenciaIntervalo[i].encontrado == true){
						existenciaIntervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
	
				
				for(var i=0; i < pagado.length; i++) {
					if(pagado[i].encontrado == true){
						pagado.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
			});
		}
	
	}catch(e){
		console.log(e);
	}

	


	try {
		if(existenciaIntervalo.length > 0) {	
			existenciaIntervalo.forEach(i => {
				i.existenciasVentas = 0;
				i.existenciasCostes = 0;
				i.pendientePagoVentas = 0;
				i.pendientePagoCostes = 0;
				i.pendientePagoVentasIntervalo = 0;
				i.pendientePagoCostesIntervalo = 0;
				i.intervaloCostes = 0;
				i.intervaloVentas = 0;
				i.existenciAnteriorCostes = 0;
				i.existenciAnteriorVentas = 0
				i.existenciaIntervaloCostes = i.coste;
				i.existenciaIntervalorVentas = i.venta
				delete i.venta;
				delete i.coste
				
	
	
				if(pagado.length > 0) {
					i.pagadoVentas = 0;
					i.pagadoCostes = 0;
					for(var j= 0; j < pagado.length; j++) {
						if(pagado[j].encontrado) {
	
						} else {
							pagado[j].encontrado = false;
							if(i.comercialId == pagado[j].comercialId) {
								i.pagadoVentas = pagado[j].venta;
								i.pagadoCostes = pagado[j].coste;
								pagado[j].encontrado = true;
								break;
							} 
						}
					}
				} else {
					i.pagadoVentas = 0;
					i.pagadoCostes = 0;
				}
	
				for(var i=0; i < pagado.length; i++) {
					if(pagado[i].encontrado == true){
						pagado.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
			});
		}
	} catch(e) {
		console.log(e);
	}
	

	if(pagado.length > 0) {	
		pagado.forEach(i => {
			i.existenciasVentas = 0;
			i.existenciasCostes = 0;
			i.pendientePagoVentas = 0;
			i.pendientePagoCostes = 0;
			i.pendientePagoVentasIntervalo = 0;
			i.pendientePagoCostesIntervalo = 0;
			i.intervaloCostes = 0;
			i.intervaloVentas = 0;
			i.existenciAnteriorCostes = 0;
			i.existenciAnteriorVentas = 0
			i.existenciaIntervaloCostes = 0;
			i.existenciaIntervalorVentas = 0;
			i.pagadoVentas = i.venta;
			i.pagadoCostes = i.coste;
			delete i.venta;
			delete i.coste
			
		});
	}
	//juntamos todos los grupos
	if(existencias.length > 0) {
		existencias.forEach(ex => {
			obj.push(ex);
		})
	}
	if(pendiente.length > 0) {
		pendiente.forEach(p => {
			obj.push(p);
		})
	}
	if(pendienteIntervalo.length > 0) {
		pendienteIntervalo.forEach(pi => {
			obj.push(pi);
		})
	}
	if(intervalo.length > 0) {
		intervalo.forEach(p => {
			obj.push(p);
		})
	}
	if(existenciAnterior.length > 0) {
		existenciAnterior.forEach(pi => {
			obj.push(pi);
		})
	}
	if(existenciaIntervalo.length > 0) {
		existenciaIntervalo.forEach(pi => {
			obj.push(pi);
		})
	}
	if(pagado.length > 0) {
		pagado.forEach(pi => {
			obj.push(pi);
		})
	}

	//una vez montado el objeto calculamos los totales y el beneficio industrial
	if(obj.length > 0) {
		obj.forEach(o => {
			o.totalPendienteVentas = o.pendientePagoVentas+o.pendientePagoVentasIntervalo;
			o.totalPendienteCostes = o.pendientePagoCostes+o.pendientePagoCostesIntervalo;
			o.totalVentas = o.existenciasVentas+o.intervaloVentas-o.totalPendienteVentas;
			o.totalCostes = o.existenciasCostes+o.intervaloCostes-o.totalPendienteCostes;
			
			o.bi = o.totalVentas-o.totalCostes;
		});
	}
	
    return obj;
}


var formateaNumero = function(reg) {
	var nuevonum = 0;
	if(reg) {
		var s = "000" + reg[0].mnum;
		var nuevonum = s.substr(s.length - 3);
		return nuevonum
	}
	return nuevonum;
}

var  actualizaTotales = function(parteId, servicioId, done) {
	var connection1 = getConnection();
	var sql2 = " SELECT COALESCE(SUM(`importeProveedor`), 0) AS importe_profesional, COALESCE(SUM(`importeCliente`),0) AS importe_cliente,";
	sql2 += " COALESCE(SUM(`importeProveedorIva`), 0) AS importe_profesional_iva, COALESCE(SUM(`importeClienteIva`),0) AS importe_cliente_iva,";
	sql2 += " COALESCE(SUM(aCuentaCliente), 0) AS aCuentaCli, COALESCE(SUM(aCuentaProveedor), 0) AS aCuentaProfesional"
	sql2 += " FROM partes_lineas";
	sql2 += " WHERE parteId = ?";
	sql2 = mysql.format(sql2, parteId);
	connection1.query(sql2, function(err, result) {
		if(err) return done(err);
		connection1.end();
		var connection2 = getConnection();
		var totales = {
			importe_cliente: result[0].importe_cliente,
			importe_profesional: result[0].importe_profesional,
			importe_cliente_iva: result[0].importe_cliente_iva,
			importe_profesional_iva: result[0].importe_profesional_iva,
			aCuentaCli: result[0].aCuentaCli,
			aCuentaProfesional: result[0].aCuentaProfesional
		}
		var sql3 = " UPDATE partes SET ? WHERE servicioId = ? AND parteId = ?";
		sql3 = mysql.format(sql3, [totales, servicioId, parteId]);
		connection2.query(sql3, function(err, result2) {
			if(err) return done(err)
			connection2.end();
			return done(null, totales);
		});
	});
}

var  actualizaTotalesACero = function(servicioId, ref, done) {
		var connection = getConnection();
		var totales = {
			importe_cliente: 0,
			importe_profesional: 0,
			importe_cliente_iva: 0,
			importe_profesional_iva: 0,
			aCuentaCli: 0,
			aCuentaProfesional: 0
		}
		var sql = " UPDATE partes SET ? WHERE servicioId = ? AND refPresupuesto = ?";
		sql = mysql.format(sql, [totales, servicioId, ref]);
		connection.query(sql, function(err, result2) {
			connection.end();
			if(err) return done(err)
			return done(null, totales);
		});
}



var fnGetNumeroParte = function(servicioId, numservicio, done) {
	var con = getConnection();
	sql = "SELECT COALESCE(MAX(num) +1, 1) AS n FROM partes";
	sql += " WHERE servicioId = ?";
    sql = mysql.format(sql, servicioId);
	con.query(sql, function (err, res) {
        con.end();
        if (err) return done(err);
		// creamos un objeto ref
		var num = res[0].n;
		var num2 = parseInt(num);
		num2 = estableceRef(num2, 3);
        done(null, num2);
    });
}

var estableceRef = function (final, numdigitos) {
    var s1 = final.toString();
    var n1 = s1.length;
	var n2 = numdigitos - n1;
	var s2 = ""
	for(var i = 0; i < n2; i++) {
		s2 = s2 + "0"
	}
	s2 = s2 + s1
    return s2;
}

//MYSQL2


module.exports.getLineaParteNew = async (parteId, lineaParteId) => {
	let connection = null;
	return new Promise(async (resolve, reject) => {
		try {
			connection = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT * FROM partes_lineas";
			sql += " WHERE parteId = ? AND parteLineaId = ?";
			sql = mysql.format(sql, [parteId, lineaParteId]);
			let [result] = await connection.query(sql);
			await connection.end();
			resolve(result);
		} catch(err) {
			if (connection) {
				if (!connection.connection._closing) {
					await connection.end()
				}
			}
			reject (err)
		}
	});
}


// postLineaParte
// crear en la base de datos la linea de parte pasada
module.exports.postLineaParteNew = async (LineaParte, parteId, servicioId) => {
	let connection = null;
	return new Promise(async (resolve, reject) => {
		try {
			connection = await mysql2.createConnection(obtenerConfiguracion());
			await connection.beginTransaction();
			LineaParte.parteLineaId = 0; // fuerza el uso de autoincremento
			LineaParte.parteId = parteId;
			var sql = "INSERT INTO partes_lineas SET ?";
			sql = mysql.format(sql, LineaParte);
			let [result] = await connection.query(sql);
				//actualizamos el total al cliente y el total al proveedor del parte

				var sql2 = " SELECT COALESCE(SUM(`importeProveedor`), 0) AS importe_profesional, COALESCE(SUM(`importeCliente`),0) AS importe_cliente,";
				sql2 += " COALESCE(SUM(`importeProveedorIva`), 0) AS importe_profesional_iva, COALESCE(SUM(`importeClienteIva`),0) AS importe_cliente_iva,";
				sql2 += " COALESCE(SUM(aCuentaCliente), 0) AS aCuentaCli, COALESCE(SUM(aCuentaProveedor), 0) AS aCuentaProfesional"
				sql2 += " FROM partes_lineas";
				sql2 += " WHERE parteId = ?";
				sql2 = mysql.format(sql2, parteId);
				let [result2] = await connection.query(sql2);
					var totales = {
						importe_cliente: result2[0].importe_cliente,
						importe_profesional: result2[0].importe_profesional,
						importe_cliente_iva: result2[0].importe_cliente_iva,
						importe_profesional_iva: result2[0].importe_profesional_iva,
						aCuentaCli: result2[0].aCuentaCli,
						aCuentaProfesional: result2[0].aCuentaProfesional
					}
					var sql3 = " UPDATE partes SET ? WHERE servicioId = ? AND parteId = ?";
					sql3 = mysql.format(sql3, [totales, servicioId, parteId]);
					let [result3] = await connection.query(sql3);
					totales.lineaParteId = result.insertId;
					await connection.commit();
					await connection.end();

					resolve(totales);
			
		} catch(err) {
			if (connection) {
				if (!connection.connection._closing) {
					await connection.rollback();
					await connection.end()
				}
			}
			reject (err)
		}
	});
}

// putLineaParteNew
// Modifica el parte según los datos del objeto pasado
module.exports.putLineaParteNew = async(id, lineaParte, servicioId) => {
	let connection = null;
	return new Promise(async (resolve, reject) => {
		try {
			if (id != lineaParte.parteLineaId) {
				throw new Error("El ID del objeto y de la url no coinciden");
			}
			connection = await mysql2.createConnection(obtenerConfiguracion());
			await connection.beginTransaction();
			sql = "UPDATE partes_lineas SET ? WHERE parteLineaId = ?";
			sql = mysql.format(sql, [lineaParte, lineaParte.parteLineaId]);
			let [result] = await connection.query(sql);
			var sql2 = " SELECT COALESCE(SUM(`importeProveedor`), 0) AS importe_profesional, COALESCE(SUM(`importeCliente`),0) AS importe_cliente,";
				sql2 += " COALESCE(SUM(`importeProveedorIva`), 0) AS importe_profesional_iva, COALESCE(SUM(`importeClienteIva`),0) AS importe_cliente_iva,";
				sql2 += " COALESCE(SUM(aCuentaCliente), 0) AS aCuentaCli, COALESCE(SUM(aCuentaProveedor), 0) AS aCuentaProfesional"
				sql2 += " FROM partes_lineas";
				sql2 += " WHERE parteId = ?";
				sql2 = mysql.format(sql2, lineaParte.parteId);
				let [result2] = await connection.query(sql2);
					var totales = {
						importe_cliente: result2[0].importe_cliente,
						importe_profesional: result2[0].importe_profesional,
						importe_cliente_iva: result2[0].importe_cliente_iva,
						importe_profesional_iva: result2[0].importe_profesional_iva,
						aCuentaCli: result2[0].aCuentaCli,
						aCuentaProfesional: result2[0].aCuentaProfesional
					}
					var sql3 = " UPDATE partes SET ? WHERE servicioId = ? AND parteId = ?";
					sql3 = mysql.format(sql3, [totales, servicioId, lineaParte.parteId]);
					let [result3] = await connection.query(sql3);
					await connection.commit();
					await connection.end();

					resolve(totales);
		} catch(err) {
			if (connection) {
				if (!connection.connection._closing) {
					await connection.rollback();
					await connection.end()
				}
			}
			reject (err)
		}
	});
}

// deleteLineaParte
// Elimina una linea de parte con el id pasado
module.exports.deleteLineaParteNew = function(id, parteId, servicioId, callback){
	let connection = null;
	return new Promise(async (resolve, reject) => {
		try {
			connection = await mysql2.createConnection(obtenerConfiguracion());
			await connection.beginTransaction();
			var sql = "DELETE from partes_lineas WHERE parteLineaId = ?";
			sql = mysql.format(sql, id);
			let [result] = await connection.query(sql);
			var sql2 = " SELECT COALESCE(SUM(`importeProveedor`), 0) AS importe_profesional, COALESCE(SUM(`importeCliente`),0) AS importe_cliente,";
				sql2 += " COALESCE(SUM(`importeProveedorIva`), 0) AS importe_profesional_iva, COALESCE(SUM(`importeClienteIva`),0) AS importe_cliente_iva,";
				sql2 += " COALESCE(SUM(aCuentaCliente), 0) AS aCuentaCli, COALESCE(SUM(aCuentaProveedor), 0) AS aCuentaProfesional"
				sql2 += " FROM partes_lineas";
				sql2 += " WHERE parteId = ?";
				sql2 = mysql2.format(sql2, parteId);
				let [result2] = await connection.query(sql2);
					var totales = {
						importe_cliente: result2[0].importe_cliente,
						importe_profesional: result2[0].importe_profesional,
						importe_cliente_iva: result2[0].importe_cliente_iva,
						importe_profesional_iva: result2[0].importe_profesional_iva,
						aCuentaCli: result2[0].aCuentaCli,
						aCuentaProfesional: result2[0].aCuentaProfesional
					}
					var sql3 = " UPDATE partes SET ? WHERE servicioId = ? AND parteId = ?";
					sql3 = mysql.format(sql3, [totales, servicioId, parteId]);
					let [result3] = await connection.query(sql3);
					await connection.commit();
					await connection.end();

					resolve(totales);
		} catch(err) {
			if (connection) {
				if (!connection.connection._closing) {
					await connection.rollback();
					await connection.end()
				}
			}
			reject (err)
		}
	});
}

module.exports.getParteOfertaProveedor = async (referencia, proveedorId) => {
	let connection = null;
	return new Promise(async (resolve, reject) => {
		try {
			connection = await mysql2.createConnection(obtenerConfiguracion());
			sql = "SELECT ac.*, ser.numServicio, ser.horaEntrada,"
			sql += "  IF(fa.numeroFacturaProveedor IS NULL, fa.numeroFacturaProveedor2, fa.numeroFacturaProveedor) AS numFactPro, fa.fecha As fecFactPro,";
			sql += " ser.fechaEntrada, ser.operadorAgente, ser.usuarioId as usuServicioId,";
			sql += " ser.direccionTrabajo, ser.poblacionTrabajo, ser.empresaId,"; 
			sql += " ser.poblacionTrabajo, ser.direccionTrabajo, cli.telefono1, cli.telefono2,";
			sql += " pro.nombre AS nombreproveedor, com.nombre as comercialNombre,";
			sql += " cli.nombre AS cliNombre, cli.proId as proId, cli.clienteId,";
			sql += " tp.nombre AS tipoProNom, fp2.nombre AS formaPagoProfesional, fp.nombre AS formaPagoCliente,";
			sql += " emp.nombre AS empresa, us.nombre AS usuServicioNombre, com2.nombre AS colaboradorNombre,"
			sql += " emp.usuCorreo AS email"
			sql += " FROM partes AS ac";
			sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
			sql += " LEFT JOIN servicios as ser ON ser.servicioId = ac.servicioId";
			sql += " LEFT JOIN comerciales as com ON com.comercialId = ser.agenteId";
			sql += " LEFT JOIN usuarios as us ON us.usuarioId = ser.usuarioId";
			sql += " LEFT JOIN clientes as cli ON cli.clienteId = ser.clienteId";
			sql += " LEFT JOIN comerciales as com2 ON com2.comercialId = cli.colaboradorId";
			sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = ser.tipoProfesionalId";
			sql += " LEFT JOIN empresas AS emp ON emp.empresaId = ser.empresaId";
			sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = ac.formaPagoClienteId";
			sql += " LEFT JOIN formas_pago AS fp2 ON fp2.formaPagoId = ac.formaPagoProfesionalId";
			sql += " LEFT JOIN facprove AS fa ON fa.facproveId = ac.facproveId";
			sql += " LEFT JOIN facturas AS f ON f.facturaId = ac.facturaId";
		
			sql += " WHERE ac.refPresupuesto = ? AND ac.proveedorId = ?";
			sql = mysql2.format(sql, [referencia, proveedorId]);
			let [result] = await connection.query(sql);
			await connection.end();
			resolve(result);
		} catch(err) {
			if (connection) {
				if (!connection.connection._closing) {
					await connection.end()
				}
			}
			reject (err)
		}
	});
}

// putParte
// Modifica el parte según los datos del objeto pasao
module.exports.putParteCreatePdf = async(id, parte, servicioId, empresa) =>{
	let connection = null;
	let sql = "";
	return new Promise(async (resolve, reject) => {
		try {
			if (id != parte.parteId)  throw new Error("El ID del objeto y de la url no coinciden");
    
			if ('nombreFirmante' in parte) {
				if(!parte.noFirma) {
					if(
						(!parte.nombreFirmante || parte.nombreFirmante == '' || parte.nombreFirmante.trim() === "") ||
						(!parte.apellidosFirmante || parte.apellidosFirmante == '' || parte.apellidosFirmante.trim() === "") ||
						(!parte.dniFirmante || parte.dniFirmante == '' || parte.dniFirmante.trim() === "") ||
						(!parte.cargoFirmante || parte.cargoFirmante == '' || parte.cargoFirmante.trim() === "") ||
						(!parte.nombreFirmante || parte.nombreFirmante == '' || parte.nombreFirmante.trim() === "") 
					)
					{
						throw new Error("El envio de los datos no se ha realizado correctamente, vuelva a aceptar. Si el problema persiste salgase del formulario y rellenelo de nuevo.");
					}
				}
			  } else {
				console.log('El objeto NO tiene la propiedad "nombre".');
			  }
			delete parte.opcion;
			connection = await mysql2.createConnection(obtenerConfiguracion());
			await connection.beginTransaction();
			sql = "UPDATE partes SET ? WHERE parteId = ?";
			sql = mysql2.format(sql, [parte, parte.parteId]);
			let [result] = await connection.query(sql);
			//await connection.end();
			let obj = await crearObjJsonParteAsync(servicioId, id, connection);
			if(!obj) throw new Error("Fallo al crear el PDF");
			let result2 = await exportToPdfAsync(obj);
			if(!result2) throw new Error("Fallo al crear el PDF");
			let result3 = await uploadParteAsync(result2, empresa, connection);
			if(!result3) throw new Error("Fallo al crear el PDF");
			sql = "UPDATE partes SET ? WHERE parteId = ?";
			sql = mysql2.format(sql, [result3, result3.parteId]);
			let [result4] = await connection.query(sql);
			await connection.commit();
			await connection.end();
			resolve(parte);

		} catch(err) {
			if(connection) {
				if (!connection.connection._closing) {
					await connection.rollback();
					await connection.end();
				} 
			}
			reject (err)
		}
	});
}


