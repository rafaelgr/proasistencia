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
	sql = "SELECT ser.*, ag.nombre AS comercialNombre, COUNT(par.parteId) AS numPartes, cli.proId";
	sql += " FROM servicios AS ser";
	sql += " LEFT JOIN partes AS par ON par.servicioId = ser.servicioId "
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS ag ON ag.comercialId = ser.agenteId";
	sql += " GROUP BY ser.servicioId"
	connection.query(sql, function (err, result) {
		if (err) {
			callback(err, null);
			return;
		}
		servicios = result;
		callback(null, servicios);
	});
	closeConnectionCallback(connection, callback);
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
	closeConnectionCallback(connection, callback);
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

module.exports.getSiguienteNumero = function (done) {
	var nuevonum;
	var con = getConnection();
	var sql = "SELECT COALESCE(MAX(numServicio) + 1, 0) as mnum FROM servicios";
			con.query(sql, function (err, reg) {
					con.end();
					if (err) return done(err);
				  nuevonum = formateaNumero(reg);
					done(null, nuevonum);
			});
	
}



// postServicio
// crear en la base de datos el servicio pasado
module.exports.postServicio = function (servicio, callback) {
	var connection = getConnection();
	var usuarioId = servicio.usuarioId;
	delete servicio.usuarioId;
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
				var parte = {
					servicioId: servicio.servicioId,
					estadoParteId: 1,
					numParte: servicio.numServicio + '.' + '001',
					num: 1,
					fecha_solicitud: new Date(),
					empresaId: servicio.empresaId,
					operadorId: usuarioId,
					descripcion_averia: servicio.descripcionAveria,
					importe_cliente: 0.00,
					importe_profesional: 0.00,
					resultado: 0.00
				}
				if(servicio.tipoProfesionalId) {
					parte.tipoProfesionalId = servicio.tipoProfesionalId
				}
			var sql2 = "INSERT INTO partes SET ?"
			sql2 = mysql.format(sql2, parte);
			connection.query(sql2, function(err, result) {
				if (err) {
					return connection.rollback(function (err2) {callback(err); });
				}
				connection.commit(function (err) {
					connection.end()
					if (err) return connection.rollback(function (err2) { callback(err) });
					callback(null, servicio);//todo correcto
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
		if (err) {
			callback(err);
			return;

		}
		callback(null, servicio);
	});
	closeConnectionCallback(connection, callback);
}

// deleteServicio
// Elimina el servicio con el id pasado
module.exports.deleteServicio = function (id, servicio, callback) {
	var connection = getConnection();
	sql = "DELETE from servicios WHERE servicioId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function (err, result) {
		if (err) {
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
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