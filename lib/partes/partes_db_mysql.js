// actuaciones_db_mysql
// Manejo de la tabla partes en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var moment = require('moment');
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var sql = "";
var fs = require('fs');

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
	sql = "SELECT ac.*, ser.numServicio, ser.horaEntrada, ser.fechaEntrada, ser.operadorAgente, ser.direccionTrabajo, ser.urgente, ser.necesitaPresupuesto, ser.empresaId, pro.nombre AS nombreproveedor, com.nombre as comercialNombre, cli.nombre AS cliNombre, cli.proId as proId, tp.nombre AS tipoProNom,";
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
	if (id != 100) {
		sql += " WHERE ac.estadoParteId = ?";
		sql = mysql.format(sql, id);
	}
	sql += " ORDER BY ac.numParte, ser.fechaEntrada, ac.fecha_prevista, ac.fecha_reparacion"
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

// getPartesEstadoComercial
// busca  los partes con la id del esatdo pasada
module.exports.getPartesEstadoComercial = function(estadoParteId, comercialId, callback){
	var connection = getConnection();
    var partes = null;
	sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
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
	sql += " WHERE cli.colaboradorId = ?"
	sql = mysql.format(sql, comercialId);
	if (estadoParteId != 100) {
		sql += "  AND ac.estadoParteId = ?";
		sql = mysql.format(sql, estadoParteId);
	}
	sql += " ORDER BY ac.numParte, ser.fechaEntrada, ac.fecha_prevista, ac.fecha_reparacion"
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
	sql += " WHERE ac.estadoParteId = 5 AND ac.fecha_cierre_cliente >= '" + deFecha + "' AND ac.fecha_cierre_cliente <= '"+ aFecha+"' AND ac.facturaId IS NULL";
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
	var sql = "SELECT pt.*, par.facproveId, par.facturaId FROM partes_lineas AS pt";
	sql += " LEFT JOIN partes AS par ON par.parteId = pt.parteId"
	sql += " WHERE par.parteId = ?";
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
					if (err)
					return done(err);
					obj.parteId = result.insertId;
					datos.push(obj);
					done(null, null);
				});
				closeConnectionCallback(connection, done);
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
			closeConnectionCallback(connection, callback);
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
					closeConnectionCallback(connection, done);
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

module.exports.putPartes = function (partes, callback){
	var datos = [];
	async.eachSeries(partes,
		(parte, done) => {
				var connection = getConnection();
				sql = "UPDATE partes SET ? WHERE parteId = ?";
				sql = mysql.format(sql, [parte, parte.parteId]);
				connection.query(sql, function(err, result){
					if (err)
					return done(err);
					done(null, null);
				});
				closeConnectionCallback(connection, done);
		},
		(err) => {
			if (err) return callback(err);
			callback(null, null);
		});
}


// putPartesServicio
// Modifica los partes de un servicio
module.exports.putPartesServicio = function(servicioId, parte, ref, callback){
	var connection = getConnection();
	ref = ref.replace('@', "/");
	sql = "UPDATE partes SET ? WHERE servicioId = ?  AND refPresupuesto = ?";
	sql = mysql.format(sql, [parte, servicioId, ref]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null, result);
	});
	closeConnectionCallback(connection, callback);
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
		if (err){
			callback(err);
			return;
		}
		callback(null, result);
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

// deleteLineaParte
// Elimina una linea de parte con el id pasado
module.exports.deleteLineasPartesOfertas = function(servicioId, ref, callback){
	var connection = getConnection();
	sql = "DELETE partes_lineas FROM partes_lineas";
	sql += " INNER JOIN partes  ON partes.parteId = partes_lineas.parteId ";
	sql += " WHERE partes.servicioId = ? AND partes.refPresupuesto = ?";
	sql = mysql.format(sql, [servicioId, ref]);
	connection.query(sql, function(err, result){
		if (err)
			return callback(err);
		//actualizamos el total al cliente y el total al proveedor del parte
		actualizaTotalesACero(servicioId, ref, function(err, result2) {
			if (err) return callback(err);
			callback(null, result2);
			closeConnectionCallback(connection, callback);
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
	sql += " tmp.empresaNombre,";
	sql += " SUM(tmp.venta) AS venta,";
	sql += " SUM(tmp.coste) AS coste,";
	sql += " tmp.inicioIntervalo,";
	sql += " tmp.finIntervalo"
	sql += " FROM"
	sql += " (SELECT"; 
	sql += " 'E' AS tipo,"
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql +=" cli.direccion2 AS direccionTrabajo,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";
	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente) AS venta, SUM(p.importe_profesional)  AS coste";
	sql += " FROM partes  AS p"; 
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId"; 
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " WHERE p.fecha_cierre_profesional < '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_cliente IS NULL"; 
	if (clienteId > 0) {
        sql += " AND s.clienteId IN (" + clienteId + ")";
    }
    if (empresaId) {
        sql += " AND s.empresaId IN (" + empresaId + ")";
	}
	sql += "  GROUP BY s.clienteId";

	sql += " UNION";
	sql += " SELECT"; 
	sql += " 'P' AS tipo,";
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql +=" cli.direccion2 AS direccionTrabajo,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";
	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente) AS venta, SUM(p.importe_profesional)  AS coste";
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId";
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " WHERE p.fecha_cierre_cliente <= '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_profesional IS NULL";
	if (clienteId > 0) {
        sql += " AND s.clienteId IN (" + clienteId + ")";
    }
    if (empresaId) {
        sql += " AND s.empresaId IN (" + empresaId + ")";
	}
	sql += " GROUP BY s.clienteId";


	sql += " UNION";
	sql += " SELECT";
	sql += " 'I' AS tipo,"
	sql += " s.clienteId,";
	sql += " cli.nombre AS clienteNombre,";
	sql +=" cli.direccion2 AS direccionTrabajo,";
	sql += " cli.proId AS cliCodigo,";
	sql += " e.nombre AS empresaNombre,";
	sql += " '" + dFecha + " 00:00:00' AS inicioIntervalo,";
	sql += " '" + hFecha + " 00:00:00' AS finIntervalo,";
	sql += " SUM(p.importe_cliente)  AS venta , SUM(p.importe_profesional)  AS coste"
	sql += " FROM partes  AS p";
	sql += " LEFT JOIN servicios AS s ON s.servicioId = p.servicioId"; 
	sql += " LEFT JOIN empresas AS e ON e.empresaId = s.empresaId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = s.clienteId";
	sql += " WHERE p.fecha_cierre_profesional >= '" + dFecha + " 00:00:00' AND p.fecha_cierre_profesional <= '" + hFecha + " 23:59:59' AND p.fecha_cierre_cliente IS NULL"; 
	if (clienteId > 0) {
        sql += " AND s.clienteId IN (" + clienteId + ")";
    }
    if (empresaId) {
        sql += " AND s.empresaId IN (" + empresaId + ")";
	}
	sql += " GROUP BY s.clienteId) AS tmp"; 
	sql += " GROUP BY tmp.tipo, tmp.clienteId";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
		obj.libCli = procesaResultado(result);
		

       /* var resultado = JSON.stringify(obj);
        fs.writeFile(process.env.REPORTS_DIR + "\\listado_existencias.json", resultado, function(err) {
            if(err) return callback(err);
            //return callback(null, true);
        });  */
        callback(null, obj);
    });
 
}

var procesaResultado = (result) => {
	//if(result.length == 0) return;
	var obj = [];
	var existencias = [];
	var pendiente = [];
	var intervalo = [];
	//primero separamos los tipos en arrays diferentes
	result.forEach(e => {
		if(e.tipo == 'E') existencias.push(e);
		else if(e.tipo == 'P') pendiente.push(e);
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

			//eliminamos los que ya esten procesados
			for(var i=0; i < pendiente.length; i++) {
				if(pendiente[i].encontrado == true){
					pendiente.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
					i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
				}
			}
			for(var i=0; i < intervalo.length; i++) {
				if(intervalo[i].encontrado == true){
					intervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
					i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
				}
			}
	
			
		});
	}
	
	if(pendiente.length > 0) {
		//procesamos ahora el array de pendiente con el de intervalo
		try {
			pendiente.forEach(p => {
				encontradointervalo = false;
				p.pendientePagoVentas = p.venta;
				p.pendientePagoCostes = p.coste;
				p.existenciasVentas = 0;
				p.existenciasCostes = 0;
				delete p.venta;
				delete p.coste;
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
				//eliminamos las cioncidencias de array
				for(var i=0; i < intervalo.length; i++) {
					if(intervalo[i].encontrado == true){
						intervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}	
			});
		}catch(e) {
			console.log(e);
		}
		
	}
	
	//los que quedan en el array de intervalo no tienen ninguna coincidencuia con los otros
	if(intervalo.length > 0) {	
		intervalo.forEach(i => {
			i.existenciasVentas = 0;
			i.existenciasCostes = 0;
			i.pendientePagoVentas = 0;
			i.pendientePagoCostes = 0;
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
	if(pendiente.length > 0) {
		pendiente.forEach(p => {
			obj.push(p);
		})
	}
	if(intervalo.length > 0) {
		intervalo.forEach(p => {
			obj.push(p);
		})
	}

	//una vez montado el objeto calculamos los totales y el beneficio industrial
	if(obj.length > 0) {
		obj.forEach(o => {
			o.totalVentas = o.existenciasVentas+o.intervaloVentas-o.pendientePagoVentas;
			o.totalCostes = o.existenciasCostes+o.intervaloCostes-o.pendientePagoCostes;
			o.bi = o.totalVentas-o.totalCostes;
		});
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
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = cli.comercialId"
	sql += " WHERE p.fecha_cierre_profesional < '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_cliente IS NULL"; 
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
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = cli.comercialId"
	sql += " WHERE p.fecha_cierre_cliente <= '" + dFecha + " 00:00:00'";
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
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = cli.comercialId"
	sql += " WHERE p.fecha_cierre_cliente >= '" + dFecha + " 00:00:00'";
	sql += " AND p.fecha_cierre_cliente <= '" + hFecha + " 23:59:59'";
	sql += " AND p.fecha_cierre_profesional IS NULL";
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
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = cli.comercialId"
	sql += " WHERE p.fecha_cierre_profesional >= '" + dFecha + " 00:00:00' AND p.fecha_cierre_profesional <= '" + hFecha + " 23:59:59'"; 
	sql += " GROUP BY co.comercialId) AS tmp"; 
	sql += " GROUP BY tmp.tipo, tmp.comercialId";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
		obj.libCli = procesaResultadoActividad(result);
		

       var resultado = JSON.stringify(obj);
        fs.writeFile(process.env.REPORTS_DIR + "\\reporte_actividad.json", resultado, function(err) {
            if(err) return callback(err);
            //return callback(null, true);
        }); 
        callback(null, obj);
    });
 
}

var procesaResultadoActividad = (result) => {
	//if(result.length == 0) return;
	var obj = [];
	var existencias = [];
	var pendiente = [];
	var pendienteIntervalo = [];
	var intervalo = [];
	//primero separamos los tipos en arrays diferentes
	result.forEach(e => {
		if(e.tipo == 'E') existencias.push(e);
		else if(e.tipo == 'P') pendiente.push(e);
		else if(e.tipo == 'PI') pendienteIntervalo.push(e);
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
			
		});
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
			});
		}catch(e) {
			console.log(e);
		}
	}

	//procesamos ahora el array de pendienteIntervalo con el intervalo 
	if(pendienteIntervalo.length > 0) {
		//procesamos ahora el array de pendiente con el de intervalo
			pendienteIntervalo.forEach(pi => {
				pi.pendientePagoVentasIntervalo = pi.venta;
				pi.pendientePagoCostesIntervalo = pi.coste;
				pi.existenciasVentas = 0;
				pi.existenciasCostes = 0;
				p.pendientePagoVentas = 0;
				p.pendientePagoCostes = 0;
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
				//eliminamos las coinciencias encontradas en el array
				for(var i=0; i < intervalo.length; i++) {
					if(intervalo[i].encontrado == true){
						intervalo.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}	
	
			});
	}

	
	
	//los que quedan en el array de intervalo no tienen ninguna coincidencia con los otros
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
			if(err) return done(err)
			connection.end();
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