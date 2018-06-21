// bi_db_mysql
// Manejo de la tabla bi en la base de datos
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
		host: config.host,
		user: config.user,
		password: config.password,
		database: config.database,
		port: config.port
	});
	connection.connect(function (err) {
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

module.exports.getTabla = function (tabla, done) {
	var con = getConnection();
	sql = "SELECT * FROM " +  tabla;
	con.query(sql, function (err, rows) {
		if (err) return done(err);
		done(null, rows);
	});
}

