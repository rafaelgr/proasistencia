// servicios_db_mysql
// Manejo de la tabla servicios en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
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
	sql = "SELECT ser.*, CONCAT(ser.calle,' Nº ' ,ser.numero, ' ',ser.poblacion,' (', ser.provincia, ')') AS direccion, us.nombre AS usuario, cli.nombre AS cliente, ag.nombre AS agente, tp.nombre AS tipoProfesional";
	sql += " FROM servicios AS ser";
	sql += " LEFT JOIN usuarios AS us ON us.usuarioId = ser.usuarioId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS ag ON ag.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = ser.tipoProfesionalId";
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
	sql = "SELECT ser.*, CONCAT(ser.calle,' Nº ' ,ser.numero, ' ',ser.poblacion,' (', ser.provincia, ')') AS direccion, us.nombre AS usuario, cli.nombre AS cliente, ag.nombre AS agente, tp.nombre AS tipoProfesional";
	sql += " FROM servicios AS ser";
	sql += " LEFT JOIN usuarios AS us ON us.usuarioId = ser.usuarioId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS ag ON ag.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = ser.tipoProfesionalId";
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
	sql = "SELECT ser.*, CONCAT(ser.calle,' Nº ' ,ser.numero, ' ',ser.poblacion,' (', ser.provincia, ')') AS direccion, us.nombre AS usuario, cli.nombre AS cliente, ag.nombre AS agente, tp.nombre AS tipoProfesional";
	sql += " ,DATE_FORMAT(fechaCreacion, '%Y-%m-%d') as fechaSolicitud"
	sql += " FROM servicios AS ser";
	sql += " LEFT JOIN usuarios AS us ON us.usuarioId = ser.usuarioId";
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS ag ON ag.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = ser.tipoProfesionalId";
	sql += " WHERE ser.agenteId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function (err, result) {
		if (err) return callback(err, null);
		callback(null, result);
	});
	closeConnectionCallback(connection, callback);
}


// postServicio
// crear en la base de datos el servicio pasado
module.exports.postServicio = function (servicio, callback) {
	var connection = getConnection();
	servicio.servicioId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO servicios SET ?";
	sql = mysql.format(sql, servicio);
	connection.query(sql, function (err, result) {
		if (err) {
			callback(err);
			return;
		}
		servicio.servicioId = result.insertId;
		callback(null, servicio);
	});
	closeConnectionCallback(connection, callback);
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