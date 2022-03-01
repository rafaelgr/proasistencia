// servicios_db_mysql
// Manejo de la tabla servicios en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

//  leer la configurción de MySQL

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
	connection.end(function (err) {
		if (err) {
			throw err;
		}
	});
}

function closeConnectionCallback(connection, callback) {
	connection.end(function (err) {
		if (err) callback(err);
	});
}

// getServicios
// lee todos los registros de la tabla servicios y
// los devuelve como una lista de objetos
module.exports.getServicios = function (callback) {
	var connection = getConnection();
	var servicios = null;
	sql = "SELECT ser.*, ag.nombre AS comercialNombre, COUNT(par.parteId) AS numPartes, cli.proId, us.nombre AS usuNombre";
	sql += " FROM servicios AS ser";
	sql += " LEFT JOIN usuarios AS us ON us.usuarioId = ser.usuarioId"
	sql += " LEFT JOIN partes AS par ON par.servicioId = ser.servicioId "
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS ag ON ag.comercialId = ser.agenteId";
	sql += " GROUP BY ser.servicioId"
	sql += " ORDER BY  ser.fechaEntrada DESC, ser.numServicio";
	connection.query(sql, function (err, result) {
		closeConnectionCallback(connection, callback);
		if (err) {
			callback(err, null);
			return;
		}
		servicios = result;
		callback(null, servicios);
	});
}



// getServicio
// busca  el servicio con id pasado
module.exports.getServicio = function (id, callback) {
	var connection = getConnection();
	sql = "SELECT ser.*";
	sql += " FROM servicios AS ser";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS ag ON ag.comercialId = ser.agenteId";
	sql += " WHERE ser.servicioId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function (err, result) {
		closeConnectionCallback(connection, callback);
		if (err) {
			callback(err, null);
			return;
		}
		if (result.length == 0) {
			callback(null, null);
			return;
		}
		callback(null, result[0]);
	});
}

// getServicioMovil
// busca  el servicio con id pasado para la aplicación mobil
module.exports.getServicioMovil = function (id, callback) {
	var connection = getConnection();
	sql = "SELECT ser.*, cli.telefono1 AS telefono, cli.telefono2 AS telefono2,";
	sql += " cli.email, tp.nombre AS tipoProfesionNombre, e.nombre AS empresaNombre"
	sql += " FROM servicios AS ser";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN empresas  AS e ON e.empresaId = ser.empresaId";
	sql += " LEFT JOIN comerciales AS ag ON ag.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales  AS tp ON tp.tipoProfesionalId = ser.tipoProfesionalId";
	sql += " WHERE ser.servicioId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function (err, result) {
		closeConnectionCallback(connection, callback);
		if (err) {
			callback(err, null);
			return;
		}
		if (result.length == 0) {
			callback(null, null);
			return;
		}
		callback(null, result[0]);
	});
}

// Get servicio comercial
module.exports.getServicioComercial = function (id, callback) {
	var connection = getConnection();
	sql = "SELECT ser.*";
	sql += " ,DATE_FORMAT(fechaEntrada, '%Y-%m-%d') as fechaSolicitud"
	sql += " FROM servicios AS ser";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS ag ON ag.comercialId = ser.agenteId";
	sql += " WHERE ser.agenteId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function (err, result) {
		if (err) return callback(err, null);
		callback(null, result);
	});
	closeConnectionCallback(connection, callback);
}

// Get servicio comercial
module.exports.getServiciosPartes = function (id, esCliente, callback) {
	var connection = getConnection();
    var sql = "SELECT ser.*, pa.parteId, cl.nombre AS nombreCliente, tp.nombre AS tipoProfesionNombre, ep.nombre AS estadoParteNombre FROM servicios AS ser";
	sql += " LEFT JOIN partes AS pa ON pa.servicioId = ser.servicioId";
	sql += " LEFT JOIN clientes AS cl ON cl.clienteId = ser.clienteId";
	sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = pa.tipoProfesionalId";
	sql += " LEFT JOIN estados_partes AS ep ON ep.estadoParteId = pa.estadoParteId";
    if(esCliente == 'true') {
        sql += "  WHERE ser.clienteId = ?";
        sql = mysql.format(sql, id);
    } else {
		sql += "  WHERE cl.comercialId = ?";
		sql += " ORDER BY ser.fechaEntrada DESC"
        sql = mysql.format(sql, id);
    }
    
	connection.query(sql, function (err, result) {
		closeConnectionCallback(connection, callback);
		if (err) return callback(err, null);
		callback(null, result);
	});
}

// Get servicio comercial
module.exports.getServicioParte = function (servicioId, parteId, callback) {
	var connection = getConnection();
    var sql = "SELECT ser.*, pa.parteId, pa.fecha_cierre_cliente AS fechaCierre ,pa.trabajos_realizados AS notasWeb, pa.imagen, cl.nombre AS nombreCliente, tp.nombre AS tipoProfesionNombre, ep.nombre AS estadoParteNombre FROM servicios AS ser";
	sql += " LEFT JOIN partes AS pa ON pa.servicioId = ser.servicioId";
	sql += " LEFT JOIN clientes AS cl ON cl.clienteId = ser.clienteId";
	sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = pa.tipoProfesionalId";
	sql += " LEFT JOIN estados_partes AS ep ON ep.estadoParteId = pa.estadoParteId";
    sql += " WHERE ser.servicioId = ? AND pa.parteId = ?";
    sql = mysql.format(sql, [servicioId, parteId]);
	connection.query(sql, function (err, result) {
		closeConnectionCallback(connection, callback);
		if (err) return callback(err, null);
		callback(null, result);
	});
}

module.exports.getSiguienteNumero = function (done) {
	var nuevonum;
	var con = getConnection();
	var sql = "SELECT COALESCE(MAX(numServicio) + 1, 1) as mnum FROM servicios";
			con.query(sql, function (err, reg) {
					con.end();
					if (err) return done(err);
				  nuevonum = formateaNumero(reg);
					done(null, nuevonum);
			});
	
}

// Get servicio comercial
module.exports.getServicioProveedor = function (proveedorId, opcion, callback) {
	var connection = getConnection();
	var servicios = [];
	var ids = [];
	var estados = [];
	if(opcion == 'false') {
		estados = [1,3,4,5,7,8];
	} else {
		estados = [1,2,3,4,5,6,7,8];
	}
	var sql = "(SELECT DISTINCT ser.servicioId, p.parteId, p.estadoParteProfesionalId FROM servicios AS ser";
	sql += " LEFT JOIN partes AS p ON p.servicioId = ser.servicioId"
    sql += " WHERE (p.proveedorId = ? AND p.estadoParteProfesionalId IN (?))";
	sql += " OR (ser.proveedorId = ? AND p.proveedorId IS NULL))"
	sql += " ORDER BY  ser.fechaEntrada DESC, ser.numServicio"
	sql = mysql.format(sql, [proveedorId, estados, proveedorId]);
	connection.query(sql, function (err, result) {
		connection.end();
		if (err) return callback(err, null);
		result.forEach(function (c) {
			var obj = {
				servicioId: c.servicioId,
				estado: c.estadoParteProfesionalId
			}
			servicios.push(obj);
			ids.push(c.servicioId); //guardamos las ids individualmente para la siguiente select
		});


		connection = getConnection();
		sql = "SELECT ser.*,cl.nombre AS nombreCliente, tp.nombre AS tipoProfesionNombre, 0 AS cerrado FROM servicios AS ser";
		sql += " LEFT JOIN proveedores AS p ON p.proveedorId = ser.proveedorId";
		sql += " LEFT JOIN clientes AS cl ON cl.clienteId = ser.clienteId";
		sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = ser.tipoProfesionalId";
		sql += " WHERE ser.servicioId IN (?) AND confirmado <> 2";
		sql += " ORDER BY  ser.fechaEntrada DESC, ser.numServicio"
		sql = mysql.format(sql, [ids]);
		connection.query(sql, function (err, result) {
			connection.end();
			if (err) return callback(err, null);
			//comprobamos que servicios tienen partes cerrados
			try {
				for(var i = 0; i < servicios.length; i ++) {
					for(var j = 0; j < result.length; j++) {
						if( result[j].servicioId == servicios[i].servicioId ) {
							if(servicios[i].estado == 2 || servicios[i].estado == 6) {
								result[j].cerrado = 1;
							} else {
								result[j].cerrado = 0;
								break;
							}
						}
					}
				}
			} catch(e) {
				console.log(e);
			}
			
			callback(null, result);
		});
	});
}



// postServicio
// crear en la base de datos el servicio pasado
module.exports.postServicio = function (servicio, callback) {
	var usuarioId = servicio.usuarioId;
	var nuevonum;
	var con = getConnection();
	var sql = "SELECT COALESCE(MAX(numServicio) + 1, 1) as mnum FROM servicios";
			con.query(sql, function (err, reg) {
					con.end();
					if (err) return done(err);
					nuevonum = formateaNumero(reg);
					servicio.numServicio = nuevonum;
					var connection = getConnection();
					connection.beginTransaction(function(err) {
						if(err) return callback(err);
						servicio.servicioId = 0; // fuerza el uso de autoincremento
						sql = "INSERT INTO servicios SET ?";
						sql = mysql.format(sql, servicio);
						connection.query(sql, function (err, result) {
							if (err) {
								return connection.rollback(function (err2) {callback(err); });
							}
							servicio.servicioId = result.insertId;
							//recuperamos el rappel del agente
							
							var sql2 = "SELECT COALESCE(co.repComision, 0) AS porComer, cli.formaPagoId ";
							sql2 += " FROM servicios AS ser";
							sql2 += " LEFT JOIN comerciales AS com ON comercialId = ser.agenteId";
							sql2 += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
							sql2 += " LEFT JOIN contrato_comercial AS co ON co.comercialId = ser.agenteId  AND  co.empresaId = ser.empresaId";
							sql2 += " WHERE ser.servicioId = ? AND com.comercialId = ? AND ser.empresaId = ?  "
							sql2 = mysql.format(sql2, [servicio.servicioId, servicio.agenteId, servicio.empresaId]);
							connection.query(sql2, function (err, result2) {
								if (err) {
									return connection.rollback(function (err2) {callback(err); });
								}
								var parte = {
									servicioId: servicio.servicioId,
									estadoParteId: 1,
									estadoParteProfesionalId: 1,
									numParte: servicio.numServicio + '.' + '001',
									empresaParteId: servicio.empresaId,
									num: 1,
									fecha_solicitud: new Date(),
									operadorId: usuarioId,
									descripcion_averia: servicio.descripcionAveria,
									importe_cliente: 0.00,
									importe_profesional: 0.00,
									importe_cliente_iva: 0.00,
									importe_profesional_iva: 0.00,
									resultado: 0.00,
									tipoGarantiaId: 1,
									formaPagoClienteId: result2[0].formaPagoId,
									rappel: result2[0].porComer
				
								}
							
								if(servicio.tipoProfesionalId) {
									parte.tipoProfesionalId = servicio.tipoProfesionalId
								}
								var sql3 = "INSERT INTO partes SET ?"
								sql3 = mysql.format(sql3, parte);
								connection.query(sql3, function(err, result3) {
									if (err) {
										return connection.rollback(function (err2) {callback(err); });
									}
									connection.commit(function (err) {
										if (err) return connection.rollback(function (err2) { callback(err) });
										connection.end();
										callback(null, servicio);//todo correcto
									});
								});
							});
						});
					});
			});
}



// putServicio
// Modifica el servicio según los datos del objeto pasao
module.exports.putServicio = function (id, servicio, callback) {
	if (id != servicio.servicioId) {
		var err = new Error("El ID del objeto y de la url no coinciden");
		callback(err);
		return;
	}
	var connection = getConnection();
	sql = "UPDATE servicios SET ? WHERE servicioId = ?";
	sql = mysql.format(sql, [servicio, servicio.servicioId]);
	connection.query(sql, function (err, result) {
		closeConnectionCallback(connection, callback);
		if (err) {
			callback(err);
			return;

		}
		callback(null, servicio);
	});
}

// PutEstadoServicio
// Modifica el estado de un servicio
module.exports.PutEstadoServicio = function (id, servicio, callback) {
	if (id != servicio.servicioId) {
		var err = new Error("El ID del objeto y de la url no coinciden");
		callback(err);
		return;
	}
	var connection = getConnection();
	sql = "UPDATE servicios SET ? WHERE servicioId = ?";
	sql = mysql.format(sql, [servicio, servicio.servicioId]);
	connection.query(sql, function (err, result) {
		closeConnectionCallback(connection, callback);
		if (err) {
			callback(err);
			return;

		}
		callback(null, servicio);
	});
}

// deleteServicio
// Elimina el servicio con el id pasado
module.exports.deleteServicio = function (id, servicio, callback) {
	var connection = getConnection();
	sql = "DELETE from servicios WHERE servicioId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function (err, result) {
		closeConnectionCallback(connection, callback);
		if (err) {
			callback(err);
			return;
		}
		callback(null);
	});
}

var formateaNumero = function(reg) {
	var nuevonum = 0;
	if(reg) {
		if (reg.length > 0) {
			var mnum = parseInt(reg[0].mnum);
		}
		var s = "000000" + mnum;
		var nuevonum = s.substr(s.length - 6);
		return nuevonum
	}
	return nuevonum;
}

