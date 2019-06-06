// actuaciones_db_mysql
// Manejo de la tabla partes en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var moment = require('moment');
var sql = "";

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
		if (err){
			callback(err, null);
			return;
		}
		partes = result;
		callback(null, partes);
		
	});	
	closeConnectionCallback(connection, callback);
}




// getParte
// busca  la parte con id pasado
module.exports.getParte = function(id, callback){
	var connection = getConnection();
    var partes = null;
	sql = "SELECT ac.*, ser.numServicio, ser.horaEntrada, ser.fechaEntrada, ser.operadorAgente, ser.direccionTrabajo, ser.urgente, ser.necesitaPresupuesto, pro.nombre AS nombreproveedor, com.nombre as comercialNombre, cli.nombre AS cliNombre, cli.proId as proId, tp.nombre AS tipoProNom,";
	sql += " emp.nombre AS nomEmpre, us.nombre AS usuServicioNombre"
    sql += " FROM partes AS ac";
	sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN servicios as ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN comerciales as com ON com.comercialId = ser.agenteId";
	sql += " LEFT JOIN usuarios as us ON us.usuarioId = ser.usuarioId";
	sql += " LEFT JOIN clientes as cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = ser.tipoProfesionalId";
	sql += " LEFT JOIN empresas AS emp ON emp.empresaId = ser.empresaId";

    //sql += " LEFT JOIN estados_presupuesto AS ep ON ep.estadoPresupuestoId = ac.estadoPresupuestoId";
    //sql += " LEFT JOIN estados_partes AS ea ON ea.estadoParteId = ac.estadoParteId";
	sql += " WHERE ac.parteId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
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
	closeConnectionCallback(connection, callback);
}


// getParte
// busca  el parte con id pasado
module.exports.getParteServicio = function(id, callback){
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
	sql += " WHERE ser.servicioId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
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
	closeConnectionCallback(connection, callback);
}

// getPartesEstado
// busca  los partes con la id del esatdo pasada
module.exports.getPartesEstado = function(id, callback){
	var connection = getConnection();
    var partes = null;
	sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
	sql += " tp.nombre AS tipoProfesionalNombre, cli.nombre AS nombreCliente, cli.proId, cli.clienteId as clienteId, co.nombre AS comercialNombre, ser.direccionTrabajo,";
    sql += " emp.nombre as empresa, ser.empresaId AS empresaId, ser.horaEntrada FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ser.empresaId";
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ac.tipoProfesionalId";
	if (id != 100) {
		sql += " WHERE ac.estadoParteId = ?";
		sql = mysql.format(sql, id);
	}
	connection.query(sql, function(err, result){
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
	closeConnectionCallback(connection, callback);
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

module.exports.getRefPresupuesto = function (servicioId,  refPresupuesto, done) {
	refPresupuesto = refPresupuesto.replace('@', '/');
	var con = getConnection();
	var sql = "SELECT refPresupuesto, parteId, ser.servicioId FROM partes AS par";
	sql += " LEFT JOIN servicios ser ON ser.servicioId = par.servicioId";
	sql += " WHERE refPresupuesto  = ? AND ser.servicioId NOT IN (?)";
	sql = mysql.format(sql, [refPresupuesto, servicioId]);
			con.query(sql, function (err, ref) {
					con.end();
					if (err) return done(err);
					done(null, ref);
			});
}

module.exports.getPartesCerradosFacturar = function (deFecha, aFecha, clienteId, done) {
	var con = getConnection();
	deFecha = moment(deFecha, 'DD.MM.YYYY').format('YYYY-MM-DD HH:mm');
	aFecha = moment(aFecha, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm');
	clienteId = parseInt(clienteId);
	sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
	sql += " tp.nombre AS tipoProfesionalNombre, cli.nombre AS nombreCliente, cli.proId, cli.clienteId as clienteId, co.nombre AS comercialNombre, ser.direccionTrabajo,";
    sql += " emp.nombre as empresa, ser.empresaId AS empresaId, ser.horaEntrada FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ser.empresaId";
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ac.tipoProfesionalId";
	sql += " WHERE ac.estadoParteId = 5 AND ac.fecha_solicitud >= '" + deFecha + "' AND ac.fecha_solicitud <= '"+ aFecha+"'";
 	if(clienteId) {
		 sql += " AND cli.clienteId = "+clienteId
	 }
	 sql+= " ORDER BY cli.nombre ASC"
	 con.query(sql, function (err, ref) {
		con.end();
		if (err) return done(err);
		done(null, ref);
	});
}

module.exports.getLineasParte = function (parteId, done) {
	var con = getConnection();
	var sql = "SELECT * FROM partes_lineas";
	sql += " WHERE parteId = ?";
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
	parte.parteId = 0; // fuerza el uso de autoincremento
	array = parte.numParte.split(".");
	parte.num = parseInt(array[1])// contador del numero de parte
	sql = "INSERT INTO partes SET ?";
	sql = mysql.format(sql, parte);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		parte.parteId = result.insertId;
		callback(null, parte);
	});
	closeConnectionCallback(connection, callback);
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
			closeConnectionCallback(connection, callback);
		});
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
	var connection = getConnection();
	sql = "UPDATE partes SET ? WHERE parteId = ?";
	sql = mysql.format(sql, [parte, parte.parteId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null, parte);
	});
	closeConnectionCallback(connection, callback);
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
			closeConnectionCallback(connection, callback);
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
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}

// deleteLineaParte
// Elimina una linea de parte con el id pasado
module.exports.deleteLineaParte = function(id, parteId, servicioId, callback){
	var connection = getConnection();
	sql = "DELETE from partes_lineas WHERE ParteLineaId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
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
			closeConnectionCallback(connection, callback);
		});
	});
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
	var connection = getConnection();
	var sql = " SELECT COALESCE(SUM(`importeProveedor`), 0) AS importe_profesional, COALESCE(SUM(`importeCliente`),0) AS importe_cliente,";
	sql += " COALESCE(SUM(`importeProveedorIva`), 0) AS importe_profesional_iva, COALESCE(SUM(`importeClienteIva`),0) AS importe_cliente_iva"
	sql += " FROM partes_lineas";
	sql += " WHERE parteId = ?";
	sql = mysql.format(sql, parteId);
	connection.query(sql, function(err, result) {
		if(err) return done(err);
		var totales = {
			importe_cliente: result[0].importe_cliente,
			importe_profesional: result[0].importe_profesional,
			importe_cliente_iva: result[0].importe_cliente_iva,
			importe_profesional_iva: result[0].importe_profesional_iva
		}
		var sql2 = " UPDATE partes SET ? WHERE servicioId = ? AND parteId = ?";
		sql2 = mysql.format(sql2, [totales, servicioId, parteId]);
		connection.query(sql2, function(err, result2) {
			if(err) return done(err)
			connection.end();
			return done(null, totales);
		});
	});
}